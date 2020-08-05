import BaseModel from "./BaseModel.ts";
import { questionCollection } from "../mongo.ts";

export default class Question extends BaseModel {
  public surveyId: string;
  public text: string;
  public type: QuestionType;
  public required: boolean;
  public data: any;

  constructor({
    id = "",
    surveyId = "",
    text = "",
    type = QuestionType.TEXT,
    required = false,
    data = {},
  }) {
    super({ id });
    this.surveyId = surveyId;
    this.text = text;
    this.type = type;
    this.required = required;
    this.data = data;
  }

  static async findBySurvey(surveyId: string): Promise<Question[]> {
    return questionCollection.find({ surveyId }).then((q) =>
      q.map(BaseModel.flattenId(Question))
    );
  }

  static async findBySurveyAndId(
    surveyId: string,
    id: string,
  ): Promise<Question | null> {
    return questionCollection.findOne({ _id: { $oid: id }, surveyId }).then(
      BaseModel.flattenId(Question),
    );
  }

  async save(): Promise<Question> {
    return questionCollection.insertOne(this).then(
      BaseModel.convertId(this),
    );
  }

  async update(
    text: string,
    type: QuestionType,
    required: boolean,
    data: any,
  ): Promise<Question> {
    questionCollection.updateOne(
      { _id: { $oid: this.id } },
      { $set: { text, type, required, data } },
    );
    return Object.assign(this, { text, type, required, data });
  }

  async delete() {
    questionCollection.deleteOne({ _id: { $oid: this.id } });
  }
}

export enum QuestionType {
  CHOICE = "choice",
  TEXT = "text",
}
