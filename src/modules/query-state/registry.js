export class Registry {
  modules = new Map()
  triggers = new Set()

  add(name, options) {
    const { actions } = options;
    const actionStrings = actions.map(action => action.toString());

    // We only need strings to match
    this.triggers = new Set([...this.triggers, ...actionStrings]); 
    this.modules.set(name, options);
  }
}
