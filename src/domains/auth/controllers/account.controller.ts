import { Path, PathParam, GET, PUT } from "typescript-rest";
import { Inject } from "typescript-ioc";
import { UserService } from "../services/user.service";

import {
  BadRequestError,
  NotFoundError,
  InternalServerError
} from "typescript-rest/dist/server/model/errors";
import { User } from "../../../models/auth/user.model";
import { Tags } from "typescript-rest-swagger";

@Path("/auth/account")
export class AccountController {
  @Inject userService: UserService;
  /**
   * @param id db id
   */
  @GET
  @Path("/activate/:id")
  @Tags("Account", "Activation")
  public async activate(@PathParam("id") id: string) {
    if (id == null) {
      throw new BadRequestError("Id required");
    }

    const user: User = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      activated: user.dateActivated ? true : false,
      dateActivated: user.dateActivated
    };
  }

  /**
   * @param id db id
   */
  @PUT
  @Path("/activate/:id")
  @Tags("Account", "Activation")
  public async activateAccount(@PathParam("id") id: string) {
    if (id == null) {
      throw new BadRequestError("Id required");
    }

    const operation: User = await this.userService.updateDateActivated(id);
    if (!operation) {
      throw new NotFoundError("User not found");
    }

    const user: User = await this.userService.findUserById(id);
    if (!user) {
      throw new InternalServerError(
        "An error has ocurred traying to update user account"
      );
    }

    return {
      activated: user.dateActivated ? true : false,
      dateActivated: user.dateActivated
    };
  }
}
