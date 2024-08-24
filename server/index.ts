import { MainApp } from "./src/mainApp";
import { APPLICATION_CONFIG } from "./src/utils/configs/applicationConfig";

(async() => {
  const application = await MainApp.createClassInstance();

  if(APPLICATION_CONFIG.DEBUG_APPLICATION){
    //* We can inspect code in the debugger at chrome://inspect/#devices
    //@ts-ignore
    global.MainApplication = application
  }
})()
