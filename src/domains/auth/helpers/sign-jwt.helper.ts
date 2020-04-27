import { User } from "../../../models/auth/user.model";
import { config } from "dotenv";
import * as JWT from "jsonwebtoken";

export class SignJWT {
  private JWT_SECRET: string;
  constructor() {
    config({ path: ".env" });
    this.JWT_SECRET = process.env.JWT_SECRET || "";
  }
  public sign(user: User): string {
    return JWT.sign(
      {
        iss: "InfoFactory",
        sub: user.masterId ? user.masterId : user.masterUserId,
        iat: new Date().getTime(), // current time
        exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
      },
      this.JWT_SECRET
    );
  }
}
