import { Path, POST } from "typescript-rest";
import { Tags } from "typescript-rest-swagger";
import { SignInModel } from "../../../models/auth/sso-signin.model";
import { SsoSignInModelValidator } from "../helpers/sso-signin-validation.helper";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError
} from "typescript-rest/dist/server/model/errors";
import { logger } from "../../../common/logger";
import { Inject } from "typescript-ioc";
import { LocalPassportMiddleware } from "../middlewares/local-passport.middleware";
import { SignJWT } from "../helpers/sign-jwt.helper";

@Path("/auth/login")
export class LoginController {
  @Inject localPassportMiddleware: LocalPassportMiddleware;
  @Inject signJwt: SignJWT;

  /**
   *
   * @param signInModel inteface to wrapp user and password
   */
  @POST
  @Path("/sso")
  @Tags("Login", "Sso")
  public async signin(signInModel: SignInModel): Promise<string> {
    // 1. validate body
    const validationResult = SsoSignInModelValidator.validate(signInModel);
    if (validationResult.error) {
      logger.error(`On signinController:  ${validationResult.error}`);
      throw new BadRequestError("user and password are required fields");
    }

    // 2. validate user exist and password match
    const user = await this.localPassportMiddleware.use(signInModel);
    if (!user) {
      throw new NotFoundError("User or password does not match");
    }

    // 3. generate token
    const token = this.signJwt.sign(user);
    if (token) {
      return token;
    } else {
      throw new InternalServerError(
        "An problem has occurred when tried to register new user"
      );
    }
  }
}
