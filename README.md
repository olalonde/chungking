# Chungking 

Controller for Connect and Express (Node.js / Express.js /
Connect.js). Name comes from [Chungking Express](http://en.wikipedia.org/wiki/Chungking_Express).

## Install

    npm install chungking

## Usage

Set up a Users controller

    // users.js
    var BaseController = require('chungking').BaseController;

    var Users = BaseController.extend(function() {
      // this === Users.prototype

      // Before filters are called whenever you call an action.
      // They are asynchronous so you need to call this.next()
      // when you are done.
      this.beforeFilter(function() {
        console.log('This is called before any action is called.');
        if(this.authenticate())
          this.next();
        else
          this.res.send('Not authorized');
      });
      
      // You can also add methods that are available to all your
      // actions.
      this.authenticate = function() {
        console.log('You can put some authentication code here.');
        return true;
      }

      // Add actions below
      this.action('index', function() {
        // this.req, this.res, this.next are available anywhere in
        // your controller.
        this.res.send('Users index.');
      });

    });
    
    module.exports = Users;

Call the controller from your request handler:

    // app.js
    var Users = require('./users');

    // ...

    app.get('/users', function(req, res, next) {
      var ctl = new Users(req, res, next);
      ctl.action('index');
    });

That's it!

### Extending controllers

You can also extend controllers.

Application controller:

    // application.js
    var BaseController = require('chungking').BaseController;

    var Application = BaseController.extend(function() {
      // This before filter will be called whenever a controller that
      // extends Application gets an action called.
      this.beforeFilter(function() {
        if(!this.req.user) res.send('Unauthorized!');
        else this.next();
      });

      // Set up some useful aliases
      this.beforeFilter(function() {
        this.currentSection = 'Application');
      });

      // This action will be available to any controller that extends
      // the Application controller.
      this.action('whoami', function() {
        this.res.send(this.req.user);
      });
    });
    
    module.exports = Application;

Users controller which extends the Application controller:


    // users.js
    var Application = require('./application');

    var Users = Application.extend(function() {
      this.beforeFilter(function() {
        console.log('This will be called after the Application'
          + 'controller\'s before filters.');
        this.next();
      });
      
      this.action('index', function() {
        res.send('We are in the section ' + this.currentSection);
      });
    });

# TODO #

- Limit before filters to only given actions.
- Create some useful alias for commonly used methods (i.e. this.res.send could be mapped to this.send)
