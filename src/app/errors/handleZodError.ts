import { ZodError, ZodIssue } from "zod";
import { IErrorResponse, IErrorSource } from "../interfaces/error";

export const handleZodError = (err: ZodError): IErrorResponse => {
  const errorSources: IErrorSource[] = [];

  err.issues.forEach((issue: ZodIssue) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1], // Get the last path segment
      message: issue.message,
    });
  });

  return {
    statusCode: 400,
    message: "Zod Validation Error!",
    errorSources,
  };
};
