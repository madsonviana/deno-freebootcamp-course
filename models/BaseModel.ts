import { ObjectId } from "mongo";

export default abstract class BaseModel {
  public id: string;

  constructor({ id = "" }) {
    this.id = id;
  }

  protected static flattenId<T extends BaseModel>(
    klass: { new (input: any): T },
  ): (data: any) => T {
    return (data: any) => {
      if (data && data._id) {
        data.id = data._id.$oid;
        delete data._id;
        return new klass(data);
      }

      return data;
    };
  }

  protected static convertId<T extends BaseModel>(
    model: T,
  ): (oid: ObjectId) => T {
    return ({ $oid }) => {
      delete model.id;
      model.id = $oid;
      return model;
    };
  }
}
