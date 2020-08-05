import { RouterContext, Status } from "oak";
import User from "../models/User.ts";
import Survey from "../models/Survey.ts";

export const surveyAuthorizationMiddleware = (surveyIdParam: string) => {
  return async (
    ctx: RouterContext,
    next: Function,
  ) => {
    const user: User = ctx.state.user as User;
    const survey = await Survey.findByUserAndId(
      user.id,
      ctx.params[surveyIdParam]!,
    );

    if (!survey) {
      ctx.response.status = Status.NotFound;
      return;
    }

    await next();
  };
};
