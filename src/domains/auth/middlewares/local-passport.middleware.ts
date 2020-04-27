import { PassportMiddleware } from "./passport.interface";
import { User } from "../../../models/auth/user.model";
import { SignInModel } from "../../../models/auth/sso-signin.model";
import { Inject } from "typescript-ioc";
import { UserService } from "../services/user.service";
import { HashPassword } from "../helpers/hash-password.helper";
import { SsoPassportAuth } from "../../../models/auth/sso-passport-auth.model";
import { logger } from "../../../common/logger";

export class LocalPassportMiddleware implements PassportMiddleware {
  @Inject private userService: UserService;
  @Inject private hashPassword: HashPassword;

  public use(signInModel: SignInModel): Promise<User> {
    return new Promise((resolve, reject) => {
      this.userService
        .findUserByEmail(signInModel.username)
        .then((user: User) => {
          if (!user) {
          } else {
            // convert
            const ssoPassportAuth: SsoPassportAuth = <SsoPassportAuth>(
              user.passportAuth
            );
            // check password
            this.hashPassword
              .compare(signInModel.password, ssoPassportAuth.passwordHash)
              .then(isPasswordMatch => {
                if (!isPasswordMatch) {
                  reject(null);
                } else {
                  resolve(user);
                }
              })
              .catch(err => {
                logger.debug(
                  `on LocalPassportMiddleware isPasswordMatch ${err}`
                );
                reject(null);
              });
          }
        })
        .catch(err => {
          logger.debug(`on LocalPassportMiddleware validate user ${err}`);
          reject(null);
        });
    });
  }
}
