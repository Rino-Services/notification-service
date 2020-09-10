import { GET, ContextResponse, Path } from "typescript-rest";
import * as express from "express";
import { Tags } from "typescript-rest-swagger";

@Tags("Default")
export class DefaultController {
  @GET
  @Path("/heartbeat")
  public heartbeat(@ContextResponse res: express.Response) {
    var status = {
      success: true,
      address: "127.0.0.1",
      port: 3002,
    };

    res.send(status);
  }
}
