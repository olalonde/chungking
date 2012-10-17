var controllers = require('./')
  , Application = controllers.Application
  , BaseController = require('../../lib').BaseController;

var Users = Application.extend(function() {
  // this === Users.prototype
  // helper function to build controller more succinctly
  this.beforeFilter(function() {
    console.log('Users before filter added by builder');
    this.authenticate();

    this.next();
  });

  this.authenticate = function() {
    console.log('Authenticate method added by builder');
    console.log('Lets see if I know whatst the URL:');
    console.log(this.req.url);
  }

  this.action('new', function() {
    //this.req, this.res, this.next, etx.
    console.log('New action added by builder');
  });

});

console.log(Users);

Users.prototype.beforeFilters.push(
  function() {
    console.log('Users before filter');
    //console.log('Can I access this.version from application?');
    //console.log(this.version());
    this.next();
  }
);

//@todo: restrict before filters to specific actions
//Users.prototype.beforeFilters.push(
  //{
    //only: ['show', 'index']
    //, fn: function() {}
  //}
//);

//Users.prototype.beforeFilters.push(
  //{
    //fn: function() {}
//});

Users.prototype.actions.index = function() {
  console.log('Users index');
  console.log('Application tells me this is version ' + this.version());
  //this.send('Wohooo users index! URL is ' + this.url);
  this.next();
  //this.users (set by base controller)

  //this.res
  //this.req
  //this.next

  //@todo: alias some useful stuff (this.render == this.res.render, this.session, this.loggedUser etc.)
  //@todo: be able to cal res/req/next without this

}

Users.prototype.actions.show = function() {


}

//Users.prototype.actions.new = function() { 

//}

module.exports = Users;
