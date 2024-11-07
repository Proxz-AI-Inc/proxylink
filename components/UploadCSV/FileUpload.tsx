import { FC, useCallback, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Upload } from 'lucide-react';
import { FileUploader } from 'react-drag-drop-files';
import { FaRegTrashAlt } from 'react-icons/fa';

import { useUpload } from './UploadCSVProvider/upload.hooks';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import Spinner from '@/components/ui/spinner';

import { SelectProvider } from './SelectProvider';
import { generateCSVHeaders } from '@/utils/template.utils';
import { RequestType } from '@/lib/db/schema';
import { useTenant } from '@/hooks/useTenant';
import { SelectItem, Select as SelectTremor } from '@tremor/react';
import { getTenants } from '@/lib/api/tenant';
import { useAuth } from '@/hooks/useAuth';

type ErrorResponse = {
  error?: string;
  status?: string;
  headers?: string[];
  data?: Record<string, string>[];
};

const FileUpload: FC = () => {
  const {
    csv,
    filename,
    setCsvResponse,
    resetCsvFile,
    setUploadedFilename,
    setCsvFormData,
    selectedProviderId,
    setSelectedRequestType,
    selectedRequestType,
  } = useUpload();
  const [uploadError, setUploadError] = useState<string | undefined>();
  const { userData } = useAuth();
  const { data: tenants, isLoading: areProvidersLoading } = useQuery({
    queryKey: ['tenants', userData?.tenantId],
    queryFn: () =>
      getTenants({ filterBy: 'type', filterValue: 'provider', minimal: true }),
  });

  const { data: provider, isLoading: isProviderLoading } =
    useTenant(selectedProviderId);

  const deleteFile = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setUploadError(undefined);
    resetCsvFile();
  };

  const handleUpload = async (file: File) => {
    try {
      if (filename) {
        setUploadError(undefined);
        resetCsvFile();
      }
      setUploadedFilename(file.name);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('requestType', selectedRequestType);
      if (selectedProviderId) {
        formData.append('providerId', selectedProviderId);
      }
      setCsvFormData(formData);
      await uploadMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error in handleUpload:', error);
    }
  };

  const handleSelectRequestType = (value: string) => {
    setSelectedRequestType(value as RequestType);
  };

  const generateCSVTemplate = useCallback(() => {
    if (!selectedProviderId || !provider?.requiredCustomerInfo) return null;

    return generateCSVHeaders(provider.requiredCustomerInfo);
  }, [selectedProviderId, provider]);

  const handleDownloadTemplate = useCallback(() => {
    const csvContent = generateCSVTemplate();
    if (!csvContent) return;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const providerName = provider?.name;
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${providerName} template.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [generateCSVTemplate, provider]);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: setCsvResponse,
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response) {
        const errorData = error.response.data;
        if (errorData && errorData.error) {
          setUploadError(errorData.error);
        } else {
          setUploadError('Validation error occurred');
        }
      } else {
        setUploadError('An unexpected error occurred. Please try again.');
      }
    },
  });

  return (
    <div className="w-full flex flex-col gap-8 mt-4">
      <div className="w-full flex flex-col gap-2">
        <h3>1. Select a provider</h3>

        <div className="flex gap-2">
          <SelectProvider tenants={tenants} isLoading={areProvidersLoading} />
          <Button
            onClick={handleDownloadTemplate}
            disabled={!selectedProviderId || isProviderLoading}
            color="blue"
            loading={isProviderLoading}
          >
            Download template
          </Button>
        </div>

        <Text className="text-sm text-gray-600 max-w-prose">
          Each provider requires different customer information for requests,
          like an email, address, account number, or the last four digits of a
          credit card. Please select a provider from the list, download the
          template and fill in the required information.
        </Text>
      </div>
      <div className="w-full flex flex-col gap-2">
        <h3>2. Select request type</h3>
        <div className="flex gap-2">
          <SelectTremor
            enableClear={false}
            className="z-20 w-52"
            placeholder="Select request type"
            onValueChange={handleSelectRequestType}
            value={selectedRequestType}
            disabled={isProviderLoading || !selectedProviderId}
            icon={isProviderLoading ? Spinner : undefined}
          >
            {provider?.requestTypes?.map(requestType => (
              <SelectItem value={requestType} key={requestType}>
                {requestType}
              </SelectItem>
            ))}
          </SelectTremor>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <h3>3. Make sure your CSV file follows the required format</h3>
        <Text className="text-sm text-gray-600">
          For any issues or support, please contact our customer service team at{' '}
          <a href="mailto:admin@proxylink.co" className="underline">
            admin@proxylink.co
          </a>
          .
        </Text>
        <div className="relative">
          <FileUploader
            handleChange={handleUpload}
            name="file"
            types={['CSV']}
            disabled={uploadMutation.isPending || !selectedProviderId}
          >
            <div className="flex flex-col gap-4 items-center p-16 border-dashed border-2 border-gray-300 rounded-lg">
              <Text>Drag and drop your file here or click to upload.</Text>
              {csv && filename ? (
                <div className="flex items-center justify-between p-2 border rounded gap-4">
                  <Text>{filename}</Text>
                  <Button onClick={deleteFile} outline={true}>
                    <FaRegTrashAlt />
                  </Button>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center">
                  <Button
                    disabled={uploadMutation.isPending || !selectedProviderId}
                    className="justify-center"
                    color="blue"
                  >
                    {uploadMutation.isPending ? (
                      <Spinner className="mr-2" />
                    ) : (
                      <Upload className="mr-2" />
                    )}
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
                  </Button>
                </div>
              )}
            </div>
          </FileUploader>
          {uploadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
              <div className="text-center p-4 bg-red-100 opacity-50 border border-red-400 text-red-700 rounded">
                <p className="font-bold mb-2">Error</p>
                <p>{uploadError}</p>
                <button
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => setUploadError(undefined)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
