

class ManagersCollection {

  private managers: Record<string, any>;

  constructor(){
    this.managers = {};
  }

  getManagerById<T>(managerId: string): T{
    if(!this.managers[managerId]) console.warn(`Manager ${managerId} doesn't exist!`);

    return this.managers[managerId];
  }

  addManager(id: string, manager: any): void{
    if(this.managers[id]) return;
    
    this.managers[id] = manager;
  }
}

const instance = new ManagersCollection();

export default instance;