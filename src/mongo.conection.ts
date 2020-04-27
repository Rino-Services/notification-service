import { MongoClient, MongoClientOptions } from "mongodb";
import { config } from "dotenv";
import { logger } from "./common/logger";

export class MongoConnection {
  public static client: MongoClient;
  private MONGODB_URI: string;

  constructor() {
    config({ path: ".env" });
    this.MONGODB_URI = process.env.MONGODB_URI || "";
  }

  public connect(): Promise<any> {
    const options: MongoClientOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };

    return new Promise((resolve, reject) => {
      MongoClient.connect(
        this.MONGODB_URI,
        options,
        (err, client: MongoClient) => {
          if (err) {
            reject(err);
          } else {
            const indexOfA = this.MONGODB_URI.indexOf("@");
            const db =
              indexOfA !== -1
                ? this.MONGODB_URI.substring(0, 10) +
                  "!_:_!" +
                  this.MONGODB_URI.substring(indexOfA)
                : process.env.MONGODB_URI;
            // tslint:disable-next-line:no-console
            // TODO: winston
            logger.info(`MongoDB connected ${db}`);
            MongoConnection.client = client;
            resolve(client);
          }
        }
      );
    });
  }

  public disconnect(): Promise<any> {
    return MongoConnection.client.close();
  }
}
