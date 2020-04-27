import * as Joi from "joi";

export class AccountValidations {
  // private static readonly idValidationSchema: Joi.ObjectSchema = Joi.object().keys(
  //   {
  //     id: Joi.string()
  //       .required()
  //       .min(10)
  //   }
  // );

  public static validateId(id: string): Joi.ValidationResult<any> {
    return Joi.validate(
      Joi.string()
        .required()
        .min(10),
      id
    );
  }
}
