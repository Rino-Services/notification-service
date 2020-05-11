import * as aws from "aws-sdk";
import { config } from "dotenv";
export class AwsConfig {
  public static readonly region: string = "us-west-2";
  public static readonly apiVersion: string = "2010-03-31";
}

export class AwsDefaultConfig {
  constructor() {
    config({ path: ".env" });
    aws.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_KEYID,
      secretAccessKey: process.env.AWS_KEYSECRET,
    });
  }
}
