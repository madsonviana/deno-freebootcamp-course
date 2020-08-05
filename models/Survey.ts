import { surveyCollection } from "../mongo.ts";
import BaseModel from "./BaseModel.ts";

export default class Survey extends BaseModel {
  public userId: string;
  public name: string;
  public description: string;

  constructor({ id = "", userId = "", name = "", description = "" }) {
    super({ id });
    this.userId = userId;
    this.name = name;
    this.description = description;
  }

  static findByUserAndId(userId: string, id: string): Promise<Survey | null> {
    return surveyCollection.findOne({ _id: { $oid: id }, userId })
      .then(
        BaseModel.flattenId(Survey),
      );
  }

  static async findByUser(userId: string): Promise<Survey[]> {
    return surveyCollection.find({ userId }).then((s) =>
      s.map(BaseModel.flattenId(Survey))
    );
  }

  async save(): Promise<Survey> {
    return surveyCollection.insertOne(this).then(
      BaseModel.convertId(this),
    );
  }

  async update(
    { name, description }: { name: string; description: string },
  ): Promise<Survey> {
    surveyCollection.updateOne(
      { _id: { $oid: this.id } },
      { $set: { name, description } },
    );
    return Object.assign(this, { name, description });
  }

  async delete() {
    surveyCollection.deleteOne({ _id: { $oid: this.id } });
  }
}
