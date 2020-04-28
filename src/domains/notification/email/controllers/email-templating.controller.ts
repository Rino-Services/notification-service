import { Path, PathParam, GET, POST, Return } from "typescript-rest";
import { Inject } from "typescript-ioc";

import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "typescript-rest/dist/server/model/errors";
import { Tags } from "typescript-rest-swagger";
import { EmailTemplate } from "../../../../models/email/email-template.model";
import { EmailTemplatingService } from "../services/email-templating.service";
import { EmailTemplateValidator } from "../helpers/email-template-validator.helper";
import { logger } from "../../../../common/logger";

@Tags("Email")
@Path("templating/email")
export class EmailTemplatingController {
  @Inject emailTemplatingService: EmailTemplatingService;

  /**
   * get all email templates stored
   */
  @GET
  @Path("/all")
  public async getAll() {
    const result: Array<EmailTemplate> = await this.emailTemplatingService.getAll();
    logger.debug(JSON.stringify(result));
    return result;
  }

  /**
   *
   * @param id id from template record
   */
  @GET
  @Path("/getById/:id")
  public async getById(@PathParam("id") id: string) {
    const logMessageScope = `EmailTemplatingController :: getById`;

    if (!id) {
      const logMessage = `${logMessageScope} field id is required`;
      logger.warning(logMessage);
      throw new BadRequestError(logMessage);
    } else {
      const result = await this.emailTemplatingService.getById(id);
      if (!result) {
        const logMessage = `${logMessageScope} email template not found`;
        logger.warning(logMessage);
        throw new BadRequestError(logMessage);
      } else {
        return result;
      }
    }
  }

  /**
   *
   * @param name The name/title from template
   */
  @GET
  @Path("/getByName/:name")
  public async getByName(@PathParam("name") name: string) {
    const logMessageScope = `EmailTemplatingController :: getByName`;

    if (!name) {
      const logMessage = `${logMessageScope} field name is required`;
      logger.warning(logMessage);
      throw new BadRequestError(logMessage);
    } else {
      const result = await this.emailTemplatingService.getByName(name);
      if (!result) {
        const logMessage = `${logMessageScope} email template not found`;
        logger.warning(logMessage);
        throw new BadRequestError(logMessage);
      } else {
        return result;
      }
    }
  }

  /**
   *
   * @param emailTemplate email template model
   */

  @POST
  @Path("/add")
  @Tags("Email")
  public async addNewEmailTemplate(emailTemplate: EmailTemplate) {
    const logMessageScope = "EmailTemplatingController :: addNewEmailTemplate";

    // verify model schema with joi
    const validateModel = EmailTemplateValidator.validate(emailTemplate);
    if (validateModel.error) {
      const logMessage = `${logMessageScope} : ${validateModel.error}`;
      logger.error(logMessage);
      throw new BadRequestError(` ${logMessage}`);
    }

    // validate that name does not exist
    const templateExist = await this.emailTemplatingService.getByName(
      emailTemplate.name
    );

    if (templateExist) {
      const logMessage = `${logMessageScope} : Error: This name already exist`;
      logger.warning(`${logMessage}`);
      throw new NotFoundError(`${logMessage}`);
    }

    // save
    const result = await this.emailTemplatingService.add(emailTemplate);
    if (!result) {
      const logMessage = `${logMessageScope} : Error: This name already exist`;
      logger.warning(`${logMessage}`);
      throw new InternalServerError(logMessage);
    } else {
      return new Return.NewResource<EmailTemplate>(`Resource created`);
    }
  }
}
