import { MONGO_DB_URI } from "../utils/configs/secret";
import { MongoClient, ServerApiVersion } from "mongodb";


class MongoLocalClient {

  private mongoClient!: MongoClient | null;

  constructor(){
    this.mongoClient = null;
  }

  private async initClient(): Promise<MongoClient> {
    const client = new MongoClient(MONGO_DB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    client.connect();

    return client;
  }

  public async getClient(): Promise<MongoClient> {
    return this.mongoClient === null ? await this.initClient() : this.mongoClient;
  };
}

export default new MongoLocalClient();