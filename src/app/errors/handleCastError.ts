import mongoose from "mongoose";
import { IErrorResponse } from "../interfaces/error";

export const handleCastError = (
  err: mongoose.Error.CastError
): IErrorResponse => {
  return {
    statusCode: 400,
    message: `Invalid MongoDB ID: ${err.value}, Provide a valid ID`,
  };
};
