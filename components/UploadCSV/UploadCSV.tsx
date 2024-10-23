'use client';
import { FC } from 'react';
import FileUpload from './FileUpload';
import UploadTable from './UploadTable';

const UploadCSV: FC = () => {
  return (
    <div className="flex w-full bg-gray-50">
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <div>
          <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-0">
            <h1 className="text-3xl font-semibold text-gray-900">Upload CSV</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              File Upload
            </h2>
            <FileUpload />
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <UploadTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;
