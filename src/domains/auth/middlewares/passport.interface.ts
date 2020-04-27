import { User } from "../../../models/auth/user.model";

export abstract class PassportMiddleware {
  public abstract use(model: any): Promise<User>;
}
