import PassportAuth from "./passport-auth.interface";
import { PassportTypes } from "./passport-types.enum";

export class SsoPassportAuth implements PassportAuth {
  username: string;
  passwordHash: string;
  type: PassportTypes.SSO;
}
