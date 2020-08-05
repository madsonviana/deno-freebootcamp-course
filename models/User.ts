import { usersCollection } from "../mongo.ts";
import BaseModel from "./BaseModel.ts";

export default class User extends BaseModel {
  public name: string;
  public email: string;
  public password: string;

  constructor({ id = "", name = "", email = "", password = "" }) {
    super({ id });
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static findOne(params: object): Promise<User | null> {
    return usersCollection.findOne(params).then(BaseModel.flattenId(User));
  }

  async save(): Promise<User> {
    return await usersCollection.insertOne(this).then(
      BaseModel.convertId(this),
    );
  }
}
