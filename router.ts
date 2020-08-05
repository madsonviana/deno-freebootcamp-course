import { Router, RouterContext } from "oak";
import authController from "./controllers/AuthController.ts";
import surveyController from "./controllers/SurveyController.ts";
import { authMiddleware } from "./middlewares/authMiddleware.ts";
import questionController from "./controllers/QuestionController.ts";
import { surveyAuthorizationMiddleware } from "./middlewares/surveyAuthorizationMiddleware.ts";

const router = new Router();

router
  .get("/", (ctx: RouterContext) => {
    ctx.response.body = "Hello World1";
  })
  .post("/api/login", authController.login)
  .post("/api/register", authController.register)
  // For Survey
  .get(
    "/api/survey",
    authMiddleware,
    surveyController.getAllForUser,
  )
  .get(
    "/api/survey/:id",
    authMiddleware,
    surveyController.getSingle,
  )
  .post(
    "/api/survey",
    authMiddleware,
    surveyController.create,
  )
  .put(
    "/api/survey/:id",
    authMiddleware,
    surveyController.update,
  )
  .delete(
    "/api/survey/:id",
    authMiddleware,
    surveyController.delete,
  )
  // For questions
  .get(
    "/api/survey/:surveyId/questions",
    authMiddleware,
    surveyAuthorizationMiddleware("surveyId"),
    questionController.getBySurvey,
  )
  .get(
    "/api/survey/:surveyId/questions/:id",
    authMiddleware,
    surveyAuthorizationMiddleware("surveyId"),
    questionController.getSingle,
  )
  .post(
    "/api/survey/:surveyId",
    authMiddleware,
    surveyAuthorizationMiddleware("surveyId"),
    questionController.create,
  )
  .put(
    "/api/survey/:surveyId/questions/:id",
    authMiddleware,
    surveyAuthorizationMiddleware("surveyId"),
    questionController.update,
  )
  .delete(
    "/api/survey/:surveyId/questions/:id",
    authMiddleware,
    surveyAuthorizationMiddleware("surveyId"),
    questionController.delete,
  );

export default router;
