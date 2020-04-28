import * as Joi from "joi";
import { EmailTemplate } from "../../../../models/email/email-template.model";

export class EmailTemplateValidator {
  private static readonly schema: Joi.ObjectSchema = Joi.object().keys({
    name: Joi.string().required().max(50),
    subject: Joi.string().required(),
    message: Joi.string().required(),
  });

  public static validate(
    emailTemplate: EmailTemplate
  ): Joi.ValidationResult<any> {
    return Joi.validate(emailTemplate, this.schema);
  }
}
