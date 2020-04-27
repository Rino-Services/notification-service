import * as Joi from "joi";
import { SignInModel } from "../../../models/auth/sso-signin.model";

export class SsoSignInModelValidator {
  private static schema: Joi.ObjectSchema = Joi.object().keys({
    username: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  });

  public static validate(signInModel: SignInModel): Joi.ValidationResult<any> {
    return Joi.validate(signInModel, this.schema);
  }
}
