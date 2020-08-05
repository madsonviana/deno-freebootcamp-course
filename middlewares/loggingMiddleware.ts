import { red, green } from "fmt/colors.ts";
import { Context } from "oak";

export const loggingMiddleware = async (
  ctx: Context,
  next: Function,
): Promise<void> => {
  console.log(
    `${red(ctx.request.method)} ${green(ctx.request.url.toString())}`,
  );
  await next();
};
