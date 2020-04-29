import * as aws from "aws-sdk";
export class AwsConfig {
  public static readonly region: string = "us-west-2";
  public static readonly apiVersion: string = "2010-03-31";

  /**
   * SNS ARNs
   */

  public static readonly snsArnAutosalesCustomerServiceEmailAccuntActivation: string =
    "arn:aws:sns:us-west-2:615953265037:autosales-customer-service-email-account-activation";

  /**
   * SQS URLs
   */
  public static readonly sqsUrlAutopartsSalesAccountActivationEmailDelivery =
    "	https://sqs.us-west-2.amazonaws.com/615953265037/AutopartsSalesAccountActivationEmailDelivery";
}

export class AwsDefaultConfig {
  constructor() {
    aws.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_KEYID,
      secretAccessKey: process.env.AWS_KEYSECRET,
    });
  }
}
