import { SelectItem, Select as SelectTremor } from '@tremor/react';
import { useQuery } from '@tanstack/react-query';
import { getTenants } from '@/lib/api/tenant';
import { useUpload } from './UploadCSVProvider/upload.hooks';
import { FC } from 'react';

export const SelectProvider: FC = () => {
  const { setSelectedProvider } = useUpload();

  const { data: tenants, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: () =>
      getTenants({ filterBy: 'type', filterValue: 'provider', minimal: true }),
  });

  const handleSelectProvider = (value: string) => {
    setSelectedProvider(value);
  };

  if (!tenants?.length) return null;

  return (
    <SelectTremor
      enableClear={false}
      className="z-30 w-52"
      disabled={isLoading}
      placeholder={isLoading ? 'Loading providers...' : 'Select a provider'}
      onValueChange={handleSelectProvider}
    >
      {tenants.map(tenant => (
        <SelectItem value={tenant.id} key={tenant.id}>
          {tenant.name}
        </SelectItem>
      ))}
    </SelectTremor>
  );
};
