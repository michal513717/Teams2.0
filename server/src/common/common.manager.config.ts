import { Logger } from "../models/common.models";
import LoggerHelper from "../utils/logger";

export abstract class Manager {

  protected instanceName!: string;
  protected logger!: Logger;

  static async createClassInstance<T extends Manager>(this: new () => T, ...args: any): Promise<T>{
    const instance = new this();
    await instance.init();
    return instance;
  }

  protected abstract init(): Promise<void>

  protected setupLogger(instanceName: string): void{
    this.logger = LoggerHelper.getLogger(instanceName);
    this.logger.info(`Initializing setup for ${instanceName}.`);
    this.instanceName = instanceName;
  }

  protected finishSetup(): void{
    this.logger.info(`Setup for ${this.instanceName} completed successfully.`);
  }
}