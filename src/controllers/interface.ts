// generic interface to define the structure of an API response as  it helps us keep all API responses consistent across the app
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}