import { MongoClient, Collection } from "mongo";
import User from "./models/User.ts";
import Survey from "./models/Survey.ts";
import Question from "./models/Question.ts";

const client = new MongoClient();

client.connectWithUri(Deno.env.get("MONGODB_URI")!);

const db = client.database("deno_survey");

export const usersCollection: Collection<User> = db.collection("users");
export const surveyCollection: Collection<Survey> = db.collection("surveys");
export const questionCollection: Collection<Question> = db.collection(
  "questions",
);
