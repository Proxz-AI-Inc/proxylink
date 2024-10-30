// file: types/next.d.ts
import { NextRequest as OriginalNextRequest } from 'next/server';

declare module 'next/server' {
  interface NextRequest extends OriginalNextRequest {
    user?: {
      email: string;
      tenantId: string;
      tenantType: string;
    };
  }

  interface RequestData {
    user?: {
      email: string;
      tenantId: string;
      tenantType: string;
    };
  }
}

// Need this to make the file a module
export {};
