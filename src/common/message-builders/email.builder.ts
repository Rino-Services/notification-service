import * as aws from "aws-sdk";
import * as _ from "lodash";
import { Inject } from "typescript-ioc";
import { EmailTemplatingService } from "../../domains/notification/email/services/email-templating.service";
import { EmailTemplate } from "../../models/email/email-template.model";

export class EmailBuilder {
  @Inject emailTemplatingService: EmailTemplatingService;
  public async build(
    messageAttributes: any
  ): Promise<aws.SES.SendEmailRequest> {
    // get email template
    const emailTemplate: EmailTemplate = await this.emailTemplatingService.getByName(
      messageAttributes.TemplateName.Value
    );

    // set params group
    const params = {
      firstName: messageAttributes.FirstName.Value,
      lastName: messageAttributes.LastName.Value,
      id: messageAttributes.Id.Value,
      subject: messageAttributes.Subject.Value,
    };

    const messageBody: string = _.template(emailTemplate.message)(params);
    const emailResult: aws.SES.SendEmailRequest = {
      Source: messageAttributes.From.Value,
      Destination: {
        ToAddresses: [messageAttributes.Receipt.Value],
      },
      Message: {
        Subject: {
          Data: messageAttributes.Subject.Value,
        },
        Body: {
          Html: {
            Data: messageBody,
          },
        },
      },
    };

    return emailResult;
  }
}
