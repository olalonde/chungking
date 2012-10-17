var BaseController = require('../../lib/').BaseController;

var Application = BaseController.extend();

Application.prototype.beforeFilters = [
  function() {
    console.log('Before filter for all controllers');
    this.next();
    //this.next(new Error('oopsie!'));
  }
];

Application.prototype.actions.help = function() {
  console.log('Helping out!');
}

Application.prototype.version = function() {
  return '0.0.1';
};

module.exports = Application;
