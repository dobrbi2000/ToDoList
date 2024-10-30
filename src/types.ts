export interface RequestParams {
  method: string | undefined;
  suffix: string | null;
  body?: Record<string, any>;
  credentials?: RequestCredentials;
}

export interface UserData {
  [key: string]: string;
}
