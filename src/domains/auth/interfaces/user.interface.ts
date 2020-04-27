import { User } from "../../../models/auth/user.model";

export abstract class UserServiceAbstract {
  public abstract async findUserByEmail(email: string): Promise<any>;
  public abstract async isUserAlreadyExists(email: string): Promise<boolean>;
  public abstract async findUserById(id: string): Promise<any>;
  public abstract async register(user: User): Promise<any>;
  public abstract async updateDateActivated(id: string): Promise<any>;
}
