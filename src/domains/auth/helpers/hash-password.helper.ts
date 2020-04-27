import * as bcrypt from "bcryptjs";
import { logger } from "../../../common/logger";

export class HashPassword {
  private readonly salt: string = bcrypt.genSaltSync(10);
  /**
   * hash
   */
  public hash(secret: string) {
    return bcrypt.hashSync(secret, this.salt);
  }

  /**
   * compare
   */
  public async compare(secret: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(secret, hash, (err, res) => {
        if (err) {
          logger.error(err);
          reject(false);
        } else {
          resolve(res);
        }
      });
    });
  }
}
