import { HttpError, Status, STATUS_TEXT } from "oak";

export const createHttpError = (
  message: string,
  status: Status,
): HttpError | null => {
  if (status) {
    if (!message) {
      message = STATUS_TEXT.get(status)!;
    }

    const error = new HttpError(message);
    error.status = status;

    return error;
  }

  return null;
};
