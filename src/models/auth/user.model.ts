import PassportAuth from "./passport-auth.interface";
import { Person } from "./person.model";

interface User {
  username: string;
  email: string;
  masterId: string; // for master user only
  masterUserId: string; // all users that depends of one master user
  personalInfo: Person;
  passportAuth: PassportAuth;
  dateCreated: Date;
  dateActivated: Date;
}

export { User };
