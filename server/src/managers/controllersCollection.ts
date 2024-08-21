

class ControllersCollection {

  private controllers: Record<string, any>;

  constructor(){
    this.controllers = {};
  }

  getControllerById<T>(controllerId: string): T{
    if(!this.controllers[controllerId]) console.warn(`Controller ${controllerId} doesn't exist!`);

    return this.controllers[controllerId];
  }

  addController(id: string, controller: any): void{
    if(this.controllers[id]) return;
    
    this.controllers[id] = controller;
  }
}

const instance = new ControllersCollection();

export default instance;