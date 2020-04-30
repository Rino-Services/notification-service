import { Inject } from "typescript-ioc";
import { EmailTemplate } from "../../../../models/email/email-template.model";
import { EmailTemplatingService } from "../services/email-templating.service";
import { logger } from "../../../../common/logger";

export class EmailTemplateSeeder {
  @Inject private static emailTemplatingService: EmailTemplatingService;
  private static readonly templates: Array<EmailTemplate> = [
    {
      name: "EMAIL_ACTIVATION_ACCOUNT",
      subject: "Account Activation",
      message: `
        Hello <%= firstName %> <%= lastName %>
        <p>Thanks for register on Rino </p>
        <p>In order to follow to next step, please activate your account clicking here: </p>
        <a href="http://localhost:3000/auth/account/activate/<%= id %>">Activate :D</a>
      `,
    },
  ];

  public static insertTamplates() {
    this.templates.forEach(async (template) => {
      if (await this.emailTemplatingService.getByName(template.name)) {
        return;
      } else {
        const result = await this.emailTemplatingService.add(template);
        if (!result) {
          logger.error(`EmailTemplate can't insert`);
        }
      }
    });
  }
}
