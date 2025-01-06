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
  const queryClient = useQueryClient();
  const [authFields, setAuthFields] = useState<string[] | null>(null);
  const [columnCount, setColumnCount] = useState(5);

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

  useEffect(() => {
    const getColumnsCount = () => {
      const width = window.innerWidth;
      if (width < 640) return 1;
      if (width < 991) return 2;
      if (width < 1024) return 3;
      if (width < 1280) return 4;
      return 5;
    };

    setColumnCount(getColumnsCount());

    const handleResize = () => {
      const count = getColumnsCount();
      setColumnCount(count);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const splitIntoColumns = (items: typeof AUTH_FIELDS) => {
    const itemsPerColumn = Math.ceil(items.length / columnCount);
    return Array.from({ length: columnCount }, (_, i) =>
      items.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn),
    );
  };

  if (!isEnabled) return null;
  if (isLoading) return <Loader />;

  return (
    <div className="h-full w-full py-8">
      <Fieldset>
        <FieldGroup>
          {/* MFA Email Section */}
          <div className="mb-8">
            <p className="mb-4 text-base text-gray-500 max-w-lg">
              By default, customer proxies are required to authenticate their
              users through a multi-factor authenticated (MFA) email address.
              This is a highly secure method of authentication. If the email
              address in ProxyLink matches the email address for a customer in
              your CRM, then you can have confidence that the proxy is acting at
              the customer&apos;s request. If, for any reason, you want to
              require the proxy to provide additional authenticating
              information, you can. However, please note that this increases
              friction for the consumer and will impact the willingness of AI
              assistants to recommend your products and services.
            </p>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                checked={authFields?.includes('customerEmail')}
                onChange={e =>
                  handleFieldChange('customerEmail', e.target.checked)
                }
              />
              <span className="ml-2 font-medium">
                MFA Customer Email (recommended)
              </span>
            </label>
          </div>

          {/* Additional Fields Section */}
          <div className="space-y-4">
            <p className="text-base text-gray-500">
              To require proxies to provide additional authenticating
              information, select the additional fields here:
            </p>

            <div className="flex gap-4">
              {splitIntoColumns(
                AUTH_FIELDS.filter(item => item.field !== 'customerEmail'),
              ).map((column, colIndex) => (
                <div key={colIndex} className="flex-1 space-y-2">
                  {column.map(item => (
                    <label key={item.field} className="flex items-center">
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
              ))}
            </div>
          </div>

          {/* Save Button */}
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
