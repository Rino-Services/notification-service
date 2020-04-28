import { EmailTemplatingServiceAbstract } from "../interfaces/email-templating.interface";
import { EmailTemplate } from "../../../../models/email/email-template.model";
import { MongoConnection } from "../../../../mongo.conection";
import { ObjectId } from "mongodb";
import { logger } from "../../../../common/logger";

export class EmailTemplatingService extends EmailTemplatingServiceAbstract {
  private readonly collection: string = "emailTemplates";
  private db = () => MongoConnection.client.db().collection(this.collection);

  public add(emailTemplate: EmailTemplate): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db().insertOne(emailTemplate, (err, result) => {
        if (err) {
          logger.error(`EmailTemplatingService :: add : ${err}`);
          reject(null);
        } else {
          logger.debug(
            `EmailTemplatingService :: add ${JSON.stringify(result)}`
          );
          resolve(result);
        }
      });
    });
  }

  public getById(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db().findOne({ _id: new ObjectId(id) }, (err, result) => {
        if (err) {
          logger.error(`EmailTemplatingService :: getById : ${err}`);
          reject(null);
        } else {
          logger.debug(
            `EmailTemplatingService :: getById ${JSON.stringify(result)}`
          );
          resolve(result);
        }
      });
    });
  }
  public getByName(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db().findOne({ name }, (err, result) => {
        if (err) {
          logger.error(`EmailTemplatingService :: getByName : ${err}`);
          reject(null);
        } else {
          logger.debug(
            `EmailTemplatingService :: getByName ${JSON.stringify(result)}`
          );
          resolve(result);
        }
      });
    });
  }
  public getAll(): Promise<any> {
    return new Promise((resolve, reject) => {
      const result = this.db().find().toArray();
      result ? resolve(result) : reject([]);
    });
  }
}
