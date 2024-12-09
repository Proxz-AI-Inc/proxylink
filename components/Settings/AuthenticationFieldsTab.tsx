import { FC, useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getTenant, updateTenant } from '@/lib/api/tenant';
import AUTH_FIELDS from '@/constants/authFields.json';
import { CustomerInfoField } from '@/lib/db/schema';
import { FieldGroup, Fieldset } from '@/components/ui/fieldset';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/spinner';

interface Props {
  tenantId: string;
  isEnabled: boolean;
}

const AuthenticationFieldsTab: FC<Props> = ({ tenantId, isEnabled }) => {
  const [authFields, setAuthFields] = useState<string[] | null>(null);
  const queryClient = useQueryClient();

  const { data: org, isLoading } = useQuery({
    queryKey: ['organization', tenantId],
    queryFn: () => getTenant(tenantId),
    enabled: !!tenantId,
  });

  useEffect(() => {
    if (org?.requiredCustomerInfo && authFields === null) {
      setAuthFields(org.requiredCustomerInfo);
    }
  }, [org, authFields]);

  const mutation = useMutation({
    mutationFn: updateTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', tenantId] });
      toast.success('Authentication fields updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSave = () => {
    if (!org) return;
    mutation.mutate({
      ...org,
      requiredCustomerInfo: authFields as CustomerInfoField[],
    });
  };

  const handleFieldChange = useCallback(
    (field: string, checked: boolean) => {
      if (checked) {
        setAuthFields([...(authFields || []), field]);
      } else if (authFields) {
        setAuthFields(authFields.filter(f => f !== field));
      }
    },
    [authFields],
  );

  if (!isEnabled) return null;
  if (isLoading) return <Loader />;

  return (
    <div className="h-full w-full py-8">
      <Fieldset>
        <FieldGroup>
          <div className="space-y-4">
            <p className="text-base text-gray-500">
              Select the fields needed to authenticate your customers.
              <br /> Proxies must provide this information when submitting a
              request.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              {AUTH_FIELDS.map(item => (
                <label key={item.field} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={item.field}
                    checked={authFields?.includes(item.field)}
                    onChange={e =>
                      handleFieldChange(item.field, e.target.checked)
                    }
                  />
                  <span className="ml-2">{item.display}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleSave}
              disabled={mutation.isPending}
              loading={mutation.isPending}
              color="primary"
            >
              Save Changes
            </Button>
          </div>
        </FieldGroup>
      </Fieldset>
    </div>
  );
};

export default AuthenticationFieldsTab;
