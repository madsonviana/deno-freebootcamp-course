import { RouterContext, Status } from "oak";
import { validateJwt } from "djwt/validate.ts";
import { Algorithm } from "djwt/create.ts";
import User from "../models/User.ts";

export const authMiddleware = async (ctx: RouterContext, next: Function) => {
  const authHeader = ctx.request.headers.get("Authorization");

  const jwt = authHeader?.split(" ")[1];
  if (!jwt) {
    ctx.response.status = Status.Unauthorized;
    return;
  }

  const data = await validateJwt(
    {
      jwt,
      key: Deno.env.get("JWT_SECRET_KEY")!,
      algorithm: Deno.env.get("JWT_ALG")! as Algorithm,
    },
  );

  if (data.isValid === true) {
    ctx.state.user = await User.findOne({ email: data.payload?.iss });
    await next();
    return;
  }

  ctx.response.status = Status.Unauthorized;
};
