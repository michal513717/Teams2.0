import type { Document } from "mongodb";
import { Collection, MongoClient } from "mongodb";
import MongoLocalClient from "../database/index";
import { DatabaseManagerConfig } from "../utils/configs/databaseManagerConfig";
import { MongoDatabase } from "../models/common.models";
import { UserSchema } from "../models/mongose.schema";

class DatabaseManager {

  private mongoDatabaseClient!: MongoClient;
  private config!: typeof DatabaseManagerConfig
  private database!: MongoDatabase;

  public static COLLECTIONS = {
    USERS_COLLECTION: 'usersCollection',
    CHAT_COLLECTION: 'chatCollection' 
  } as const;

  constructor(){
    this.init();
  };

  private async init(): Promise<void> {
    this.config = DatabaseManagerConfig;
    this.mongoDatabaseClient = await MongoLocalClient.getClient();
    this.database = this.mongoDatabaseClient.db(this.config.DATABASE_NAME);
  };

  private async getCollection<Schema extends Document>(collectionName: keyof typeof DatabaseManager.COLLECTIONS): Promise<Collection<Schema>> {
    return await this.database.collection<Schema>(DatabaseManager.COLLECTIONS[collectionName]);
  };

  public async isUserExist(userName: string): Promise<Promise<boolean>>{
    const collection = await this.getCollection("USERS_COLLECTION");
    return await collection.findOne({ userName: userName }) !== null;
  };

  public async addNewUser(data: UserSchema): Promise<void> {
    const collection = await this.getCollection<typeof data>("USERS_COLLECTION");
    await collection.insertOne(data);
  }
};

export const databaseManager = new DatabaseManager();