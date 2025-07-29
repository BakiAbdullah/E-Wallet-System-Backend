import mongoose from "mongoose";
import { IErrorResponse, IErrorSource } from "../interfaces/error";

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): IErrorResponse => {
  const errorSources: IErrorSource[] = [];
  const errors = Object.values(err.errors);

  errors.forEach(
    (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) =>
      errorSources.push({
        path: value.path,
        message: value.message,
      })
  );

  return {
    statusCode: 400,
    message: `Validation Error Occured!`,
    errorSources,
  };
};
