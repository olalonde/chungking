var controllers = require('./')
  , Application = controllers.Application
  , BaseController = require('../../lib').BaseController;

var Home = Application.extend(function() {});

Home.prototype.actions.index = function() {
  console.log('Home index');
  console.log(this.req.url);
  //this.users (set by base controller)

  //this.res
  //this.req
  //this.next

  //@todo: alias some useful stuff (this.render == this.res.render, this.session, this.loggedUser etc.)
  //@todo: be able to cal res/req/next without this

}

Home.prototype.actions.error = function() {
  console.log('Simulating an error');
  this.next(new Error('oooopsie!'));
}
//}

module.exports = Home;
