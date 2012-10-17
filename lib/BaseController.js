function BaseController () { }

BaseController.extend = function(buildHelper) {
  var Controller = function(req, res, next) {
    this.req = req;
    this.res = res;
    this.externalNext = next;
  };
  Controller.prototype = new this();
  Controller.prototype.actions = {};
  Controller.prototype.beforeFilters = [];
  Controller.prototype.callStack_ = [];
  Controller.extend = this.extend;

  // Execute buildHelper function
  if (typeof buildHelper === 'function')
    buildHelper.call(Controller.prototype);

  return Controller;
}

BaseController.prototype.action = function(actionName, fn) {
  if (fn) return this.addAction(actionName, fn);

  var self = this;
  var action = this.actions[actionName];
  if (!action) {
    // Climb up prototype chain
    var parent = this.__proto__;
    while (parent) {
      if (parent.actions && parent.actions[actionName]) {
        action = parent.actions[actionName];
        break;
      }
      parent = parent.__proto__;
    }
  }
  if (action) {
    // Add before filters to stack
    this.stackBeforeFiltersFor(action);
    this.callStack_.push(action);
    // Call first beforeFilter or action if there is no beforeFilter
    this.next();
  }
}

BaseController.prototype.stackBeforeFiltersFor = function(actionName) {
  // @todo only add filters that apply to this action
  var self = this;
  // Climb up prototype chain
  var filters = [];
  var parent = this;
  while (parent) {
    if (parent.hasOwnProperty('beforeFilters'))
      filters = filters.concat(parent.beforeFilters);
    parent = parent.__proto__;
  }
  // Reverse filter so that filters up the prototype chain get called first
  filters.reverse();
  this.callStack_ = this.callStack_.concat(filters);
}

BaseController.prototype.next = function(err) {
  if (!err && this.callStack_.length > 0) {
    var fn = this.callStack_.shift();
    fn.call(this);
  }
  else {
    this.externalNext(err);
  }
  return;
}

/**
 * Builder helpers
 */

BaseController.prototype.addAction = function (actionName, fn) {
  this.actions[actionName] = fn;
}

BaseController.prototype.beforeFilter = function (filter) {
  //this.beforeFilters.push(filter);
}

module.exports = BaseController;
