# Chungking 

Controller for Connect and Express (Node.js / Express.js /
Connect.js). Name comes from [Chungking Express](http://en.wikipedia.org/wiki/Chungking_Express).

## Install

    npm install chungking

## Usage

Set up a Users controller

```javascript
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
```

Call the controller from your request handler:

```javascript
// app.js
var Users = require('./users');

// ...

app.get('/users', function(req, res, next) {
  var ctl = new Users(req, res, next);
  ctl.action('index');
});
```

That's it!

### Restricting beforeFilters to only specific actions

```javascript
this.authorize = function() {
  console.log('This is called before any action is called.');
  //authentication code here...
}

// restrict to only some actions
this.beforeFilter({only: ['edit', 'update', 'create']}, function() {
  this.authorize();
});

// execute for all actions except listed actions
this.beforeFilter({except: ['show']}, function() {
  this.authorize();
});
```

### Tired of writing this.req, this.res and this.next?

You can optionally get them as params to your beforeFilters and actions.

```javascript
this.beforeFilter(function(req, res, next) {
  res.send('aaahhh much better :)');
});
```

### Extending controllers

You can also extend controllers.

Application controller:

```javascript
// application.js
var BaseController = require('chungking').BaseController;

var Application = BaseController.extend(function() {
  // This before filter will be called whenever a controller that
  // extends Application gets an action called.
  this.beforeFilter(function() {
    if(!this.req.user) this.res.send('Unauthorized!');
    else this.next();
  });

  // Set up some useful aliases
  this.beforeFilter(function() {
    this.currentSection = 'Application';
  });

  // This action will be available to any controller that extends
  // the Application controller.
  this.action('whoami', function() {
    this.res.send(this.req.user);
  });
});

module.exports = Application;
```

Users controller which extends the Application controller:

```javascript
// users.js
var Application = require('./application');

var Users = Application.extend(function() {
  this.beforeFilter(function() {
    console.log('This will be called after the Application'
      + 'controller\'s before filters.');
    this.next();
  });
  
  this.action('index', function() {
    this.res.send('We are in the section ' + this.currentSection);
  });
});
```

# TODO

Rethink how inheritance works. Maybe child controllers should not
inherit before filters and actions.

Refactor the way inheritance is done. Maybe use utils.inherit from
node.js http://nodejs.org/api/util.html#util_util_inherits_constructor_superconstructor.
