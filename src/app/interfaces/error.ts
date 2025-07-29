export interface IErrorSource {
    path: string | number;
    message: string;
}

export interface IErrorResponse {
  statusCode: number;
  message: string;
  errorSources?: IErrorSource[];
}
// export interface IGenericErrorResponse {
//     path: string | number;
//     message: string;
// }

