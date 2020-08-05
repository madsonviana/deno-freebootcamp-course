import { RouterContext, Status } from "oak";
import Question from "../models/Question.ts";
import User from "../models/User.ts";

class QuestionController {
  async getBySurvey(ctx: RouterContext) {
    const surveyId = ctx.params.surveyId!;
    ctx.response.body = await Question.findBySurvey(surveyId);
  }
  async getSingle(ctx: RouterContext) {
    const surveyId = ctx.params.surveyId!;
    ctx.response.body = await Question.findBySurveyAndId(
      surveyId,
      ctx.params.id!,
    );
  }
  async create(ctx: RouterContext) {
    const surveyId = ctx.params.surveyId!;
    const { text, type, required, data } = await ctx.request.body().value;

    let question = new Question(
      { surveyId, text, type, required, data },
    );
    question = await question.save();

    ctx.response.status = Status.Created;
    ctx.response.body = question;
  }
  async update(ctx: RouterContext) {
    const id: string = ctx.params.id!;
    const surveyId: string = ctx.params.surveyId!;
    const question = await Question.findBySurveyAndId(surveyId, id);
    if (!question) return;

    const { text, type, required, data } = await ctx.request.body().value;
    ctx.response.body = await question.update(text, type, required, data);
  }
  async delete(ctx: RouterContext) {
    const id: string = ctx.params.id!;
    const surveyId: string = ctx.params.surveyId!;
    const question = await Question.findBySurveyAndId(surveyId, id);
    if (!question) return;

    question.delete();
    ctx.response.status = Status.NoContent;
  }
}

const questionController = new QuestionController();
export default questionController;
