import type { Document, FindCursor } from "mongodb";
import { Collection, MongoClient, ObjectId, Timestamp } from "mongodb";
import MongoLocalClient from "../database/index";
import { DatabaseManagerConfig } from "../utils/configs/databaseManagerConfig";
import { MongoDatabase } from "../models/common.models";
import { ChatDatabaseSchema, ChatInitData, ConversationData, UserDatabaseSchema } from "../models/mongose.schema";

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

  public async isUserExist(userName: string): Promise<boolean>{
    const collection = await this.getCollection("USERS_COLLECTION");
    return await collection.findOne({ userName: userName }) !== null;
  };

  public async getUser(userName: string): Promise<null | UserDatabaseSchema>{
    const collection = await this.getCollection<UserDatabaseSchema>("USERS_COLLECTION");
    return await collection.findOne({ userName: userName });
  }

  public async addNewUser(data: UserDatabaseSchema): Promise<void> {
    const collection = await this.getCollection<typeof data>("USERS_COLLECTION");
    await collection.insertOne(data);
  }

  public async getAllUsers(): Promise<string[]> {
    
    const collection = await this.getCollection<UserDatabaseSchema>("USERS_COLLECTION");

    const cursorData = collection.find();
    
    let result = [];

    for await (const doc of cursorData){
      result.push(doc.userName);
    }

    return result;
  }

  public async getAllMesseges(userName: string): Promise<ChatDatabaseSchema[]>{
    const collection = await this.getCollection<ChatDatabaseSchema>("CHAT_COLLECTION");

    const cursorData = await collection.find({
      members: { $in: [userName] }
    });

    let data = [];

    for await (const doc of cursorData){
      data.push(doc);
    }

    return data;
  }

  public async saveMessage(data: ConversationData): Promise<void>{
    const collection = await this.getCollection<ChatDatabaseSchema>("CHAT_COLLECTION");
    const cursorData = await collection.find({
      members: [data.from, data.to]
    });
    const cursorLength = await this.countCursorData(cursorData);
    
    if(cursorLength === 0){
      this.addNewChatRecord(data);
      return;
    };

    collection.updateOne({
      members: [data.from, data.to]
    }, {
      $push: {"messages": {
        sender: data.from,
        message: data.message,
        timestamp: new Date()
      }}
    });
  }

  private async addNewChatRecord(data: ConversationData): Promise<void>{
    const collection = await this.getCollection<ChatDatabaseSchema>("CHAT_COLLECTION");
    const record: ChatDatabaseSchema = {
      _id: new ObjectId(),
      members: [data.from, data.to],
      messages: [{
        message: data.message,
        sender: data.from,
        timestamp: new Date()
      }],
      total_messages: 1
    };

    await collection.insertOne(record);
  }

  private async countCursorData(data: FindCursor): Promise<number>{
    let counter = 0;
    for await(const doc of data){
      counter++;
    }
    return counter;
  }

  public async getUserChatHistory(userName:string){
    const chatHistory = await this.getAllMesseges(userName);
    let result: ChatInitData[] = [];

    chatHistory.forEach((chatRecord) => {
      chatRecord.messages.forEach((message) => {
        result.push({
          from: message.sender,
          message: message.message,
          to: message.sender === chatRecord.members[0] ? chatRecord.members[1] : chatRecord.members[0]//Need to fix types
        })
      })
    })

    return result;
  }
};

export const databaseManager = new DatabaseManager();