import { RouterContext, Status } from "oak";
import Survey from "../models/Survey.ts";
import User from "../models/User.ts";

class SurveyController {
  async getAllForUser(ctx: RouterContext) {
    const user: User = ctx.state.user as User;
    ctx.response.body = await Survey.findByUser(user.id);
  }

  async getSingle(ctx: RouterContext) {
    const user: User = ctx.state.user as User;
    ctx.response.body = await Survey.findByUserAndId(
      user.id,
      ctx.params.id!,
    );
  }

  async create(ctx: RouterContext) {
    const user: User = ctx.state.user as User;
    const { name, description } = await ctx.request.body().value;

    let survey = new Survey(
      { userId: user.id, name, description },
    );
    survey = await survey.save();

    ctx.response.status = Status.Created;
    ctx.response.body = survey;
  }

  async update(ctx: RouterContext) {
    const id: string = ctx.params.id!;
    const user: User = ctx.state.user as User;

    const survey = await Survey.findByUserAndId(user.id, id);
    if (!survey) return;

    const { name, description } = await ctx.request.body().value;
    ctx.response.body = await survey.update({ name, description });
  }

  async delete(ctx: RouterContext) {
    const id: string = ctx.params.id!;
    const user: User = ctx.state.user as User;

    const survey = await Survey.findByUserAndId(user.id, id);
    if (!survey) return;
    await survey.delete();
    ctx.response.status = Status.NoContent;
  }
}

const surveyController = new SurveyController();
export default surveyController;
