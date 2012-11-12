function BaseController () { }

BaseController.extend = function(buildHelper) {
  var Controller = function(req, res, next) {
    this.setupAliases_(req, res, next);
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
/**
 * Call action actionName. This will also call any before filter that apply.
 */
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
    //console.log('stacking filters');
    this.stackBeforeFiltersFor_(actionName);
    //console.log('/stacking filters');
    this.callStack_.push(action);
    // Call first beforeFilter or action if there is no beforeFilter
    this.next();
  }
  else {
    function ActionNotFoundError () {};
    ActionNotFoundError.prototype = new Error();
    ActionNotFoundError.prototype.name = 'ActionNotFoundError';
    ActionNotFoundError.constructor = Error.constructor;
    throw new ActionNotFoundError('Could not find action');
  }
}

/**
 * Call next function on the stack (action or filter)
 */
BaseController.prototype.next = function(err) {
  if (!err && this.callStack_.length > 0) {
    var fn = this.callStack_.shift();
    // optionally pass req,res,next in as function arguments
    return fn.apply(this, [this.req, this.res, this.next.bind(this)]);
  }
  else {
    this.externalNext(err);
  }
  return;
}

/**
 * # Builder helpers
 */

BaseController.prototype.addAction = function (actionName, fn) {
  this.actions[actionName] = fn;
}

BaseController.prototype.beforeFilter = function (options, filter) {
  if(typeof options === 'function') {
    filter = options;
    options = { all: true };
  }

  filter.options = options;
  this.beforeFilters.push(filter);
}

/**
 * # Private methods
 */
BaseController.prototype.stackBeforeFiltersFor_ = function(actionName) {
  // @todo only add filters that apply to this action
  var self = this;
  // Climb up prototype chain
  var filters = [];
  var parent = this;
  while (parent) {
    if (parent.hasOwnProperty('beforeFilters')) {
      var currFilters = [];
      parent.beforeFilters.forEach(function(fn) {
        // check if we should run beforeFilter for current action
        //console.log('adding before filters for ' + parent.name);
        //console.log((parent === self));
        // self.__proto__ is the last controller we defined with BaseController.extend
        if (parent !== self.__proto__ && fn.options.inherit === false) {
          // dont inherit beforeFilters with property inherit: false
        }
        else if (!fn.options || fn.options.all === true) {
          currFilters.push(fn);
        }
        else if (fn.options.only && fn.options.only.indexOf(actionName) !== -1) {
          currFilters.push(fn);
        }
        else if (fn.options.except && fn.options.except.indexOf(actionName) === -1 ) {
          currFilters.push(fn);
        }
      });
      filters = currFilters.concat(filters);
    }
    parent = parent.__proto__;
  }
  // Reverse filter so that filters up the prototype chain get called first
  this.callStack_ = this.callStack_.concat(filters);
}

BaseController.prototype.setupAliases_ = function(req, res, next) {
  if(!(req && res)) return;

  var self = this;
  this.req = req;
  this.res = res;
  this.externalNext = next;

  alias(['render', 'locals', 'redirect', 'send'], res);
  alias(['params', 'session', 'url'], req);

  function alias(keys, target) {
    // set aliases for res object
    keys.forEach(function(key) {
      if(typeof target[key] === 'function') {
        self[key] = function() {
          return target[key].apply(target, arguments);
        };
      }
      else {
        self[key] = target[key];
      }
    });
  }
  this.loggedUser = req.user ? req.user : null;
}

module.exports = BaseController;
