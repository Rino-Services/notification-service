import { Path, POST } from "typescript-rest";
import { Tags } from "typescript-rest-swagger";
import { Inject } from "typescript-ioc";
import { SsoModel } from "../../../models/auth/sso.model";
import { User } from "../../../models/auth/user.model";
import { Person } from "../../../models/auth/person.model";
import { SsoPassportAuth } from "../../../models/auth/sso-passport-auth.model";
import { PassportTypes } from "../../../models/auth/passport-types.enum";
import { SsoModelValidator } from "../helpers/sso-model-validator.helper";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "typescript-rest/dist/server/model/errors";
import { UserService } from "../services/user.service";
import { UserInvitationService } from "../services/invitations.service";
import { UuIdGenerator } from "../helpers/uuid-generator.helper";
import { HashPassword } from "../helpers/hash-password.helper";
import { EmailEnqueue } from "../../../common/middlewares/email-enqueue.middleware";
import { EmailTypes } from "../../../common/models/email-types.enums";
import { config } from "dotenv";

@Path("/auth/signup")
export default class SignUpController {
  @Inject private userService: UserService;
  @Inject private userIvitationService: UserInvitationService;
  @Inject private hashPassword: HashPassword;
  @Inject private emailEnqueue: EmailEnqueue;

  constructor() {
    config({ path: ".env" });
  }

  /**
   * Send Status message
   * @param ssoModel
   */
  @POST
  @Path("/sso")
  @Tags("SignUp", "Sso")
  public async register(ssoModel: SsoModel) {
    // validate model
    const validationResult = SsoModelValidator.validate(ssoModel);
    if (validationResult.error) {
      throw new NotFoundError("Please fill all fields required");
    }

    const userExists = await this.userService.isUserAlreadyExists(
      ssoModel.email
    );
    if (userExists) {
      throw new BadRequestError("User already exists");
    }

    // has this email an invitation pending?
    const invitation = await this.userIvitationService.findUserInvitationByEmail(
      ssoModel.email
    );
    let userMasterId: string = null;

    if (invitation) {
      userMasterId = invitation.userMasterId;
    }

    const soPassportAuth: SsoPassportAuth = {
      username: ssoModel.email,
      passwordHash: this.hashPassword.hash(ssoModel.password),
      type: PassportTypes.SSO,
    };

    const user: User = {
      username: ssoModel.email,
      email: ssoModel.email,
      masterId: userMasterId ? null : UuIdGenerator.generate(),
      masterUserId: userMasterId,
      personalInfo: new Person(ssoModel.firstName, ssoModel.lastName),
      passportAuth: soPassportAuth,
      dateCreated: new Date(),
      dateActivated: null,
    };

    const result = await this.userService.register(user);

    if (result) {
      // email process
      await this.emailEnqueue.process(
        {
          firstName: result.ops[0].personalInfo.firstName,
          lastName: result.ops[0].personalInfo.lastName,
          id: result.ops[0]._id,
          subject: "Email activation/confirmation",
          receipt: user.email,
          from: process.env.AWS_WELCOME_EMAIL_ACCOUNT || "",
        },
        EmailTypes.EMAIL_COMFIRM_ACCOUNT
      );
      return { message: "User created" };
    } else {
      throw new InternalServerError(
        "An problem has occurred when tried to register new user"
      );
    }
  }
}
