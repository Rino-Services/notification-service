import * as aws from "aws-sdk";
import { Inject } from "typescript-ioc";
import { Ses } from "../../../../../common/aws/ses";
import { DequeueMessage } from "../../../../../common/aws/sqs/dequeue-message";
import { AwsMessage } from "../../../../../common/aws/message.model";
import { EmailBuilder } from "../../../../../common/message-builders/email.builder";
import { AutopartsSalesAccountActivationEmailDelivery as constants } from "./email-urls-sqs.constants";
import { logger } from "../../../../../common/logger";

export class SendEmailActivationAccountDequeueMessage extends DequeueMessage {
  @Inject private ses: Ses;
  @Inject private emailBuilder: EmailBuilder;

  constructor() {
    super(constants.queueUrl, constants.dequeueServiceName);
  }
  public async processMessage(message: AwsMessage): Promise<any> {
    let options: aws.SES.SendEmailRequest = await this.emailBuilder.build(
      message.MessageAttributes
    );

    logger.debug(
      `${constants.dequeueServiceName} :: processMessage -> ${JSON.stringify(
        options
      )}`
    );

    // SES labor
    await this.ses.sendEmail(options);
  }
}
