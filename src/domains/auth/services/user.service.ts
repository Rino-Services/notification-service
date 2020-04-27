import { MongoConnection } from "../../../mongo.conection";
import { UserServiceAbstract } from "../interfaces/user.interface";
import { logger } from "../../../common/logger";
import { ObjectId } from "mongodb";
import { User } from "../../../models/auth/user.model";

export class UserService implements UserServiceAbstract {
  private readonly collection: string = "users";
  private db = () => MongoConnection.client.db().collection(this.collection);

  public isUserAlreadyExists(email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db().findOne({ email }, (err, result) => {
        if (err) {
          logger.error(err);
          reject(true);
        } else {
          logger.debug(`on isUserAlreadyExists ${JSON.stringify(result)}`);
          result ? resolve(true) : resolve(false);
        }
      });
    });
  }

  public async findUserByEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db().findOne({ email }, (err, result) => {
        if (err) {
          logger.error(err);
          reject(null);
        } else {
          logger.debug(`on findUserByEmail ${JSON.stringify(result)}`);
          resolve(result);
        }
      });
    });
  }

  public async findUserById(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db().findOne({ _id: new ObjectId(id) }, (err, result) => {
        if (err) {
          logger.error(err);
          reject(null);
        } else {
          logger.debug(`on findUserById ${JSON.stringify(result)}`);
          resolve(result);
        }
      });
    });
  }

  public async register(user: User): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db().insertOne(user, (err, result) => {
        if (err) {
          logger.error(err);
          reject(null);
        } else {
          logger.debug(`on register ${JSON.stringify(result)}`);
          resolve(result);
        }
      });
    });
  }

  public async updateDateActivated(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db().findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { dateActivated: Date.now() } },
        (err, result) => {
          if (err) {
            logger.error(err);
            reject(null);
          } else {
            logger.debug(
              `on updateDateActivated ${JSON.stringify(result.value)}`
            );
            resolve(result.value);
          }
        }
      );
    });
  }
}
