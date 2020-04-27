import { UserInvitationAbstract } from "../interfaces/invitations.interface";
import { MongoConnection } from "../../../mongo.conection";
import { logger } from "../../../common/logger";

export class UserInvitationService implements UserInvitationAbstract {
  private readonly collection: string = "userInvitations";
  private db = () => MongoConnection.client.db().collection(this.collection);

  public async findUserInvitationByEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db().findOne({ email }, (err, result) => {
        if (err) {
          logger.error(err);
          reject(null);
        } else {
          logger.debug(
            `on findUserInvitationByEmail ${JSON.stringify(result)}`
          );
          resolve(result);
        }
      });
    });
  }
}
