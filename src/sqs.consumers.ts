import { IDequeueMessage } from "./common/aws/sqs/dequeue-message.interface";
import { SendEmailActivationAccountDequeueMessage } from "./domains/notification/email/aws/sqs/sendemail-activationaccount-dequeue.message";

export class SqsConsumers {
  private dequeueServices: Array<IDequeueMessage>;

  constructor() {
    this.dequeueServices = [new SendEmailActivationAccountDequeueMessage()];
  }
  public async start(): Promise<void> {
    await this.wait(3000);
    this.dequeueServices.forEach(async (item) => {
      item.start();
    });
  }

  public async stop(): Promise<void> {
    await this.wait(3000);
    this.dequeueServices.forEach(async (item) => {
      item.stop();
    });
  }

  private wait = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));
}
