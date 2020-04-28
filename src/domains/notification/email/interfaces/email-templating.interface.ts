import { EmailTemplate } from "../../../../models/email/email-template.model";

export abstract class EmailTemplatingServiceAbstract {
  /* add */
  public abstract async add(emailTemplate: EmailTemplate): Promise<any>;
  /* get */
  public abstract async getById(id: string): Promise<any>;
  public abstract async getByName(name: string): Promise<any>;
  /* list */
  public abstract async getAll(): Promise<any>;
}
