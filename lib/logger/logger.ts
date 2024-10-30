import { Logging } from '@google-cloud/logging';

let loggingInstance: Logging | null = null;

const LOG_NAME = 'api-logs';

const initializeLogging = () => {
  if (!loggingInstance) {
    try {
      // Initialize with specific service account credentials
      loggingInstance = new Logging({
        projectId: process.env.NEXT_PUBLIC_GCP_PROJECT_ID,
        credentials: {
          type: 'service_account',
          project_id: process.env.NEXT_PUBLIC_GCP_PROJECT_ID,
          private_key_id: process.env.GOOGLE_LOGGING_PRIVATE_KEY_ID,
          private_key: process.env.GOOGLE_LOGGING_PRIVATE_KEY?.replace(
            /\\n/g,
            '\n',
          ),
          client_email: process.env.GOOGLE_LOGGING_CLIENT_EMAIL,
          client_id: process.env.GOOGLE_LOGGING_CLIENT_ID,
        },
      });
    } catch (error) {
      console.error('Failed to initialize logging:', error);
      return null;
    }
  }
  return loggingInstance;
};

interface LogMetadata {
  route?: string;
  method?: string;
  tenantId: string;
  email: string;
  tenantType?: 'proxy' | 'provider' | 'management' | 'unknown';
  requestId?: string;
  logId?: string;
  statusCode?: number;
  error?: {
    message: string;
    stack?: string;
  };
}

export const info = async (message: string, metadata: LogMetadata) => {
  const logging = initializeLogging();
  if (!logging) return;

  const log = logging.log(LOG_NAME);
  console.log('Writing log entry:', { message, metadata });

  const entry = log.entry({
    severity: 'INFO',
    timestamp: new Date(),
    labels: {
      environment: process.env.NODE_ENV,
    },
    jsonPayload: {
      message,
      ...metadata,
    },
  });

  log.write(entry).catch(console.error);
};

export const error = async (message: string, metadata: LogMetadata) => {
  const logging = initializeLogging();
  if (!logging) return;

  const log = logging.log(LOG_NAME);

  const entry = log.entry({
    severity: 'ERROR',
    timestamp: new Date(),
    labels: {
      environment: process.env.NODE_ENV || 'development',
    },
    jsonPayload: {
      message,
      ...metadata,
    },
  });

  log.write(entry).catch(console.error);
};
