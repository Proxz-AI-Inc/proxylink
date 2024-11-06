// Add types to match the API response
export type DeleteError = {
  userId: string;
  error: string;
};

export type DeleteResults = {
  success: {
    users: number;
    auth: number;
  };
  failures: {
    users: DeleteError[];
    auth: DeleteError[];
  };
};

export type DeleteResponse = {
  message: string;
  results: DeleteResults;
  error?: string;
};
