import { MainApp } from "./src/mainApp";
import { APPLICATION_CONFIG } from "./src/utils/configs/applicationConfig";

const application = new MainApp();

if(APPLICATION_CONFIG.DEBUG_APPLICATION){
  //* We can inspect code in the debugger at chrome://inspect/#devices
  //@ts-ignore
  global.MainApplication = application
}