import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/general';
import { useTenant } from '@/hooks/useTenant';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTenant } from '@/lib/api/tenant';
import { Tenant } from '@/lib/db/schema';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { sendDynamicSaveOfferEmail } from '@/lib/email/templates/DynamicSaveOfferTemplate';

const DynamicSaveOfferSection = () => {
  const { userData } = useAuth();
  const { data: tenant } = useTenant(userData?.tenantId);
  const queryClient = useQueryClient();

  const saveOffersDynamicMutation = useMutation({
    mutationFn: async () => {
      if (!tenant) throw new Error('Tenant data is not available');

      await sendDynamicSaveOfferEmail({
        tenantName: userData?.tenantName,
        tenantEmail: userData?.email,
      });

      const updatedTenant: Tenant = {
        ...tenant,
        saveOffersDynamicRequestSentAt: new Date().toISOString(),
      };

      return updateTenant(updatedTenant);
    },
    onSuccess: () => {
      if (tenant?.id) {
        queryClient.invalidateQueries({ queryKey: ['tenant', tenant.id] });
      }
    },
    onError: error => {
      toast.error('Failed to send request\n' + error.message);
    },
  });

  const handleSendRequest = () => {
    saveOffersDynamicMutation.mutate();
  };

  const formatISO = (date: string | undefined) => {
    if (!date) return '-';
    return formatDate(date, { withTime: false });
  };

  return (
    <div className="h-full py-4 flex flex-col gap-4">
      <h2>Dynamic Save Offers</h2>
      <Text className="max-w-prose">
        Enable Dynamic Save Offers to automatically generate tailored offers for
        your customers based on their behavior and cancellation requests. By
        enabling this feature, you grant us access to your Stripe user data. Our
        system will analyze key data points, such as user history and
        demographics, to determine the best retention offers, like extended free
        periods, that are most likely to prevent cancellations. These offers are
        dynamically adjusted for different customer segments, ensuring the most
        effective incentives are presented.
      </Text>
      <div className="flex items-center gap-x-2">
        <Button
          onClick={handleSendRequest}
          color="blue"
          loading={saveOffersDynamicMutation.isPending}
          disabled={tenant?.saveOffersDynamicRequestSentAt !== undefined}
        >
          Send request
        </Button>
        {tenant?.saveOffersDynamicRequestSentAt && (
          <p>
            <span className="text-gray-600 mr-2">Request sent on</span>
            <span className="text-gray-400 text-sm">
              {formatISO(tenant?.saveOffersDynamicRequestSentAt)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default DynamicSaveOfferSection;
