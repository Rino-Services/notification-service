import { expect } from "chai";
import { SsoModel } from "../../../models/auth/sso.model";
import { SsoModelValidator } from "../../../domains/auth/helpers/sso-model-validator.helper";

describe("this test proove all validator functions", () => {
  it("when pass ssoModel should be validate all fields", () => {
    const ssoModel: SsoModel = {
      email: "emanuelesausosa@outlook.com",
      password: "hello",
      firstName: "Lalo",
      lastName: "Coco",
    };

    const result = SsoModelValidator.validate(ssoModel);
    console.log(result);
    expect(result.error).to.equals(null);
  });
});
