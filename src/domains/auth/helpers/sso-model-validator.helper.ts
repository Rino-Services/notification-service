import * as Joi from "joi";
import { SsoModel } from "../../../models/auth/sso.model";

export class SsoModelValidator {
  private static readonly schema: Joi.ObjectSchema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
    firstName: Joi.string()
      .required()
      .max(20),
    lastName: Joi.string()
      .required()
      .max(20)
  });

  public static validate(ssoModel: SsoModel): Joi.ValidationResult<any> {
    return Joi.validate(ssoModel, this.schema);
  }
}
