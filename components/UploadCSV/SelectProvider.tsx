import { SelectItem, Select as SelectTremor } from '@tremor/react';
import { useUpload } from './UploadCSVProvider/upload.hooks';
import { FC, useMemo } from 'react';

import { Tenant } from '@/lib/db/schema';

export const SelectProvider: FC<{
  tenants?: Tenant[];
  isLoading: boolean;
}> = ({ tenants, isLoading }) => {
  const { setSelectedProvider } = useUpload();

  const handleSelectProvider = (value: string) => {
    setSelectedProvider(value);
  };

  const tenantsOptions = useMemo(() => {
    return tenants?.map(tenant => (
      <SelectItem value={tenant.id} key={tenant.id}>
        {tenant.name}
      </SelectItem>
    ));
  }, [tenants]);

  return (
    <SelectTremor
      enableClear={false}
      className="z-30 w-52"
      disabled={isLoading}
      placeholder={isLoading ? 'Loading providers...' : 'Select a provider'}
      onValueChange={handleSelectProvider}
    >
      {tenantsOptions}
    </SelectTremor>
  );
};
