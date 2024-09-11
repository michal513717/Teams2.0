import { Logger } from "../models/common.models";
import { MONGO_DB_URI } from "../utils/configs/secret";
import { MongoClient, ServerApiVersion } from "mongodb";
import LoggerHelper from "../utils/logger";

class MongoLocalClient {

  private mongoClient!: MongoClient | null;
  private logger!: Logger;

  constructor(){
    this.mongoClient = null;
    this.logger = LoggerHelper.getLogger("MongoLocalClient");
  }

  private async initClient(): Promise<MongoClient> {
    try {
      
      this.logger.log("Start client connection");

      const client = await new MongoClient(MONGO_DB_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      await client.connect();

      this.mongoClient = client;
      
      this.logger.log("Client connection success");
      
      return client;
    } catch (error) {
      this.logger.fatal("Error during connecting to MongoDB");
      process.exit();
    }
  }

  public async getClient(): Promise<MongoClient> {
    return this.mongoClient === null ? await this.initClient() : this.mongoClient;
  };

  public isMongoClientActive(): boolean{
    return this.mongoClient !== null;
  }

  public async closeClientConnection(): Promise<void>{

    if(this.mongoClient === null) return;

    this.logger.info("Closing client connection");

    await this.mongoClient?.close();
      
    this.mongoClient = null;
  }
}

const instance = new MongoLocalClient();

export default instance;