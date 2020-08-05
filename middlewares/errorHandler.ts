import { Context, HttpError, Status } from "oak";

export const errorHandler = async (ctx: Context, next: Function) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof HttpError) {
      ctx.response.body = { message: e.message };
      ctx.response.status = e.status;
      return;
    }

    ctx.response.status = Status.InternalServerError;
  }
};
