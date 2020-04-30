import * as aws from "aws-sdk";
import { Consumer } from "sqs-consumer";
import { AwsDefaultConfig, AwsConfig } from "../aws-config";
import { logger } from "../../logger";
import { Ses } from "../ses";
import { Inject } from "typescript-ioc";
import { EmailBuilder } from "../../message-builders/email.builder";

export class EmailReceiverSqs extends AwsDefaultConfig {
  @Inject private ses: Ses;
  @Inject private emailBuilder: EmailBuilder;
  private app: Consumer;

  constructor() {
    super();
    this.app = Consumer.create({
      queueUrl: AwsConfig.sqsUrlAutopartsSalesAccountActivationEmailDelivery,
      handleMessage: async (message) => {
        this.sendEmail(message);
      },
      sqs: new aws.SQS(),
    });

    // events
    this.app.on("error", (err) => {
      logger.error(err);
    });

    this.app.on("processing_error", (err) => {
      logger.error(err);
    });
  }

  private async sendEmail(message: any): Promise<any> {
    logger.info(`SQS ** EmailReceiverSqs -> Mail sending now ** `);
    let body = JSON.parse(message.Body);
    logger.debug(JSON.stringify(message.Body));
    if (body) {
      // build email
      let options: aws.SES.SendEmailRequest = await this.emailBuilder.build(
        body.MessageAttributes
      );

      // SES labor
      await this.ses.sendEmail(options);
    }
  }

  public start(): Promise<void> {
    return new Promise((resolve) => {
      logger.info(`SQS ** EmailReceiverSqs is running ** `);
      this.app.start();
      setTimeout(resolve, 1000);
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      logger.info(`SQS ** EmailReceiverSqs is stopping ** `);
      this.app.stop();
      setTimeout(resolve, 1000);
    });
  }
}
