(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * cuid.js
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 * Extracted from CLCTR
 *
 * Copyright (c) Eric Elliott 2012
 * MIT License
 */

/*global window, navigator, document, require, process, module */
(function (app) {
  'use strict';
  var namespace = 'cuid',
    c = 0,
    blockSize = 4,
    base = 36,
    discreteValues = Math.pow(base, blockSize),

    pad = function pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
    },

    randomBlock = function randomBlock() {
      return pad((Math.random() *
            discreteValues << 0)
            .toString(base), blockSize);
    },

    safeCounter = function () {
      c = (c < discreteValues) ? c : 0;
      c++; // this is not subliminal
      return c - 1;
    },

    api = function cuid() {
      // Starting with a lowercase letter makes
      // it HTML element ID friendly.
      var letter = 'c', // hard-coded allows for sequential access

        // timestamp
        // warning: this exposes the exact date and time
        // that the uid was created.
        timestamp = (new Date().getTime()).toString(base),

        // Prevent same-machine collisions.
        counter,

        // A few chars to generate distinct ids for different
        // clients (so different computers are far less
        // likely to generate the same id)
        fingerprint = api.fingerprint(),

        // Grab some more chars from Math.random()
        random = randomBlock() + randomBlock();

        counter = pad(safeCounter().toString(base), blockSize);

      return  (letter + timestamp + counter + fingerprint + random);
    };

  api.slug = function slug() {
    var date = new Date().getTime().toString(36),
      counter,
      print = api.fingerprint().slice(0,1) +
        api.fingerprint().slice(-1),
      random = randomBlock().slice(-2);

      counter = safeCounter().toString(36).slice(-4);

    return date.slice(-2) +
      counter + print + random;
  };

  api.globalCount = function globalCount() {
    // We want to cache the results of this
    var cache = (function calc() {
        var i,
          count = 0;

        for (i in window) {
          count++;
        }

        return count;
      }());

    api.globalCount = function () { return cache; };
    return cache;
  };

  api.fingerprint = function browserPrint() {
    return pad((navigator.mimeTypes.length +
      navigator.userAgent.length).toString(36) +
      api.globalCount().toString(36), 4);
  };

  // don't change anything from here down.
  if (app.register) {
    app.register(namespace, api);
  } else if (typeof module !== 'undefined') {
    module.exports = api;
  } else {
    app[namespace] = api;
  }

}(this.applitude || this));

},{}],2:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.2.1
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // see https://github.com/cujojs/when/issues/410 for details
      return function() {
        process.nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertx() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }
    function lib$es6$promise$then$$then(onFulfillment, onRejection) {
      var parent = this;

      var child = new this.constructor(lib$es6$promise$$internal$$noop);

      if (child[lib$es6$promise$$internal$$PROMISE_ID] === undefined) {
        lib$es6$promise$$internal$$makePromise(child);
      }

      var state = parent._state;

      if (state) {
        var callback = arguments[state - 1];
        lib$es6$promise$asap$$asap(function(){
          lib$es6$promise$$internal$$invokeCallback(state, child, callback, parent._result);
        });
      } else {
        lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
      }

      return child;
    }
    var lib$es6$promise$then$$default = lib$es6$promise$then$$then;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    var lib$es6$promise$$internal$$PROMISE_ID = Math.random().toString(36).substring(16);

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFulfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
      if (maybeThenable.constructor === promise.constructor &&
          then === lib$es6$promise$then$$default &&
          constructor.resolve === lib$es6$promise$promise$resolve$$default) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value));
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    var lib$es6$promise$$internal$$id = 0;
    function lib$es6$promise$$internal$$nextId() {
      return lib$es6$promise$$internal$$id++;
    }

    function lib$es6$promise$$internal$$makePromise(promise) {
      promise[lib$es6$promise$$internal$$PROMISE_ID] = lib$es6$promise$$internal$$id++;
      promise._state = undefined;
      promise._result = undefined;
      promise._subscribers = [];
    }

    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      if (!lib$es6$promise$utils$$isArray(entries)) {
        return new Constructor(function(resolve, reject) {
          reject(new TypeError('You must pass an array to race.'));
        });
      } else {
        return new Constructor(function(resolve, reject) {
          var length = entries.length;
          for (var i = 0; i < length; i++) {
            Constructor.resolve(entries[i]).then(resolve, reject);
          }
        });
      }
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;


    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this[lib$es6$promise$$internal$$PROMISE_ID] = lib$es6$promise$$internal$$nextId();
      this._result = this._state = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        typeof resolver !== 'function' && lib$es6$promise$promise$$needsResolver();
        this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew();
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: lib$es6$promise$then$$default,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!this.promise[lib$es6$promise$$internal$$PROMISE_ID]) {
        lib$es6$promise$$internal$$makePromise(this.promise);
      }

      if (lib$es6$promise$utils$$isArray(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._result = new Array(this.length);

        if (this.length === 0) {
          lib$es6$promise$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(this.promise, lib$es6$promise$enumerator$$validationError());
      }
    }

    function lib$es6$promise$enumerator$$validationError() {
      return new Error('Array Methods must be provided an Array');
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var input   = this._input;

      for (var i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      var resolve = c.resolve;

      if (resolve === lib$es6$promise$promise$resolve$$default) {
        var then = lib$es6$promise$$internal$$getThen(entry);

        if (then === lib$es6$promise$then$$default &&
            entry._state !== lib$es6$promise$$internal$$PENDING) {
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof then !== 'function') {
          this._remaining--;
          this._result[i] = entry;
        } else if (c === lib$es6$promise$promise$$default) {
          var promise = new c(lib$es6$promise$$internal$$noop);
          lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);
        }
      } else {
        this._willSettleAt(resolve(entry), i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        this._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          this._result[i] = value;
        }
      }

      if (this._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, this._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":19}],3:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
var wildcard = require('wildcard');
var reMimePartSplit = /[\/\+\.]/;

/**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
module.exports = function(target, pattern) {
  function test(pattern) {
    var result = wildcard(pattern, target, reMimePartSplit);

    // ensure that we have a valid mime type (should have two parts)
    return result && result.length >= 2;
  }

  return pattern ? test(pattern.split(';')[0]) : test;
};

},{"wildcard":8}],5:[function(require,module,exports){
/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/
module.exports = function createNamespaceEmitter () {
  var emitter = {}
  var _fns = emitter._fns = {}

  /**
  * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – up to 6 arguments that are passed to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event, arg1, arg2, arg3, arg4, arg5, arg6) {
    var toEmit = getListeners(event)

    if (toEmit.length) {
      emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6])
    }
  }

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (!_fns[event]) {
      _fns[event] = []
    }

    _fns[event].push(fn)
  }

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments)
      emitter.off(event, one)
    }
    this.on(event, one)
  }

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = []

    if (event && fn) {
      var fns = this._fns[event]
      var i = 0
      var l = fns.length

      for (i; i < l; i++) {
        if (fns[i] !== fn) {
          keep.push(fns[i])
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event]
  }

  function getListeners (e) {
    var out = _fns[e] ? _fns[e] : []
    var idx = e.indexOf(':')
    var args = (idx === -1) ? [e] : [e.substring(0, idx), e.substring(idx + 1)]

    var keys = Object.keys(_fns)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      var key = keys[i]
      if (key === '*') {
        out = out.concat(_fns[key])
      }

      if (args.length === 2 && args[0] === key) {
        out = out.concat(_fns[key])
        break
      }
    }

    return out
  }

  function emitAll (e, fns, args) {
    var i = 0
    var l = fns.length

    for (i; i < l; i++) {
      if (!fns[i]) break
      fns[i].event = e
      fns[i].apply(fns[i], args)
    }
  }

  return emitter
}

},{}],6:[function(require,module,exports){
!function() {
    'use strict';
    function VNode() {}
    function h(nodeName, attributes) {
        var lastSimple, child, simple, i, children = EMPTY_CHILDREN;
        for (i = arguments.length; i-- > 2; ) stack.push(arguments[i]);
        if (attributes && null != attributes.children) {
            if (!stack.length) stack.push(attributes.children);
            delete attributes.children;
        }
        while (stack.length) if ((child = stack.pop()) && void 0 !== child.pop) for (i = child.length; i--; ) stack.push(child[i]); else {
            if ('boolean' == typeof child) child = null;
            if (simple = 'function' != typeof nodeName) if (null == child) child = ''; else if ('number' == typeof child) child = String(child); else if ('string' != typeof child) simple = !1;
            if (simple && lastSimple) children[children.length - 1] += child; else if (children === EMPTY_CHILDREN) children = [ child ]; else children.push(child);
            lastSimple = simple;
        }
        var p = new VNode();
        p.nodeName = nodeName;
        p.children = children;
        p.attributes = null == attributes ? void 0 : attributes;
        p.key = null == attributes ? void 0 : attributes.key;
        if (void 0 !== options.vnode) options.vnode(p);
        return p;
    }
    function extend(obj, props) {
        for (var i in props) obj[i] = props[i];
        return obj;
    }
    function cloneElement(vnode, props) {
        return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
    }
    function enqueueRender(component) {
        if (!component.__d && (component.__d = !0) && 1 == items.push(component)) (options.debounceRendering || defer)(rerender);
    }
    function rerender() {
        var p, list = items;
        items = [];
        while (p = list.pop()) if (p.__d) renderComponent(p);
    }
    function isSameNodeType(node, vnode, hydrating) {
        if ('string' == typeof vnode || 'number' == typeof vnode) return void 0 !== node.splitText;
        if ('string' == typeof vnode.nodeName) return !node._componentConstructor && isNamedNode(node, vnode.nodeName); else return hydrating || node._componentConstructor === vnode.nodeName;
    }
    function isNamedNode(node, nodeName) {
        return node.__n === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
    }
    function getNodeProps(vnode) {
        var props = extend({}, vnode.attributes);
        props.children = vnode.children;
        var defaultProps = vnode.nodeName.defaultProps;
        if (void 0 !== defaultProps) for (var i in defaultProps) if (void 0 === props[i]) props[i] = defaultProps[i];
        return props;
    }
    function createNode(nodeName, isSvg) {
        var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
        node.__n = nodeName;
        return node;
    }
    function removeNode(node) {
        var parentNode = node.parentNode;
        if (parentNode) parentNode.removeChild(node);
    }
    function setAccessor(node, name, old, value, isSvg) {
        if ('className' === name) name = 'class';
        if ('key' === name) ; else if ('ref' === name) {
            if (old) old(null);
            if (value) value(node);
        } else if ('class' === name && !isSvg) node.className = value || ''; else if ('style' === name) {
            if (!value || 'string' == typeof value || 'string' == typeof old) node.style.cssText = value || '';
            if (value && 'object' == typeof value) {
                if ('string' != typeof old) for (var i in old) if (!(i in value)) node.style[i] = '';
                for (var i in value) node.style[i] = 'number' == typeof value[i] && !1 === IS_NON_DIMENSIONAL.test(i) ? value[i] + 'px' : value[i];
            }
        } else if ('dangerouslySetInnerHTML' === name) {
            if (value) node.innerHTML = value.__html || '';
        } else if ('o' == name[0] && 'n' == name[1]) {
            var useCapture = name !== (name = name.replace(/Capture$/, ''));
            name = name.toLowerCase().substring(2);
            if (value) {
                if (!old) node.addEventListener(name, eventProxy, useCapture);
            } else node.removeEventListener(name, eventProxy, useCapture);
            (node.__l || (node.__l = {}))[name] = value;
        } else if ('list' !== name && 'type' !== name && !isSvg && name in node) {
            setProperty(node, name, null == value ? '' : value);
            if (null == value || !1 === value) node.removeAttribute(name);
        } else {
            var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
            if (null == value || !1 === value) if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase()); else node.removeAttribute(name); else if ('function' != typeof value) if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value); else node.setAttribute(name, value);
        }
    }
    function setProperty(node, name, value) {
        try {
            node[name] = value;
        } catch (e) {}
    }
    function eventProxy(e) {
        return this.__l[e.type](options.event && options.event(e) || e);
    }
    function flushMounts() {
        var c;
        while (c = mounts.pop()) {
            if (options.afterMount) options.afterMount(c);
            if (c.componentDidMount) c.componentDidMount();
        }
    }
    function diff(dom, vnode, context, mountAll, parent, componentRoot) {
        if (!diffLevel++) {
            isSvgMode = null != parent && void 0 !== parent.ownerSVGElement;
            hydrating = null != dom && !('__preactattr_' in dom);
        }
        var ret = idiff(dom, vnode, context, mountAll, componentRoot);
        if (parent && ret.parentNode !== parent) parent.appendChild(ret);
        if (!--diffLevel) {
            hydrating = !1;
            if (!componentRoot) flushMounts();
        }
        return ret;
    }
    function idiff(dom, vnode, context, mountAll, componentRoot) {
        var out = dom, prevSvgMode = isSvgMode;
        if (null == vnode || 'boolean' == typeof vnode) vnode = '';
        if ('string' == typeof vnode || 'number' == typeof vnode) {
            if (dom && void 0 !== dom.splitText && dom.parentNode && (!dom._component || componentRoot)) {
                if (dom.nodeValue != vnode) dom.nodeValue = vnode;
            } else {
                out = document.createTextNode(vnode);
                if (dom) {
                    if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
                    recollectNodeTree(dom, !0);
                }
            }
            out.__preactattr_ = !0;
            return out;
        }
        var vnodeName = vnode.nodeName;
        if ('function' == typeof vnodeName) return buildComponentFromVNode(dom, vnode, context, mountAll);
        isSvgMode = 'svg' === vnodeName ? !0 : 'foreignObject' === vnodeName ? !1 : isSvgMode;
        vnodeName = String(vnodeName);
        if (!dom || !isNamedNode(dom, vnodeName)) {
            out = createNode(vnodeName, isSvgMode);
            if (dom) {
                while (dom.firstChild) out.appendChild(dom.firstChild);
                if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
                recollectNodeTree(dom, !0);
            }
        }
        var fc = out.firstChild, props = out.__preactattr_, vchildren = vnode.children;
        if (null == props) {
            props = out.__preactattr_ = {};
            for (var a = out.attributes, i = a.length; i--; ) props[a[i].name] = a[i].value;
        }
        if (!hydrating && vchildren && 1 === vchildren.length && 'string' == typeof vchildren[0] && null != fc && void 0 !== fc.splitText && null == fc.nextSibling) {
            if (fc.nodeValue != vchildren[0]) fc.nodeValue = vchildren[0];
        } else if (vchildren && vchildren.length || null != fc) innerDiffNode(out, vchildren, context, mountAll, hydrating || null != props.dangerouslySetInnerHTML);
        diffAttributes(out, vnode.attributes, props);
        isSvgMode = prevSvgMode;
        return out;
    }
    function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
        var j, c, f, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren ? vchildren.length : 0;
        if (0 !== len) for (var i = 0; i < len; i++) {
            var _child = originalChildren[i], props = _child.__preactattr_, key = vlen && props ? _child._component ? _child._component.__k : props.key : null;
            if (null != key) {
                keyedLen++;
                keyed[key] = _child;
            } else if (props || (void 0 !== _child.splitText ? isHydrating ? _child.nodeValue.trim() : !0 : isHydrating)) children[childrenLen++] = _child;
        }
        if (0 !== vlen) for (var i = 0; i < vlen; i++) {
            vchild = vchildren[i];
            child = null;
            var key = vchild.key;
            if (null != key) {
                if (keyedLen && void 0 !== keyed[key]) {
                    child = keyed[key];
                    keyed[key] = void 0;
                    keyedLen--;
                }
            } else if (!child && min < childrenLen) for (j = min; j < childrenLen; j++) if (void 0 !== children[j] && isSameNodeType(c = children[j], vchild, isHydrating)) {
                child = c;
                children[j] = void 0;
                if (j === childrenLen - 1) childrenLen--;
                if (j === min) min++;
                break;
            }
            child = idiff(child, vchild, context, mountAll);
            f = originalChildren[i];
            if (child && child !== dom && child !== f) if (null == f) dom.appendChild(child); else if (child === f.nextSibling) removeNode(f); else dom.insertBefore(child, f);
        }
        if (keyedLen) for (var i in keyed) if (void 0 !== keyed[i]) recollectNodeTree(keyed[i], !1);
        while (min <= childrenLen) if (void 0 !== (child = children[childrenLen--])) recollectNodeTree(child, !1);
    }
    function recollectNodeTree(node, unmountOnly) {
        var component = node._component;
        if (component) unmountComponent(component); else {
            if (null != node.__preactattr_ && node.__preactattr_.ref) node.__preactattr_.ref(null);
            if (!1 === unmountOnly || null == node.__preactattr_) removeNode(node);
            removeChildren(node);
        }
    }
    function removeChildren(node) {
        node = node.lastChild;
        while (node) {
            var next = node.previousSibling;
            recollectNodeTree(node, !0);
            node = next;
        }
    }
    function diffAttributes(dom, attrs, old) {
        var name;
        for (name in old) if ((!attrs || null == attrs[name]) && null != old[name]) setAccessor(dom, name, old[name], old[name] = void 0, isSvgMode);
        for (name in attrs) if (!('children' === name || 'innerHTML' === name || name in old && attrs[name] === ('value' === name || 'checked' === name ? dom[name] : old[name]))) setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
    function collectComponent(component) {
        var name = component.constructor.name;
        (components[name] || (components[name] = [])).push(component);
    }
    function createComponent(Ctor, props, context) {
        var inst, list = components[Ctor.name];
        if (Ctor.prototype && Ctor.prototype.render) {
            inst = new Ctor(props, context);
            Component.call(inst, props, context);
        } else {
            inst = new Component(props, context);
            inst.constructor = Ctor;
            inst.render = doRender;
        }
        if (list) for (var i = list.length; i--; ) if (list[i].constructor === Ctor) {
            inst.__b = list[i].__b;
            list.splice(i, 1);
            break;
        }
        return inst;
    }
    function doRender(props, state, context) {
        return this.constructor(props, context);
    }
    function setComponentProps(component, props, opts, context, mountAll) {
        if (!component.__x) {
            component.__x = !0;
            if (component.__r = props.ref) delete props.ref;
            if (component.__k = props.key) delete props.key;
            if (!component.base || mountAll) {
                if (component.componentWillMount) component.componentWillMount();
            } else if (component.componentWillReceiveProps) component.componentWillReceiveProps(props, context);
            if (context && context !== component.context) {
                if (!component.__c) component.__c = component.context;
                component.context = context;
            }
            if (!component.__p) component.__p = component.props;
            component.props = props;
            component.__x = !1;
            if (0 !== opts) if (1 === opts || !1 !== options.syncComponentUpdates || !component.base) renderComponent(component, 1, mountAll); else enqueueRender(component);
            if (component.__r) component.__r(component);
        }
    }
    function renderComponent(component, opts, mountAll, isChild) {
        if (!component.__x) {
            var rendered, inst, cbase, props = component.props, state = component.state, context = component.context, previousProps = component.__p || props, previousState = component.__s || state, previousContext = component.__c || context, isUpdate = component.base, nextBase = component.__b, initialBase = isUpdate || nextBase, initialChildComponent = component._component, skip = !1;
            if (isUpdate) {
                component.props = previousProps;
                component.state = previousState;
                component.context = previousContext;
                if (2 !== opts && component.shouldComponentUpdate && !1 === component.shouldComponentUpdate(props, state, context)) skip = !0; else if (component.componentWillUpdate) component.componentWillUpdate(props, state, context);
                component.props = props;
                component.state = state;
                component.context = context;
            }
            component.__p = component.__s = component.__c = component.__b = null;
            component.__d = !1;
            if (!skip) {
                rendered = component.render(props, state, context);
                if (component.getChildContext) context = extend(extend({}, context), component.getChildContext());
                var toUnmount, base, childComponent = rendered && rendered.nodeName;
                if ('function' == typeof childComponent) {
                    var childProps = getNodeProps(rendered);
                    inst = initialChildComponent;
                    if (inst && inst.constructor === childComponent && childProps.key == inst.__k) setComponentProps(inst, childProps, 1, context, !1); else {
                        toUnmount = inst;
                        component._component = inst = createComponent(childComponent, childProps, context);
                        inst.__b = inst.__b || nextBase;
                        inst.__u = component;
                        setComponentProps(inst, childProps, 0, context, !1);
                        renderComponent(inst, 1, mountAll, !0);
                    }
                    base = inst.base;
                } else {
                    cbase = initialBase;
                    toUnmount = initialChildComponent;
                    if (toUnmount) cbase = component._component = null;
                    if (initialBase || 1 === opts) {
                        if (cbase) cbase._component = null;
                        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, !0);
                    }
                }
                if (initialBase && base !== initialBase && inst !== initialChildComponent) {
                    var baseParent = initialBase.parentNode;
                    if (baseParent && base !== baseParent) {
                        baseParent.replaceChild(base, initialBase);
                        if (!toUnmount) {
                            initialBase._component = null;
                            recollectNodeTree(initialBase, !1);
                        }
                    }
                }
                if (toUnmount) unmountComponent(toUnmount);
                component.base = base;
                if (base && !isChild) {
                    var componentRef = component, t = component;
                    while (t = t.__u) (componentRef = t).base = base;
                    base._component = componentRef;
                    base._componentConstructor = componentRef.constructor;
                }
            }
            if (!isUpdate || mountAll) mounts.unshift(component); else if (!skip) {
                if (component.componentDidUpdate) component.componentDidUpdate(previousProps, previousState, previousContext);
                if (options.afterUpdate) options.afterUpdate(component);
            }
            if (null != component.__h) while (component.__h.length) component.__h.pop().call(component);
            if (!diffLevel && !isChild) flushMounts();
        }
    }
    function buildComponentFromVNode(dom, vnode, context, mountAll) {
        var c = dom && dom._component, originalComponent = c, oldDom = dom, isDirectOwner = c && dom._componentConstructor === vnode.nodeName, isOwner = isDirectOwner, props = getNodeProps(vnode);
        while (c && !isOwner && (c = c.__u)) isOwner = c.constructor === vnode.nodeName;
        if (c && isOwner && (!mountAll || c._component)) {
            setComponentProps(c, props, 3, context, mountAll);
            dom = c.base;
        } else {
            if (originalComponent && !isDirectOwner) {
                unmountComponent(originalComponent);
                dom = oldDom = null;
            }
            c = createComponent(vnode.nodeName, props, context);
            if (dom && !c.__b) {
                c.__b = dom;
                oldDom = null;
            }
            setComponentProps(c, props, 1, context, mountAll);
            dom = c.base;
            if (oldDom && dom !== oldDom) {
                oldDom._component = null;
                recollectNodeTree(oldDom, !1);
            }
        }
        return dom;
    }
    function unmountComponent(component) {
        if (options.beforeUnmount) options.beforeUnmount(component);
        var base = component.base;
        component.__x = !0;
        if (component.componentWillUnmount) component.componentWillUnmount();
        component.base = null;
        var inner = component._component;
        if (inner) unmountComponent(inner); else if (base) {
            if (base.__preactattr_ && base.__preactattr_.ref) base.__preactattr_.ref(null);
            component.__b = base;
            removeNode(base);
            collectComponent(component);
            removeChildren(base);
        }
        if (component.__r) component.__r(null);
    }
    function Component(props, context) {
        this.__d = !0;
        this.context = context;
        this.props = props;
        this.state = this.state || {};
    }
    function render(vnode, parent, merge) {
        return diff(merge, vnode, {}, !1, parent, !1);
    }
    var options = {};
    var stack = [];
    var EMPTY_CHILDREN = [];
    var defer = 'function' == typeof Promise ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;
    var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
    var items = [];
    var mounts = [];
    var diffLevel = 0;
    var isSvgMode = !1;
    var hydrating = !1;
    var components = {};
    extend(Component.prototype, {
        setState: function(state, callback) {
            var s = this.state;
            if (!this.__s) this.__s = extend({}, s);
            extend(s, 'function' == typeof state ? state(s, this.props) : state);
            if (callback) (this.__h = this.__h || []).push(callback);
            enqueueRender(this);
        },
        forceUpdate: function(callback) {
            if (callback) (this.__h = this.__h || []).push(callback);
            renderComponent(this, 2);
        },
        render: function() {}
    });
    var preact = {
        h: h,
        createElement: h,
        cloneElement: cloneElement,
        Component: Component,
        render: render,
        rerender: rerender,
        options: options
    };
    if ('undefined' != typeof module) module.exports = preact; else self.preact = preact;
}();

},{}],7:[function(require,module,exports){
module.exports = prettierBytes

function prettierBytes (num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num)
  }

  var neg = num < 0
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  num = Number(num / Math.pow(1000, exponent))
  var unit = units[exponent]

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit
  }
}

},{}],8:[function(require,module,exports){
/* jshint node: true */
'use strict';

/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = ~text.indexOf('*');
  this.separator = separator;
  this.parts = text.split(separator);
}

WildcardMatcher.prototype.match = function(input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);
      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*')  {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      }

      // If matches, then return the component parts
      matches = matches && testParts;
    }
  }
  else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--; ) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  }
  else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

module.exports = function(text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};

},{}],9:[function(require,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = require('../core/Utils');
var Translator = require('../core/Translator');
var ee = require('namespace-emitter');
var cuid = require('cuid');
var throttle = require('lodash.throttle');
var prettyBytes = require('prettier-bytes');
var match = require('mime-match');
var DefaultStore = require('../store/DefaultStore');
// const deepFreeze = require('deep-freeze-strict')

/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 *
 * @param {object} opts — Uppy options
 */

var Uppy = function () {
  function Uppy(opts) {
    var _this = this;

    _classCallCheck(this, Uppy);

    var defaultLocale = {
      strings: {
        youCanOnlyUploadX: {
          0: 'You can only upload %{smart_count} file',
          1: 'You can only upload %{smart_count} files'
        },
        youHaveToAtLeastSelectX: {
          0: 'You have to select at least %{smart_count} file',
          1: 'You have to select at least %{smart_count} files'
        },
        exceedsSize: 'This file exceeds maximum allowed size of',
        youCanOnlyUploadFileTypes: 'You can only upload:',
        uppyServerError: 'Connection with Uppy Server failed'
      }

      // set default options
    };var defaultOptions = {
      id: 'uppy',
      autoProceed: true,
      debug: false,
      restrictions: {
        maxFileSize: false,
        maxNumberOfFiles: false,
        minNumberOfFiles: false,
        allowedFileTypes: false
      },
      meta: {},
      onBeforeFileAdded: function onBeforeFileAdded(currentFile, files) {
        return Promise.resolve();
      },
      onBeforeUpload: function onBeforeUpload(files, done) {
        return Promise.resolve();
      },
      locale: defaultLocale,
      store: new DefaultStore(),
      thumbnailGeneration: true

      // Merge default options with the ones set by user
    };this.opts = _extends({}, defaultOptions, opts);

    this.locale = _extends({}, defaultLocale, this.opts.locale);
    this.locale.strings = _extends({}, defaultLocale.strings, this.opts.locale.strings);

    // i18n
    this.translator = new Translator({ locale: this.locale });
    this.i18n = this.translator.translate.bind(this.translator);

    // Container for different types of plugins
    this.plugins = {};

    this.translator = new Translator({ locale: this.opts.locale });
    this.i18n = this.translator.translate.bind(this.translator);
    this.getState = this.getState.bind(this);
    this.getPlugin = this.getPlugin.bind(this);
    this.setFileMeta = this.setFileMeta.bind(this);
    this.setFileState = this.setFileState.bind(this);
    this.log = this.log.bind(this);
    this.info = this.info.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this.addFile = this.addFile.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.pauseResume = this.pauseResume.bind(this);
    this._calculateProgress = this._calculateProgress.bind(this);
    this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
    this.resetProgress = this.resetProgress.bind(this);

    this.pauseAll = this.pauseAll.bind(this);
    this.resumeAll = this.resumeAll.bind(this);
    this.retryAll = this.retryAll.bind(this);
    this.cancelAll = this.cancelAll.bind(this);
    this.retryUpload = this.retryUpload.bind(this);
    this.upload = this.upload.bind(this);

    this.emitter = ee();
    this.on = this.emitter.on.bind(this.emitter);
    this.off = this.emitter.off.bind(this.emitter);
    this.once = this.emitter.once.bind(this.emitter);
    this.emit = this.emitter.emit.bind(this.emitter);

    this.preProcessors = [];
    this.uploaders = [];
    this.postProcessors = [];

    this.store = this.opts.store;
    this.setState({
      plugins: {},
      files: {},
      currentUploads: {},
      capabilities: {
        resumableUploads: false
      },
      totalProgress: 0,
      meta: _extends({}, this.opts.meta),
      info: {
        isHidden: true,
        type: 'info',
        message: ''
      }
    });

    this._storeUnsubscribe = this.store.subscribe(function (prevState, nextState, patch) {
      _this.emit('state-update', prevState, nextState, patch);
      _this.updateAll(nextState);
    });

    // for debugging and testing
    // this.updateNum = 0
    if (this.opts.debug) {
      global.uppyLog = '';
      global[this.opts.id] = this;
    }
  }

  /**
   * Iterate on all plugins and run `update` on them.
   * Called each time state changes.
   *
   */


  Uppy.prototype.updateAll = function updateAll(state) {
    this.iteratePlugins(function (plugin) {
      plugin.update(state);
    });
  };

  /**
   * Updates state
   *
   * @param {patch} object
   */


  Uppy.prototype.setState = function setState(patch) {
    this.store.setState(patch);
  };

  /**
   * Returns current state.
   */


  Uppy.prototype.getState = function getState() {
    return this.store.getState();
  };

  /**
  * Back compat for when this.state is used instead of this.getState().
  */


  /**
  * Shorthand to set state for a specific file.
  */
  Uppy.prototype.setFileState = function setFileState(fileID, state) {
    var _extends2;

    this.setState({
      files: _extends({}, this.getState().files, (_extends2 = {}, _extends2[fileID] = _extends({}, this.getState().files[fileID], state), _extends2))
    });
  };

  Uppy.prototype.resetProgress = function resetProgress() {
    var defaultProgress = {
      percentage: 0,
      bytesUploaded: 0,
      uploadComplete: false,
      uploadStarted: false
    };
    var files = _extends({}, this.getState().files);
    var updatedFiles = {};
    Object.keys(files).forEach(function (fileID) {
      var updatedFile = _extends({}, files[fileID]);
      updatedFile.progress = _extends({}, updatedFile.progress, defaultProgress);
      updatedFiles[fileID] = updatedFile;
    });

    this.setState({
      files: updatedFiles,
      totalProgress: 0
    });

    // TODO Document on the website
    this.emit('reset-progress');
  };

  Uppy.prototype.addPreProcessor = function addPreProcessor(fn) {
    this.preProcessors.push(fn);
  };

  Uppy.prototype.removePreProcessor = function removePreProcessor(fn) {
    var i = this.preProcessors.indexOf(fn);
    if (i !== -1) {
      this.preProcessors.splice(i, 1);
    }
  };

  Uppy.prototype.addPostProcessor = function addPostProcessor(fn) {
    this.postProcessors.push(fn);
  };

  Uppy.prototype.removePostProcessor = function removePostProcessor(fn) {
    var i = this.postProcessors.indexOf(fn);
    if (i !== -1) {
      this.postProcessors.splice(i, 1);
    }
  };

  Uppy.prototype.addUploader = function addUploader(fn) {
    this.uploaders.push(fn);
  };

  Uppy.prototype.removeUploader = function removeUploader(fn) {
    var i = this.uploaders.indexOf(fn);
    if (i !== -1) {
      this.uploaders.splice(i, 1);
    }
  };

  Uppy.prototype.setMeta = function setMeta(data) {
    var updatedMeta = _extends({}, this.getState().meta, data);
    var updatedFiles = _extends({}, this.getState().files);

    Object.keys(updatedFiles).forEach(function (fileID) {
      updatedFiles[fileID] = _extends({}, updatedFiles[fileID], {
        meta: _extends({}, updatedFiles[fileID].meta, data)
      });
    });

    this.log('Adding metadata:');
    this.log(data);

    this.setState({
      meta: updatedMeta,
      files: updatedFiles
    });
  };

  Uppy.prototype.setFileMeta = function setFileMeta(fileID, data) {
    var updatedFiles = _extends({}, this.getState().files);
    if (!updatedFiles[fileID]) {
      this.log('Was trying to set metadata for a file that’s not with us anymore: ', fileID);
      return;
    }
    var newMeta = _extends({}, updatedFiles[fileID].meta, data);
    updatedFiles[fileID] = _extends({}, updatedFiles[fileID], {
      meta: newMeta
    });
    this.setState({ files: updatedFiles });
  };

  /**
   * Get a file object.
   *
   * @param {string} fileID The ID of the file object to return.
   */


  Uppy.prototype.getFile = function getFile(fileID) {
    return this.getState().files[fileID];
  };

  /**
  * Check if minNumberOfFiles restriction is reached before uploading.
  *
  * @return {boolean}
  * @private
  */


  Uppy.prototype._checkMinNumberOfFiles = function _checkMinNumberOfFiles() {
    var minNumberOfFiles = this.opts.restrictions.minNumberOfFiles;

    if (Object.keys(this.getState().files).length < minNumberOfFiles) {
      this.info('' + this.i18n('youHaveToAtLeastSelectX', { smart_count: minNumberOfFiles }), 'error', 5000);
      return false;
    }
    return true;
  };

  /**
  * Check if file passes a set of restrictions set in options: maxFileSize,
  * maxNumberOfFiles and allowedFileTypes.
  *
  * @param {object} file object to check
  * @return {boolean}
  * @private
  */


  Uppy.prototype._checkRestrictions = function _checkRestrictions(file) {
    var _opts$restrictions = this.opts.restrictions,
        maxFileSize = _opts$restrictions.maxFileSize,
        maxNumberOfFiles = _opts$restrictions.maxNumberOfFiles,
        allowedFileTypes = _opts$restrictions.allowedFileTypes;


    if (maxNumberOfFiles) {
      if (Object.keys(this.getState().files).length + 1 > maxNumberOfFiles) {
        this.info('' + this.i18n('youCanOnlyUploadX', { smart_count: maxNumberOfFiles }), 'error', 5000);
        return false;
      }
    }

    if (allowedFileTypes) {
      var isCorrectFileType = allowedFileTypes.filter(function (type) {
        if (!file.type) return false;
        return match(file.type, type);
      }).length > 0;

      if (!isCorrectFileType) {
        var allowedFileTypesString = allowedFileTypes.join(', ');
        this.info(this.i18n('youCanOnlyUploadFileTypes') + ' ' + allowedFileTypesString, 'error', 5000);
        return false;
      }
    }

    if (maxFileSize) {
      if (file.data.size > maxFileSize) {
        this.info(this.i18n('exceedsSize') + ' ' + prettyBytes(maxFileSize), 'error', 5000);
        return false;
      }
    }

    return true;
  };

  /**
  * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
  * try to guess file type in a clever way, check file against restrictions,
  * and start an upload if `autoProceed === true`.
  *
  * @param {object} file object to add
  */


  Uppy.prototype.addFile = function addFile(file) {
    var _this2 = this;

    // Wrap this in a Promise `.then()` handler so errors will reject the Promise
    // instead of throwing.
    var beforeFileAdded = Promise.resolve().then(function () {
      return _this2.opts.onBeforeFileAdded(file, _this2.getState().files);
    });

    return beforeFileAdded.catch(function (err) {
      var message = (typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object' ? err.message : err;
      _this2.info(message, 'error', 5000);
      return Promise.reject(new Error('onBeforeFileAdded: ' + message));
    }).then(function () {
      return Utils.getFileType(file).then(function (fileType) {
        var updatedFiles = _extends({}, _this2.getState().files);
        var fileName = void 0;
        if (file.name) {
          fileName = file.name;
        } else if (fileType.split('/')[0] === 'image') {
          fileName = fileType.split('/')[0] + '.' + fileType.split('/')[1];
        } else {
          fileName = 'noname';
        }
        var fileExtension = Utils.getFileNameAndExtension(fileName).extension;
        var isRemote = file.isRemote || false;

        var fileID = Utils.generateFileID(file);

        var newFile = {
          source: file.source || '',
          id: fileID,
          name: fileName,
          extension: fileExtension || '',
          meta: _extends({}, _this2.getState().meta, {
            name: fileName,
            type: fileType
          }),
          type: fileType,
          data: file.data,
          progress: {
            percentage: 0,
            bytesUploaded: 0,
            bytesTotal: file.data.size || 0,
            uploadComplete: false,
            uploadStarted: false
          },
          size: file.data.size || 'N/A',
          isRemote: isRemote,
          remote: file.remote || '',
          preview: file.preview
        };

        var isFileAllowed = _this2._checkRestrictions(newFile);
        if (!isFileAllowed) return Promise.reject(new Error('File not allowed'));

        updatedFiles[fileID] = newFile;
        _this2.setState({ files: updatedFiles });

        _this2.emit('file-added', newFile);
        _this2.log('Added file: ' + fileName + ', ' + fileID + ', mime type: ' + fileType);

        if (_this2.opts.autoProceed && !_this2.scheduledAutoProceed) {
          _this2.scheduledAutoProceed = setTimeout(function () {
            _this2.scheduledAutoProceed = null;
            _this2.upload().catch(function (err) {
              console.error(err.stack || err.message || err);
            });
          }, 4);
        }
      });
    });
  };

  Uppy.prototype.removeFile = function removeFile(fileID) {
    var _this3 = this;

    var _state = this.state,
        files = _state.files,
        currentUploads = _state.currentUploads;

    var updatedFiles = _extends({}, files);
    var removedFile = updatedFiles[fileID];
    delete updatedFiles[fileID];

    // Remove this file from its `currentUpload`.
    var updatedUploads = _extends({}, currentUploads);
    var removeUploads = [];
    Object.keys(updatedUploads).forEach(function (uploadID) {
      var newFileIDs = currentUploads[uploadID].fileIDs.filter(function (uploadFileID) {
        return uploadFileID !== fileID;
      });
      // Remove the upload if no files are associated with it anymore.
      if (newFileIDs.length === 0) {
        removeUploads.push(uploadID);
        return;
      }

      updatedUploads[uploadID] = _extends({}, currentUploads[uploadID], {
        fileIDs: newFileIDs
      });
    });

    this.setState({
      currentUploads: updatedUploads,
      files: updatedFiles
    });

    removeUploads.forEach(function (uploadID) {
      _this3._removeUpload(uploadID);
    });

    this._calculateTotalProgress();
    this.emit('file-removed', fileID);

    // Clean up object URLs.
    if (removedFile.preview && Utils.isObjectURL(removedFile.preview)) {
      URL.revokeObjectURL(removedFile.preview);
    }

    this.log('Removed file: ' + fileID);
  };

  /**
   * Generate a preview image for the given file, if possible.
   */


  Uppy.prototype.generatePreview = function generatePreview(file) {
    var _this4 = this;

    if (Utils.isPreviewSupported(file.type) && !file.isRemote) {
      var previewPromise = void 0;
      if (this.opts.thumbnailGeneration === true) {
        previewPromise = Utils.createThumbnail(file, 280);
      } else {
        previewPromise = Promise.resolve(URL.createObjectURL(file.data));
      }
      previewPromise.then(function (preview) {
        _this4.setPreviewURL(file.id, preview);
      }).catch(function (err) {
        console.warn(err.stack || err.message);
      });
    }
  };

  /**
   * Set the preview URL for a file.
   */


  Uppy.prototype.setPreviewURL = function setPreviewURL(fileID, preview) {
    this.setFileState(fileID, { preview: preview });
  };

  Uppy.prototype.pauseResume = function pauseResume(fileID) {
    var updatedFiles = _extends({}, this.getState().files);

    if (updatedFiles[fileID].uploadComplete) return;

    var wasPaused = updatedFiles[fileID].isPaused || false;
    var isPaused = !wasPaused;

    var updatedFile = _extends({}, updatedFiles[fileID], {
      isPaused: isPaused
    });

    updatedFiles[fileID] = updatedFile;
    this.setState({ files: updatedFiles });

    this.emit('upload-pause', fileID, isPaused);

    return isPaused;
  };

  Uppy.prototype.pauseAll = function pauseAll() {
    var updatedFiles = _extends({}, this.getState().files);
    var inProgressUpdatedFiles = Object.keys(updatedFiles).filter(function (file) {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });

    inProgressUpdatedFiles.forEach(function (file) {
      var updatedFile = _extends({}, updatedFiles[file], {
        isPaused: true
      });
      updatedFiles[file] = updatedFile;
    });
    this.setState({ files: updatedFiles });

    this.emit('pause-all');
  };

  Uppy.prototype.resumeAll = function resumeAll() {
    var updatedFiles = _extends({}, this.getState().files);
    var inProgressUpdatedFiles = Object.keys(updatedFiles).filter(function (file) {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });

    inProgressUpdatedFiles.forEach(function (file) {
      var updatedFile = _extends({}, updatedFiles[file], {
        isPaused: false,
        error: null
      });
      updatedFiles[file] = updatedFile;
    });
    this.setState({ files: updatedFiles });

    this.emit('resume-all');
  };

  Uppy.prototype.retryAll = function retryAll() {
    var updatedFiles = _extends({}, this.getState().files);
    var filesToRetry = Object.keys(updatedFiles).filter(function (file) {
      return updatedFiles[file].error;
    });

    filesToRetry.forEach(function (file) {
      var updatedFile = _extends({}, updatedFiles[file], {
        isPaused: false,
        error: null
      });
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      error: null
    });

    this.emit('retry-all', filesToRetry);

    var uploadID = this._createUpload(filesToRetry);
    return this._runUpload(uploadID);
  };

  Uppy.prototype.cancelAll = function cancelAll() {
    this.emit('cancel-all');
    this.setState({ files: {}, totalProgress: 0 });
  };

  Uppy.prototype.retryUpload = function retryUpload(fileID) {
    var updatedFiles = _extends({}, this.getState().files);
    var updatedFile = _extends({}, updatedFiles[fileID], { error: null, isPaused: false });
    updatedFiles[fileID] = updatedFile;
    this.setState({
      files: updatedFiles
    });

    this.emit('upload-retry', fileID);

    var uploadID = this._createUpload([fileID]);
    return this._runUpload(uploadID);
  };

  Uppy.prototype.reset = function reset() {
    this.cancelAll();
  };

  Uppy.prototype._calculateProgress = function _calculateProgress(data) {
    var fileID = data.id;

    // skip progress event for a file that’s been removed
    if (!this.getState().files[fileID]) {
      this.log('Trying to set progress for a file that’s been removed: ', fileID);
      return;
    }

    this.setFileState(fileID, {
      progress: _extends({}, this.getState().files[fileID].progress, {
        bytesUploaded: data.bytesUploaded,
        bytesTotal: data.bytesTotal,
        percentage: Math.floor((data.bytesUploaded / data.bytesTotal * 100).toFixed(2))
      })
    });

    this._calculateTotalProgress();
  };

  Uppy.prototype._calculateTotalProgress = function _calculateTotalProgress() {
    // calculate total progress, using the number of files currently uploading,
    // multiplied by 100 and the summ of individual progress of each file
    var files = _extends({}, this.getState().files);

    var inProgress = Object.keys(files).filter(function (file) {
      return files[file].progress.uploadStarted;
    });
    var progressMax = inProgress.length * 100;
    var progressAll = 0;
    inProgress.forEach(function (file) {
      progressAll = progressAll + files[file].progress.percentage;
    });

    var totalProgress = progressMax === 0 ? 0 : Math.floor((progressAll * 100 / progressMax).toFixed(2));

    this.setState({
      totalProgress: totalProgress
    });
  };

  /**
   * Registers listeners for all global actions, like:
   * `error`, `file-added`, `file-removed`, `upload-progress`
   *
   */


  Uppy.prototype.actions = function actions() {
    var _this5 = this;

    // const log = this.log
    // this.on('*', function (payload) {
    //   log(`[Core] Event: ${this.event}`)
    //   log(payload)
    // })

    // stress-test re-rendering
    // setInterval(() => {
    //   this.setState({bla: 'bla'})
    // }, 20)

    this.on('error', function (error) {
      _this5.setState({ error: error.message });
    });

    this.on('upload-error', function (fileID, error) {
      _this5.setFileState(fileID, { error: error.message });
      _this5.setState({ error: error.message });

      var fileName = _this5.getState().files[fileID].name;
      var message = 'Failed to upload ' + fileName;
      if ((typeof error === 'undefined' ? 'undefined' : _typeof(error)) === 'object' && error.message) {
        message = { message: message, details: error.message };
      }
      _this5.info(message, 'error', 5000);
    });

    this.on('upload', function () {
      _this5.setState({ error: null });
    });

    // this.on('file-add', (data) => {
    //   this.addFile(data)
    // })

    this.on('file-added', function (file) {
      _this5.generatePreview(file);
    });

    this.on('file-remove', function (fileID) {
      _this5.removeFile(fileID);
    });

    this.on('upload-started', function (fileID, upload) {
      _this5.setFileState(fileID, {
        progress: _extends({}, _this5.getState().files[fileID].progress, {
          uploadStarted: Date.now(),
          uploadComplete: false,
          percentage: 0,
          bytesUploaded: 0
        })
      });
    });

    // upload progress events can occur frequently, especially when you have a good
    // connection to the remote server. Therefore, we are throtteling them to
    // prevent accessive function calls.
    // see also: https://github.com/tus/tus-js-client/commit/9940f27b2361fd7e10ba58b09b60d82422183bbb
    var _throttledCalculateProgress = throttle(this._calculateProgress, 100, { leading: true, trailing: false });

    this.on('upload-progress', _throttledCalculateProgress);

    this.on('upload-success', function (fileID, uploadResp, uploadURL) {
      _this5.setFileState(fileID, {
        progress: _extends({}, _this5.getState().files[fileID].progress, {
          uploadComplete: true,
          percentage: 100
        }),
        uploadURL: uploadURL,
        isPaused: false
      });

      _this5._calculateTotalProgress();
    });

    this.on('preprocess-progress', function (fileID, progress) {
      _this5.setFileState(fileID, {
        progress: _extends({}, _this5.getState().files[fileID].progress, {
          preprocess: progress
        })
      });
    });

    this.on('preprocess-complete', function (fileID) {
      var files = _extends({}, _this5.getState().files);
      files[fileID] = _extends({}, files[fileID], {
        progress: _extends({}, files[fileID].progress)
      });
      delete files[fileID].progress.preprocess;

      _this5.setState({ files: files });
    });

    this.on('postprocess-progress', function (fileID, progress) {
      _this5.setFileState(fileID, {
        progress: _extends({}, _this5.getState().files[fileID].progress, {
          postprocess: progress
        })
      });
    });

    this.on('postprocess-complete', function (fileID) {
      var files = _extends({}, _this5.getState().files);
      files[fileID] = _extends({}, files[fileID], {
        progress: _extends({}, files[fileID].progress)
      });
      delete files[fileID].progress.postprocess;
      // TODO should we set some kind of `fullyComplete` property on the file object
      // so it's easier to see that the file is upload…fully complete…rather than
      // what we have to do now (`uploadComplete && !postprocess`)

      _this5.setState({ files: files });
    });

    this.on('restored', function () {
      // Files may have changed--ensure progress is still accurate.
      _this5._calculateTotalProgress();
    });

    // show informer if offline
    if (typeof window !== 'undefined') {
      window.addEventListener('online', function () {
        return _this5.updateOnlineStatus();
      });
      window.addEventListener('offline', function () {
        return _this5.updateOnlineStatus();
      });
      setTimeout(function () {
        return _this5.updateOnlineStatus();
      }, 3000);
    }
  };

  Uppy.prototype.updateOnlineStatus = function updateOnlineStatus() {
    var online = typeof window.navigator.onLine !== 'undefined' ? window.navigator.onLine : true;
    if (!online) {
      this.emit('is-offline');
      this.info('No internet connection', 'error', 0);
      this.wasOffline = true;
    } else {
      this.emit('is-online');
      if (this.wasOffline) {
        this.emit('back-online');
        this.info('Connected!', 'success', 3000);
        this.wasOffline = false;
      }
    }
  };

  Uppy.prototype.getID = function getID() {
    return this.opts.id;
  };

  /**
   * Registers a plugin with Core.
   *
   * @param {Class} Plugin object
   * @param {Object} options object that will be passed to Plugin later
   * @return {Object} self for chaining
   */


  Uppy.prototype.use = function use(Plugin, opts) {
    if (typeof Plugin !== 'function') {
      var msg = 'Expected a plugin class, but got ' + (Plugin === null ? 'null' : typeof Plugin === 'undefined' ? 'undefined' : _typeof(Plugin)) + '.' + ' Please verify that the plugin was imported and spelled correctly.';
      throw new TypeError(msg);
    }

    // Instantiate
    var plugin = new Plugin(this, opts);
    var pluginId = plugin.id;
    this.plugins[plugin.type] = this.plugins[plugin.type] || [];

    if (!pluginId) {
      throw new Error('Your plugin must have an id');
    }

    if (!plugin.type) {
      throw new Error('Your plugin must have a type');
    }

    var existsPluginAlready = this.getPlugin(pluginId);
    if (existsPluginAlready) {
      var _msg = 'Already found a plugin named \'' + existsPluginAlready.id + '\'.\n        Tried to use: \'' + pluginId + '\'.\n        Uppy is currently limited to running one of every plugin.\n        Share your use case with us over at\n        https://github.com/transloadit/uppy/issues/\n        if you want us to reconsider.';
      throw new Error(_msg);
    }

    this.plugins[plugin.type].push(plugin);
    plugin.install();

    return this;
  };

  /**
   * Find one Plugin by name.
   *
   * @param string name description
   */


  Uppy.prototype.getPlugin = function getPlugin(name) {
    var foundPlugin = false;
    this.iteratePlugins(function (plugin) {
      var pluginName = plugin.id;
      if (pluginName === name) {
        foundPlugin = plugin;
        return false;
      }
    });
    return foundPlugin;
  };

  /**
   * Iterate through all `use`d plugins.
   *
   * @param function method description
   */


  Uppy.prototype.iteratePlugins = function iteratePlugins(method) {
    var _this6 = this;

    Object.keys(this.plugins).forEach(function (pluginType) {
      _this6.plugins[pluginType].forEach(method);
    });
  };

  /**
   * Uninstall and remove a plugin.
   *
   * @param {Plugin} instance The plugin instance to remove.
   */


  Uppy.prototype.removePlugin = function removePlugin(instance) {
    var list = this.plugins[instance.type];

    if (instance.uninstall) {
      instance.uninstall();
    }

    var index = list.indexOf(instance);
    if (index !== -1) {
      list.splice(index, 1);
    }
  };

  /**
   * Uninstall all plugins and close down this Uppy instance.
   */


  Uppy.prototype.close = function close() {
    this.reset();

    this._storeUnsubscribe();

    this.iteratePlugins(function (plugin) {
      plugin.uninstall();
    });
  };

  /**
  * Set info message in `state.info`, so that UI plugins like `Informer`
  * can display the message.
  *
  * @param {string} msg Message to be displayed by the informer
  */

  Uppy.prototype.info = function info(message) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;

    var isComplexMessage = (typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object';

    this.setState({
      info: {
        isHidden: false,
        type: type,
        message: isComplexMessage ? message.message : message,
        details: isComplexMessage ? message.details : null
      }
    });

    this.emit('info-visible');

    window.clearTimeout(this.infoTimeoutID);
    if (duration === 0) {
      this.infoTimeoutID = undefined;
      return;
    }

    // hide the informer after `duration` milliseconds
    this.infoTimeoutID = setTimeout(this.hideInfo, duration);
  };

  Uppy.prototype.hideInfo = function hideInfo() {
    var newInfo = _extends({}, this.getState().info, {
      isHidden: true
    });
    this.setState({
      info: newInfo
    });
    this.emit('info-hidden');
  };

  /**
   * Logs stuff to console, only if `debug` is set to true. Silent in production.
   *
   * @param {String|Object} msg to log
   * @param {String} type optional `error` or `warning`
   */


  Uppy.prototype.log = function log(msg, type) {
    if (!this.opts.debug) {
      return;
    }

    var message = '[Uppy] [' + Utils.getTimeStamp() + '] ' + msg;

    global.uppyLog = global.uppyLog + '\n' + 'DEBUG LOG: ' + msg;

    if (type === 'error') {
      console.error(message);
      return;
    }

    if (type === 'warning') {
      console.warn(message);
      return;
    }

    if (msg === '' + msg) {
      console.log(message);
    } else {
      message = '[Uppy] [' + Utils.getTimeStamp() + ']';
      console.log(message);
      console.dir(msg);
    }
  };

  /**
   * Initializes actions.
   *
   */


  Uppy.prototype.run = function run() {
    this.log('Core is run, initializing actions...');
    this.actions();

    return this;
  };

  /**
   * Restore an upload by its ID.
   */


  Uppy.prototype.restore = function restore(uploadID) {
    this.log('Core: attempting to restore upload "' + uploadID + '"');

    if (!this.getState().currentUploads[uploadID]) {
      this._removeUpload(uploadID);
      return Promise.reject(new Error('Nonexistent upload'));
    }

    return this._runUpload(uploadID);
  };

  /**
   * Create an upload for a bunch of files.
   *
   * @param {Array<string>} fileIDs File IDs to include in this upload.
   * @return {string} ID of this upload.
   */


  Uppy.prototype._createUpload = function _createUpload(fileIDs) {
    var _extends3;

    var uploadID = cuid();

    this.emit('upload', {
      id: uploadID,
      fileIDs: fileIDs
    });

    this.setState({
      currentUploads: _extends({}, this.getState().currentUploads, (_extends3 = {}, _extends3[uploadID] = {
        fileIDs: fileIDs,
        step: 0
      }, _extends3))
    });

    return uploadID;
  };

  /**
   * Remove an upload, eg. if it has been canceled or completed.
   *
   * @param {string} uploadID The ID of the upload.
   */


  Uppy.prototype._removeUpload = function _removeUpload(uploadID) {
    var currentUploads = _extends({}, this.getState().currentUploads);
    delete currentUploads[uploadID];

    this.setState({
      currentUploads: currentUploads
    });
  };

  /**
   * Run an upload. This picks up where it left off in case the upload is being restored.
   *
   * @private
   */


  Uppy.prototype._runUpload = function _runUpload(uploadID) {
    var _this7 = this;

    var uploadData = this.getState().currentUploads[uploadID];
    var fileIDs = uploadData.fileIDs;
    var restoreStep = uploadData.step;

    var steps = [].concat(this.preProcessors, this.uploaders, this.postProcessors);
    var lastStep = Promise.resolve();
    steps.forEach(function (fn, step) {
      // Skip this step if we are restoring and have already completed this step before.
      if (step < restoreStep) {
        return;
      }

      lastStep = lastStep.then(function () {
        var _extends4;

        var _getState = _this7.getState(),
            currentUploads = _getState.currentUploads;

        var currentUpload = _extends({}, currentUploads[uploadID], {
          step: step
        });
        _this7.setState({
          currentUploads: _extends({}, currentUploads, (_extends4 = {}, _extends4[uploadID] = currentUpload, _extends4))
        });
        // TODO give this the `currentUpload` object as its only parameter maybe?
        // Otherwise when more metadata may be added to the upload this would keep getting more parameters
        return fn(fileIDs, uploadID);
      });
    });

    // Not returning the `catch`ed promise, because we still want to return a rejected
    // promise from this method if the upload failed.
    lastStep.catch(function (err) {
      _this7.emit('error', err);

      _this7._removeUpload(uploadID);
    });

    return lastStep.then(function () {
      var files = fileIDs.map(function (fileID) {
        return _this7.getFile(fileID);
      });
      var successful = files.filter(function (file) {
        return file && !file.error;
      });
      var failed = files.filter(function (file) {
        return file && file.error;
      });
      _this7.emit('complete', { successful: successful, failed: failed });

      // Compatibility with pre-0.21
      _this7.emit('success', fileIDs);

      _this7._removeUpload(uploadID);

      return { successful: successful, failed: failed };
    });
  };

  /**
  * Start an upload for all the files that are not currently being uploaded.
  *
  * @return {Promise}
  */


  Uppy.prototype.upload = function upload() {
    var _this8 = this;

    if (!this.plugins.uploader) {
      this.log('No uploader type plugins are used', 'warning');
    }

    var isMinNumberOfFilesReached = this._checkMinNumberOfFiles();
    if (!isMinNumberOfFilesReached) {
      return Promise.reject(new Error('Minimum number of files has not been reached'));
    }

    var beforeUpload = Promise.resolve().then(function () {
      return _this8.opts.onBeforeUpload(_this8.getState().files);
    });

    return beforeUpload.catch(function (err) {
      var message = (typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object' ? err.message : err;
      _this8.info(message, 'error', 5000);
      return Promise.reject(new Error('onBeforeUpload: ' + message));
    }).then(function () {
      var waitingFileIDs = [];
      Object.keys(_this8.getState().files).forEach(function (fileID) {
        var file = _this8.getFile(fileID);

        if (!file.progress.uploadStarted) {
          waitingFileIDs.push(file.id);
        }
      });

      var uploadID = _this8._createUpload(waitingFileIDs);
      return _this8._runUpload(uploadID);
    });
  };

  _createClass(Uppy, [{
    key: 'state',
    get: function get() {
      return this.getState();
    }
  }]);

  return Uppy;
}();

module.exports = function (opts) {
  return new Uppy(opts);
};
// Expose class constructor.
module.exports.Uppy = Uppy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../core/Translator":11,"../core/Utils":13,"../store/DefaultStore":17,"cuid":1,"lodash.throttle":3,"mime-match":4,"namespace-emitter":5,"prettier-bytes":7}],10:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var preact = require('preact');

var _require = require('../core/Utils'),
    findDOMElement = _require.findDOMElement;

/**
 * Boilerplate that all Plugins share - and should not be used
 * directly. It also shows which methods final plugins should implement/override,
 * this deciding on structure.
 *
 * @param {object} main Uppy core object
 * @param {object} object with plugin options
 * @return {array | string} files or success/fail message
 */


module.exports = function () {
  function Plugin(uppy, opts) {
    _classCallCheck(this, Plugin);

    this.uppy = uppy;
    this.opts = opts || {};

    this.update = this.update.bind(this);
    this.mount = this.mount.bind(this);
    this.install = this.install.bind(this);
    this.uninstall = this.uninstall.bind(this);
  }

  Plugin.prototype.getPluginState = function getPluginState() {
    return this.uppy.state.plugins[this.id];
  };

  Plugin.prototype.setPluginState = function setPluginState(update) {
    var plugins = _extends({}, this.uppy.state.plugins);
    plugins[this.id] = _extends({}, plugins[this.id], update);

    this.uppy.setState({
      plugins: plugins
    });
  };

  Plugin.prototype.update = function update(state) {
    if (typeof this.el === 'undefined') {
      return;
    }

    if (this.updateUI) {
      this.updateUI(state);
    }
  };

  /**
   * Check if supplied `target` is a DOM element or an `object`.
   * If it’s an object — target is a plugin, and we search `plugins`
   * for a plugin with same name and return its target.
   *
   * @param {String|Object} target
   *
   */


  Plugin.prototype.mount = function mount(target, plugin) {
    var _this = this;

    var callerPluginName = plugin.id;

    var targetElement = findDOMElement(target);

    if (targetElement) {
      this.updateUI = function (state) {
        _this.el = preact.render(_this.render(state), targetElement, _this.el);
      };

      this.uppy.log('Installing ' + callerPluginName + ' to a DOM element');

      // clear everything inside the target container
      if (this.opts.replaceTargetContent) {
        targetElement.innerHTML = '';
      }

      this.el = preact.render(this.render(this.uppy.state), targetElement);

      return this.el;
    }

    var targetPlugin = void 0;
    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target instanceof Plugin) {
      // Targeting a plugin *instance*
      targetPlugin = target;
    } else if (typeof target === 'function') {
      // Targeting a plugin type
      var Target = target;
      // Find the target plugin instance.
      this.uppy.iteratePlugins(function (plugin) {
        if (plugin instanceof Target) {
          targetPlugin = plugin;
          return false;
        }
      });
    }

    if (targetPlugin) {
      var targetPluginName = targetPlugin.id;
      this.uppy.log('Installing ' + callerPluginName + ' to ' + targetPluginName);
      this.el = targetPlugin.addTarget(plugin);
      return this.el;
    }

    this.uppy.log('Not installing ' + callerPluginName);
    throw new Error('Invalid target option given to ' + callerPluginName);
  };

  Plugin.prototype.render = function render(state) {
    throw new Error('Extend the render method to add your plugin to a DOM element');
  };

  Plugin.prototype.addTarget = function addTarget(plugin) {
    throw new Error('Extend the addTarget method to add your plugin to another plugin\'s target');
  };

  Plugin.prototype.unmount = function unmount() {
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
    // this.target = null
  };

  Plugin.prototype.install = function install() {};

  Plugin.prototype.uninstall = function uninstall() {
    this.unmount();
  };

  return Plugin;
}();

},{"../core/Utils":13,"preact":6}],11:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 *
 * @param {object} opts
 */
module.exports = function () {
  function Translator(opts) {
    _classCallCheck(this, Translator);

    var defaultOptions = {
      locale: {
        strings: {},
        pluralize: function pluralize(n) {
          if (n === 1) {
            return 0;
          }
          return 1;
        }
      }
    };

    this.opts = _extends({}, defaultOptions, opts);
    this.locale = _extends({}, defaultOptions.locale, opts.locale);

    // console.log(this.opts.locale)

    // this.locale.pluralize = this.locale ? this.locale.pluralize : defaultPluralize
    // this.locale.strings = Object.assign({}, en_US.strings, this.opts.locale.strings)
  }

  /**
   * Takes a string with placeholder variables like `%{smart_count} file selected`
   * and replaces it with values from options `{smart_count: 5}`
   *
   * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
   * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
   *
   * @param {string} phrase that needs interpolation, with placeholders
   * @param {object} options with values that will be used to replace placeholders
   * @return {string} interpolated
   */


  Translator.prototype.interpolate = function interpolate(phrase, options) {
    var replace = String.prototype.replace;
    var dollarRegex = /\$/g;
    var dollarBillsYall = '$$$$';

    for (var arg in options) {
      if (arg !== '_' && options.hasOwnProperty(arg)) {
        // Ensure replacement value is escaped to prevent special $-prefixed
        // regex replace tokens. the "$$$$" is needed because each "$" needs to
        // be escaped with "$" itself, and we need two in the resulting output.
        var replacement = options[arg];
        if (typeof replacement === 'string') {
          replacement = replace.call(options[arg], dollarRegex, dollarBillsYall);
        }
        // We create a new `RegExp` each time instead of using a more-efficient
        // string replace so that the same argument can be replaced multiple times
        // in the same phrase.
        phrase = replace.call(phrase, new RegExp('%\\{' + arg + '\\}', 'g'), replacement);
      }
    }
    return phrase;
  };

  /**
   * Public translate method
   *
   * @param {string} key
   * @param {object} options with values that will be used later to replace placeholders in string
   * @return {string} translated (and interpolated)
   */


  Translator.prototype.translate = function translate(key, options) {
    if (options && options.smart_count) {
      var plural = this.locale.pluralize(options.smart_count);
      return this.interpolate(this.opts.locale.strings[key][plural], options);
    }

    return this.interpolate(this.opts.locale.strings[key], options);
  };

  return Translator;
}();

},{}],12:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ee = require('namespace-emitter');

module.exports = function () {
  function UppySocket(opts) {
    var _this = this;

    _classCallCheck(this, UppySocket);

    this.queued = [];
    this.isOpen = false;
    this.socket = new WebSocket(opts.target);
    this.emitter = ee();

    this.socket.onopen = function (e) {
      _this.isOpen = true;

      while (_this.queued.length > 0 && _this.isOpen) {
        var first = _this.queued[0];
        _this.send(first.action, first.payload);
        _this.queued = _this.queued.slice(1);
      }
    };

    this.socket.onclose = function (e) {
      _this.isOpen = false;
    };

    this._handleMessage = this._handleMessage.bind(this);

    this.socket.onmessage = this._handleMessage;

    this.close = this.close.bind(this);
    this.emit = this.emit.bind(this);
    this.on = this.on.bind(this);
    this.once = this.once.bind(this);
    this.send = this.send.bind(this);
  }

  UppySocket.prototype.close = function close() {
    return this.socket.close();
  };

  UppySocket.prototype.send = function send(action, payload) {
    // attach uuid

    if (!this.isOpen) {
      this.queued.push({ action: action, payload: payload });
      return;
    }

    this.socket.send(JSON.stringify({
      action: action,
      payload: payload
    }));
  };

  UppySocket.prototype.on = function on(action, handler) {
    console.log(action);
    this.emitter.on(action, handler);
  };

  UppySocket.prototype.emit = function emit(action, payload) {
    console.log(action);
    this.emitter.emit(action, payload);
  };

  UppySocket.prototype.once = function once(action, handler) {
    this.emitter.once(action, handler);
  };

  UppySocket.prototype._handleMessage = function _handleMessage(e) {
    try {
      var message = JSON.parse(e.data);
      console.log(message);
      this.emit(message.action, message.payload);
    } catch (err) {
      console.log(err);
    }
  };

  return UppySocket;
}();

},{"namespace-emitter":5}],13:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Promise = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

var throttle = require('lodash.throttle');
// we inline file-type module, as opposed to using the NPM version,
// because of this https://github.com/sindresorhus/file-type/issues/78
// and https://github.com/sindresorhus/copy-text-to-clipboard/issues/5
var fileType = require('../vendor/file-type');

/**
 * A collection of small utility functions that help with dom manipulation, adding listeners,
 * promises and other good things.
 *
 * @module Utils
 */

function isTouchDevice() {
  return 'ontouchstart' in window || // works on most browsers
  navigator.maxTouchPoints; // works on IE10/11 and Surface
}

function truncateString(str, length) {
  if (str.length > length) {
    return str.substr(0, length / 2) + '...' + str.substr(str.length - length / 4, str.length);
  }
  return str;

  // more precise version if needed
  // http://stackoverflow.com/a/831583
}

function secondsToTime(rawSeconds) {
  var hours = Math.floor(rawSeconds / 3600) % 24;
  var minutes = Math.floor(rawSeconds / 60) % 60;
  var seconds = Math.floor(rawSeconds % 60);

  return { hours: hours, minutes: minutes, seconds: seconds };
}

/**
 * Converts list into array
*/
function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}

/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
*/
function getTimeStamp() {
  var date = new Date();
  var hours = pad(date.getHours().toString());
  var minutes = pad(date.getMinutes().toString());
  var seconds = pad(date.getSeconds().toString());
  return hours + ':' + minutes + ':' + seconds;
}

/**
 * Adds zero to strings shorter than two characters
*/
function pad(str) {
  return str.length !== 2 ? 0 + str : str;
}

/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 *
 * @param {Object} file
 * @return {String} the fileID
 *
 */
function generateFileID(file) {
  // filter is needed to not join empty values with `-`
  return ['uppy', file.name ? file.name.toLowerCase().replace(/[^A-Z0-9]/ig, '') : '', file.type, file.data.size, file.data.lastModified].filter(function (val) {
    return val;
  }).join('-');
}

/**
 * Runs an array of promise-returning functions in sequence.
 */
function runPromiseSequence(functions) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var promise = Promise.resolve();
  functions.forEach(function (func) {
    promise = promise.then(function () {
      return func.apply(undefined, args);
    });
  });
  return promise;
}

function isPreviewSupported(fileType) {
  if (!fileType) return false;
  var fileTypeSpecific = fileType.split('/')[1];
  // list of images that browsers can preview
  if (/^(jpeg|gif|png|svg|svg\+xml|bmp)$/.test(fileTypeSpecific)) {
    return true;
  }
  return false;
}

function getArrayBuffer(chunk) {
  return new _Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.addEventListener('load', function (e) {
      // e.target.result is an ArrayBuffer
      resolve(e.target.result);
    });
    reader.addEventListener('error', function (err) {
      console.error('FileReader error' + err);
      reject(err);
    });
    // file-type only needs the first 4100 bytes
    reader.readAsArrayBuffer(chunk);
  });
}

function getFileType(file) {
  var extensionsToMime = {
    'md': 'text/markdown',
    'markdown': 'text/markdown',
    'mp4': 'video/mp4',
    'mp3': 'audio/mp3',
    'svg': 'image/svg+xml',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif'
  };

  var fileExtension = file.name ? getFileNameAndExtension(file.name).extension : null;

  if (file.isRemote) {
    // some remote providers do not support file types
    var mime = file.type ? file.type : extensionsToMime[fileExtension];
    return Promise.resolve(mime);
  }

  // 1. try to determine file type from magic bytes with file-type module
  // this should be the most trustworthy way
  var chunk = file.data.slice(0, 4100);
  return getArrayBuffer(chunk).then(function (buffer) {
    var type = fileType(buffer);
    if (type && type.mime) {
      return type.mime;
    }

    // 2. if that’s no good, check if mime type is set in the file object
    if (file.type) {
      return file.type;
    }

    // 3. if that’s no good, see if we can map extension to a mime type
    if (fileExtension && extensionsToMime[fileExtension]) {
      return extensionsToMime[fileExtension];
    }

    // if all fails, well, return empty
    return null;
  }).catch(function () {
    return null;
  });
}

// TODO Check which types are actually supported in browsers. Chrome likes webm
// from my testing, but we may need more.
// We could use a library but they tend to contain dozens of KBs of mappings,
// most of which will go unused, so not sure if that's worth it.
var mimeToExtensions = {
  'video/ogg': 'ogv',
  'audio/ogg': 'ogg',
  'video/webm': 'webm',
  'audio/webm': 'webm',
  'video/mp4': 'mp4',
  'audio/mp3': 'mp3'
};

function getFileTypeExtension(mimeType) {
  return mimeToExtensions[mimeType] || null;
}

/**
* Takes a full filename string and returns an object {name, extension}
*
* @param {string} fullFileName
* @return {object} {name, extension}
*/
function getFileNameAndExtension(fullFileName) {
  var re = /(?:\.([^.]+))?$/;
  var fileExt = re.exec(fullFileName)[1];
  var fileName = fullFileName.replace('.' + fileExt, '');
  return {
    name: fileName,
    extension: fileExt
  };
}

/**
 * Check if a URL string is an object URL from `URL.createObjectURL`.
 *
 * @param {string} url
 * @return {boolean}
 */
function isObjectURL(url) {
  return url.indexOf('blob:') === 0;
}

function getProportionalHeight(img, width) {
  var aspect = img.width / img.height;
  return Math.round(width / aspect);
}

/**
 * Create a thumbnail for the given Uppy file object.
 *
 * @param {{data: Blob}} file
 * @param {number} width
 * @return {Promise}
 */
function createThumbnail(file, targetWidth) {
  var originalUrl = URL.createObjectURL(file.data);
  var onload = new _Promise(function (resolve, reject) {
    var image = new Image();
    image.src = originalUrl;
    image.onload = function () {
      URL.revokeObjectURL(originalUrl);
      resolve(image);
    };
    image.onerror = function () {
      // The onerror event is totally useless unfortunately, as far as I know
      URL.revokeObjectURL(originalUrl);
      reject(new Error('Could not create thumbnail'));
    };
  });

  return onload.then(function (image) {
    var targetHeight = getProportionalHeight(image, targetWidth);
    var canvas = resizeImage(image, targetWidth, targetHeight);
    return canvasToBlob(canvas, 'image/png');
  }).then(function (blob) {
    return URL.createObjectURL(blob);
  });
}

/**
 * Resize an image to the target `width` and `height`.
 *
 * Returns a Canvas with the resized image on it.
 */
function resizeImage(image, targetWidth, targetHeight) {
  var sourceWidth = image.width;
  var sourceHeight = image.height;

  if (targetHeight < image.height / 2) {
    var steps = Math.floor(Math.log(image.width / targetWidth) / Math.log(2));
    var stepScaled = downScaleInSteps(image, steps);
    image = stepScaled.image;
    sourceWidth = stepScaled.sourceWidth;
    sourceHeight = stepScaled.sourceHeight;
  }

  var canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  var context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

  return canvas;
}

/**
 * Downscale an image by 50% `steps` times.
 */
function downScaleInSteps(image, steps) {
  var source = image;
  var currentWidth = source.width;
  var currentHeight = source.height;

  for (var i = 0; i < steps; i += 1) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = currentWidth / 2;
    canvas.height = currentHeight / 2;
    context.drawImage(source,
    // The entire source image. We pass width and height here,
    // because we reuse this canvas, and should only scale down
    // the part of the canvas that contains the previous scale step.
    0, 0, currentWidth, currentHeight,
    // Draw to 50% size
    0, 0, currentWidth / 2, currentHeight / 2);
    currentWidth /= 2;
    currentHeight /= 2;
    source = canvas;
  }

  return {
    image: source,
    sourceWidth: currentWidth,
    sourceHeight: currentHeight
  };
}

/**
 * Save a <canvas> element's content to a Blob object.
 *
 * @param {HTMLCanvasElement} canvas
 * @return {Promise}
 */
function canvasToBlob(canvas, type, quality) {
  if (canvas.toBlob) {
    return new _Promise(function (resolve) {
      canvas.toBlob(resolve, type, quality);
    });
  }
  return Promise.resolve().then(function () {
    return dataURItoBlob(canvas.toDataURL(type, quality), {});
  });
}

function dataURItoBlob(dataURI, opts, toFile) {
  // get the base64 data
  var data = dataURI.split(',')[1];

  // user may provide mime type, if not get it from data URI
  var mimeType = opts.mimeType || dataURI.split(',')[0].split(':')[1].split(';')[0];

  // default to plain/text if data URI has no mimeType
  if (mimeType == null) {
    mimeType = 'plain/text';
  }

  var binary = atob(data);
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }

  // Convert to a File?
  if (toFile) {
    return new File([new Uint8Array(array)], opts.name || '', { type: mimeType });
  }

  return new Blob([new Uint8Array(array)], { type: mimeType });
}

function dataURItoFile(dataURI, opts) {
  return dataURItoBlob(dataURI, opts, true);
}

/**
 * Copies text to clipboard by creating an almost invisible textarea,
 * adding text there, then running execCommand('copy').
 * Falls back to prompt() when the easy way fails (hello, Safari!)
 * From http://stackoverflow.com/a/30810322
 *
 * @param {String} textToCopy
 * @param {String} fallbackString
 * @return {Promise}
 */
function copyToClipboard(textToCopy, fallbackString) {
  fallbackString = fallbackString || 'Copy the URL below';

  return new _Promise(function (resolve) {
    var textArea = document.createElement('textarea');
    textArea.setAttribute('style', {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '2em',
      height: '2em',
      padding: 0,
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      background: 'transparent'
    });

    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();

    var magicCopyFailed = function magicCopyFailed() {
      document.body.removeChild(textArea);
      window.prompt(fallbackString, textToCopy);
      resolve();
    };

    try {
      var successful = document.execCommand('copy');
      if (!successful) {
        return magicCopyFailed('copy command unavailable');
      }
      document.body.removeChild(textArea);
      return resolve();
    } catch (err) {
      document.body.removeChild(textArea);
      return magicCopyFailed(err);
    }
  });
}

function getSpeed(fileProgress) {
  if (!fileProgress.bytesUploaded) return 0;

  var timeElapsed = new Date() - fileProgress.uploadStarted;
  var uploadSpeed = fileProgress.bytesUploaded / (timeElapsed / 1000);
  return uploadSpeed;
}

function getBytesRemaining(fileProgress) {
  return fileProgress.bytesTotal - fileProgress.bytesUploaded;
}

function getETA(fileProgress) {
  if (!fileProgress.bytesUploaded) return 0;

  var uploadSpeed = getSpeed(fileProgress);
  var bytesRemaining = getBytesRemaining(fileProgress);
  var secondsRemaining = Math.round(bytesRemaining / uploadSpeed * 10) / 10;

  return secondsRemaining;
}

function prettyETA(seconds) {
  var time = secondsToTime(seconds);

  // Only display hours and minutes if they are greater than 0 but always
  // display minutes if hours is being displayed
  // Display a leading zero if the there is a preceding unit: 1m 05s, but 5s
  var hoursStr = time.hours ? time.hours + 'h ' : '';
  var minutesVal = time.hours ? ('0' + time.minutes).substr(-2) : time.minutes;
  var minutesStr = minutesVal ? minutesVal + 'm ' : '';
  var secondsVal = minutesVal ? ('0' + time.seconds).substr(-2) : time.seconds;
  var secondsStr = secondsVal + 's';

  return '' + hoursStr + minutesStr + secondsStr;
}

/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 *
 * @param {*} obj
 */
function isDOMElement(obj) {
  return obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.nodeType === Node.ELEMENT_NODE;
}

/**
 * Find a DOM element.
 *
 * @param {Node|string} element
 * @return {Node|null}
 */
function findDOMElement(element) {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }

  if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && isDOMElement(element)) {
    return element;
  }
}

/**
 * Find one or more DOM elements.
 *
 * @param {string} element
 * @return {Array|null}
 */
function findAllDOMElements(element) {
  if (typeof element === 'string') {
    var elements = [].slice.call(document.querySelectorAll(element));
    return elements.length > 0 ? elements : null;
  }

  if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && isDOMElement(element)) {
    return [element];
  }
}

function getSocketHost(url) {
  // get the host domain
  var regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/;
  var host = regex.exec(url)[1];
  var socketProtocol = location.protocol === 'https:' ? 'wss' : 'ws';

  return socketProtocol + '://' + host;
}

function _emitSocketProgress(uploader, progressData, file) {
  var progress = progressData.progress,
      bytesUploaded = progressData.bytesUploaded,
      bytesTotal = progressData.bytesTotal;

  if (progress) {
    uploader.uppy.log('Upload progress: ' + progress);
    uploader.uppy.emit('upload-progress', {
      uploader: uploader,
      id: file.id,
      bytesUploaded: bytesUploaded,
      bytesTotal: bytesTotal
    });
  }
}

var emitSocketProgress = throttle(_emitSocketProgress, 300, { leading: true, trailing: true });

function settle(promises) {
  var resolutions = [];
  var rejections = [];
  function resolved(value) {
    resolutions.push(value);
  }
  function rejected(error) {
    rejections.push(error);
  }

  var wait = Promise.all(promises.map(function (promise) {
    return promise.then(resolved, rejected);
  }));

  return wait.then(function () {
    return {
      successful: resolutions,
      failed: rejections
    };
  });
}

/**
 * Limit the amount of simultaneously pending Promises.
 * Returns a function that, when passed a function `fn`,
 * will make sure that at most `limit` calls to `fn` are pending.
 *
 * @param {number} limit
 * @return {function()}
 */
function limitPromises(limit) {
  var pending = 0;
  var queue = [];
  return function (fn) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var call = function call() {
        pending++;
        var promise = fn.apply(undefined, args);
        promise.then(onfinish, onfinish);
        return promise;
      };

      if (pending >= limit) {
        return new _Promise(function (resolve, reject) {
          queue.push(function () {
            call().then(resolve, reject);
          });
        });
      }
      return call();
    };
  };
  function onfinish() {
    pending--;
    var next = queue.shift();
    if (next) next();
  }
}

module.exports = {
  generateFileID: generateFileID,
  toArray: toArray,
  getTimeStamp: getTimeStamp,
  runPromiseSequence: runPromiseSequence,
  isTouchDevice: isTouchDevice,
  getFileNameAndExtension: getFileNameAndExtension,
  truncateString: truncateString,
  getFileTypeExtension: getFileTypeExtension,
  getFileType: getFileType,
  getArrayBuffer: getArrayBuffer,
  isPreviewSupported: isPreviewSupported,
  isObjectURL: isObjectURL,
  createThumbnail: createThumbnail,
  secondsToTime: secondsToTime,
  dataURItoBlob: dataURItoBlob,
  dataURItoFile: dataURItoFile,
  canvasToBlob: canvasToBlob,
  getSpeed: getSpeed,
  getBytesRemaining: getBytesRemaining,
  getETA: getETA,
  copyToClipboard: copyToClipboard,
  prettyETA: prettyETA,
  findDOMElement: findDOMElement,
  findAllDOMElements: findAllDOMElements,
  getSocketHost: getSocketHost,
  emitSocketProgress: emitSocketProgress,
  settle: settle,
  limitPromises: limitPromises
};

},{"../vendor/file-type":18,"es6-promise":2,"lodash.throttle":3}],14:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = require('../core/Plugin');

var _require = require('../core/Utils'),
    toArray = _require.toArray;

var Translator = require('../core/Translator');

var _require2 = require('preact'),
    h = _require2.h;

module.exports = function (_Plugin) {
  _inherits(FileInput, _Plugin);

  function FileInput(uppy, opts) {
    _classCallCheck(this, FileInput);

    var _this = _possibleConstructorReturn(this, _Plugin.call(this, uppy, opts));

    _this.id = _this.opts.id || 'FileInput';
    _this.title = 'File Input';
    _this.type = 'acquirer';

    var defaultLocale = {
      strings: {
        chooseFiles: 'Choose files'
      }

      // Default options
    };var defaultOptions = {
      target: null,
      allowMultipleFiles: true,
      pretty: true,
      inputName: 'files[]',
      locale: defaultLocale

      // Merge default options with the ones set by user
    };_this.opts = _extends({}, defaultOptions, opts);

    _this.locale = _extends({}, defaultLocale, _this.opts.locale);
    _this.locale.strings = _extends({}, defaultLocale.strings, _this.opts.locale.strings);

    // i18n
    _this.translator = new Translator({ locale: _this.locale });
    _this.i18n = _this.translator.translate.bind(_this.translator);

    _this.render = _this.render.bind(_this);
    _this.handleInputChange = _this.handleInputChange.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  FileInput.prototype.handleInputChange = function handleInputChange(ev) {
    var _this2 = this;

    this.uppy.log('[FileInput] Something selected through input...');

    var files = toArray(ev.target.files);

    files.forEach(function (file) {
      _this2.uppy.addFile({
        source: _this2.id,
        name: file.name,
        type: file.type,
        data: file
      });
    });
  };

  FileInput.prototype.handleClick = function handleClick(ev) {
    this.input.click();
  };

  FileInput.prototype.render = function render(state) {
    var _this3 = this;

    var hiddenInputStyle = {
      width: '0.1px',
      height: '0.1px',
      opacity: 0,
      overflow: 'hidden',
      position: 'absolute',
      zIndex: -1
    };

    return h(
      'div',
      { 'class': 'uppy uppy-FileInput-container' },
      h('input', { 'class': 'uppy-FileInput-input',
        style: this.opts.pretty && hiddenInputStyle,
        type: 'file',
        name: this.opts.inputName,
        onchange: this.handleInputChange,
        multiple: this.opts.allowMultipleFiles,
        ref: function ref(input) {
          _this3.input = input;
        } }),
      this.opts.pretty && h(
        'button',
        { 'class': 'uppy-FileInput-btn', type: 'button', onclick: this.handleClick },
        this.i18n('chooseFiles')
      )
    );
  };

  FileInput.prototype.install = function install() {
    var target = this.opts.target;
    if (target) {
      this.mount(target, this);
    }
  };

  FileInput.prototype.uninstall = function uninstall() {
    this.unmount();
  };

  return FileInput;
}(Plugin);

},{"../core/Plugin":10,"../core/Translator":11,"../core/Utils":13,"preact":6}],15:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = require('../core/Plugin');

var _require = require('preact'),
    h = _require.h;

/**
 * Progress bar
 *
 */


module.exports = function (_Plugin) {
  _inherits(ProgressBar, _Plugin);

  function ProgressBar(uppy, opts) {
    _classCallCheck(this, ProgressBar);

    var _this = _possibleConstructorReturn(this, _Plugin.call(this, uppy, opts));

    _this.id = _this.opts.id || 'ProgressBar';
    _this.title = 'Progress Bar';
    _this.type = 'progressindicator';

    // set default options
    var defaultOptions = {
      target: 'body',
      replaceTargetContent: false,
      fixed: false,
      hideAfterFinish: true

      // merge default options with the ones set by user
    };_this.opts = _extends({}, defaultOptions, opts);

    _this.render = _this.render.bind(_this);
    return _this;
  }

  ProgressBar.prototype.render = function render(state) {
    var progress = state.totalProgress || 0;
    var isHidden = progress === 100 && this.opts.hideAfterFinish;
    return h(
      'div',
      { 'class': 'uppy uppy-ProgressBar', style: { position: this.opts.fixed ? 'fixed' : 'initial' }, 'aria-hidden': isHidden },
      h('div', { 'class': 'uppy-ProgressBar-inner', style: { width: progress + '%' } }),
      h(
        'div',
        { 'class': 'uppy-ProgressBar-percentage' },
        progress
      )
    );
  };

  ProgressBar.prototype.install = function install() {
    var target = this.opts.target;
    if (target) {
      this.mount(target, this);
    }
  };

  ProgressBar.prototype.uninstall = function uninstall() {
    this.unmount();
  };

  return ProgressBar;
}(Plugin);

},{"../core/Plugin":10,"preact":6}],16:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Promise = typeof Promise === 'undefined' ? require('es6-promise').Promise : Promise;

var Plugin = require('../core/Plugin');
var cuid = require('cuid');
var Translator = require('../core/Translator');
var UppySocket = require('../core/UppySocket');

var _require = require('../core/Utils'),
    emitSocketProgress = _require.emitSocketProgress,
    getSocketHost = _require.getSocketHost,
    settle = _require.settle,
    limitPromises = _require.limitPromises;

module.exports = function (_Plugin) {
  _inherits(XHRUpload, _Plugin);

  function XHRUpload(uppy, opts) {
    _classCallCheck(this, XHRUpload);

    var _this = _possibleConstructorReturn(this, _Plugin.call(this, uppy, opts));

    _this.type = 'uploader';
    _this.id = 'XHRUpload';
    _this.title = 'XHRUpload';

    var defaultLocale = {
      strings: {
        timedOut: 'Upload stalled for %{seconds} seconds, aborting.'
      }

      // Default options
    };var defaultOptions = {
      formData: true,
      fieldName: 'files[]',
      method: 'post',
      metaFields: null,
      responseUrlFieldName: 'url',
      bundle: true,
      headers: {},
      locale: defaultLocale,
      timeout: 30 * 1000,
      limit: 0,
      getResponseData: function getResponseData(xhr) {
        return JSON.parse(xhr.response);
      },
      getResponseError: function getResponseError(xhr) {
        return new Error('Upload error');
      }
    };

    // Merge default options with the ones set by user
    _this.opts = _extends({}, defaultOptions, opts);
    _this.locale = _extends({}, defaultLocale, _this.opts.locale);
    _this.locale.strings = _extends({}, defaultLocale.strings, _this.opts.locale.strings);

    // i18n
    _this.translator = new Translator({ locale: _this.locale });
    _this.i18n = _this.translator.translate.bind(_this.translator);

    _this.handleUpload = _this.handleUpload.bind(_this);

    // Simultaneous upload limiting is shared across all uploads with this plugin.
    if (typeof _this.opts.limit === 'number' && _this.opts.limit !== 0) {
      _this.limitUploads = limitPromises(_this.opts.limit);
    } else {
      _this.limitUploads = function (fn) {
        return fn;
      };
    }
    return _this;
  }

  XHRUpload.prototype.getOptions = function getOptions(file) {
    var opts = _extends({}, this.opts, this.uppy.state.xhrUpload || {}, file.xhrUpload || {});
    opts.headers = {};
    _extends(opts.headers, this.opts.headers);
    if (this.uppy.state.xhrUpload) {
      _extends(opts.headers, this.uppy.state.xhrUpload.headers);
    }
    if (file.xhrUpload) {
      _extends(opts.headers, file.xhrUpload.headers);
    }

    return opts;
  };

  XHRUpload.prototype.createFormDataUpload = function createFormDataUpload(file, opts) {
    var formPost = new FormData();

    var metaFields = Array.isArray(opts.metaFields) ? opts.metaFields
    // Send along all fields by default.
    : Object.keys(file.meta);
    metaFields.forEach(function (item) {
      formPost.append(item, file.meta[item]);
    });

    formPost.append(opts.fieldName, file.data);

    return formPost;
  };

  XHRUpload.prototype.createBareUpload = function createBareUpload(file, opts) {
    return file.data;
  };

  XHRUpload.prototype.upload = function upload(file, current, total) {
    var _this2 = this;

    var opts = this.getOptions(file);

    this.uppy.log('uploading ' + current + ' of ' + total);
    return new _Promise(function (resolve, reject) {
      var data = opts.formData ? _this2.createFormDataUpload(file, opts) : _this2.createBareUpload(file, opts);

      var onTimedOut = function onTimedOut() {
        xhr.abort();
        _this2.uppy.log('[XHRUpload] ' + id + ' timed out');
        var error = new Error(_this2.i18n('timedOut', { seconds: Math.ceil(opts.timeout / 1000) }));
        _this2.uppy.emit('upload-error', file.id, error);
        reject(error);
      };
      var aliveTimer = void 0;
      var isAlive = function isAlive() {
        clearTimeout(aliveTimer);
        aliveTimer = setTimeout(onTimedOut, opts.timeout);
      };

      var xhr = new XMLHttpRequest();
      var id = cuid();

      xhr.upload.addEventListener('loadstart', function (ev) {
        _this2.uppy.log('[XHRUpload] ' + id + ' started');
        if (opts.timeout > 0) {
          // Begin checking for timeouts when loading starts.
          isAlive();
        }
      });

      xhr.upload.addEventListener('progress', function (ev) {
        _this2.uppy.log('[XHRUpload] ' + id + ' progress: ' + ev.loaded + ' / ' + ev.total);
        if (opts.timeout > 0) {
          isAlive();
        }

        if (ev.lengthComputable) {
          _this2.uppy.emit('upload-progress', {
            uploader: _this2,
            id: file.id,
            bytesUploaded: ev.loaded,
            bytesTotal: ev.total
          });
        }
      });

      xhr.addEventListener('load', function (ev) {
        _this2.uppy.log('[XHRUpload] ' + id + ' finished');
        clearTimeout(aliveTimer);

        if (ev.target.status >= 200 && ev.target.status < 300) {
          var resp = opts.getResponseData(xhr);
          var uploadURL = resp[opts.responseUrlFieldName];

          _this2.uppy.emit('upload-success', file.id, resp, uploadURL);

          if (uploadURL) {
            _this2.uppy.log('Download ' + file.name + ' from ' + file.uploadURL);
          }

          return resolve(file);
        } else {
          var error = opts.getResponseError(xhr) || new Error('Upload error');
          error.request = xhr;
          _this2.uppy.emit('upload-error', file.id, error);
          return reject(error);
        }
      });

      xhr.addEventListener('error', function (ev) {
        _this2.uppy.log('[XHRUpload] ' + id + ' errored');
        clearTimeout(aliveTimer);

        var error = opts.getResponseError(xhr) || new Error('Upload error');
        _this2.uppy.emit('upload-error', file.id, error);
        return reject(error);
      });

      xhr.open(opts.method.toUpperCase(), opts.endpoint, true);

      Object.keys(opts.headers).forEach(function (header) {
        xhr.setRequestHeader(header, opts.headers[header]);
      });

      xhr.send(data);

      _this2.uppy.on('upload-cancel', function (fileID) {
        if (fileID === file.id) {
          xhr.abort();
        }
      });

      _this2.uppy.on('cancel-all', function () {
        // const files = this.uppy.getState().files
        // if (!files[file.id]) return
        xhr.abort();
      });

      _this2.uppy.emit('upload-started', file.id);
    });
  };

  XHRUpload.prototype.uploadRemote = function uploadRemote(file, current, total) {
    var _this3 = this;

    var opts = this.getOptions(file);
    return new _Promise(function (resolve, reject) {
      _this3.uppy.emit('upload-started', file.id);

      var fields = {};
      var metaFields = Array.isArray(opts.metaFields) ? opts.metaFields
      // Send along all fields by default.
      : Object.keys(file.meta);

      metaFields.forEach(function (name) {
        fields[name] = file.meta[name];
      });

      fetch(file.remote.url, {
        method: 'post',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_extends({}, file.remote.body, {
          endpoint: opts.endpoint,
          size: file.data.size,
          fieldname: opts.fieldName,
          fields: fields,
          headers: opts.headers
        }))
      }).then(function (res) {
        if (res.status < 200 && res.status > 300) {
          return reject(res.statusText);
        }

        res.json().then(function (data) {
          var token = data.token;
          var host = getSocketHost(file.remote.host);
          var socket = new UppySocket({ target: host + '/api/' + token });

          socket.on('progress', function (progressData) {
            return emitSocketProgress(_this3, progressData, file);
          });

          socket.on('success', function (data) {
            _this3.uppy.emit('upload-success', file.id, data, data.url);
            socket.close();
            return resolve();
          });

          socket.on('error', function (errData) {
            _this3.uppy.emit('upload-error', file.id, new Error(errData.error));
            reject(new Error(errData.error));
          });
        });
      });
    });
  };

  XHRUpload.prototype.uploadFiles = function uploadFiles(files) {
    var _this4 = this;

    var actions = files.map(function (file, i) {
      var current = parseInt(i, 10) + 1;
      var total = files.length;

      if (file.error) {
        return function () {
          return Promise.reject(new Error(file.error));
        };
      } else if (file.isRemote) {
        return _this4.uploadRemote.bind(_this4, file, current, total);
      } else {
        return _this4.upload.bind(_this4, file, current, total);
      }
    });

    var promises = actions.map(function (action) {
      var limitedAction = _this4.limitUploads(action);
      return limitedAction();
    });

    return settle(promises);
  };

  XHRUpload.prototype.handleUpload = function handleUpload(fileIDs) {
    if (fileIDs.length === 0) {
      this.uppy.log('[XHRUpload] No files to upload!');
      return Promise.resolve();
    }

    this.uppy.log('[XHRUpload] Uploading...');
    var files = fileIDs.map(getFile, this);
    function getFile(fileID) {
      return this.uppy.state.files[fileID];
    }

    return this.uploadFiles(files).then(function () {
      return null;
    });
  };

  XHRUpload.prototype.install = function install() {
    this.uppy.addUploader(this.handleUpload);
  };

  XHRUpload.prototype.uninstall = function uninstall() {
    this.uppy.removeUploader(this.handleUpload);
  };

  return XHRUpload;
}(Plugin);

},{"../core/Plugin":10,"../core/Translator":11,"../core/UppySocket":12,"../core/Utils":13,"cuid":1,"es6-promise":2}],17:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Default store that keeps state in a simple object.
 */
var DefaultStore = function () {
  function DefaultStore() {
    _classCallCheck(this, DefaultStore);

    this.state = {};
    this.callbacks = [];
  }

  DefaultStore.prototype.getState = function getState() {
    return this.state;
  };

  DefaultStore.prototype.setState = function setState(patch) {
    var prevState = _extends({}, this.state);
    var nextState = _extends({}, this.state, patch);

    this.state = nextState;
    this._publish(prevState, nextState, patch);
  };

  DefaultStore.prototype.subscribe = function subscribe(listener) {
    var _this = this;

    this.callbacks.push(listener);
    return function () {
      // Remove the listener.
      _this.callbacks.splice(_this.callbacks.indexOf(listener), 1);
    };
  };

  DefaultStore.prototype._publish = function _publish() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.callbacks.forEach(function (listener) {
      listener.apply(undefined, args);
    });
  };

  return DefaultStore;
}();

module.exports = function defaultStore() {
  return new DefaultStore();
};

},{}],18:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

module.exports = function (input) {
	var buf = new Uint8Array(input);

	if (!(buf && buf.length > 1)) {
		return null;
	}

	var check = function check(header, opts) {
		opts = _extends({
			offset: 0
		}, opts);

		for (var i = 0; i < header.length; i++) {
			if (header[i] !== buf[i + opts.offset]) {
				return false;
			}
		}

		return true;
	};

	if (check([0xFF, 0xD8, 0xFF])) {
		return {
			ext: 'jpg',
			mime: 'image/jpeg'
		};
	}

	if (check([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
		return {
			ext: 'png',
			mime: 'image/png'
		};
	}

	if (check([0x47, 0x49, 0x46])) {
		return {
			ext: 'gif',
			mime: 'image/gif'
		};
	}

	if (check([0x57, 0x45, 0x42, 0x50], { offset: 8 })) {
		return {
			ext: 'webp',
			mime: 'image/webp'
		};
	}

	if (check([0x46, 0x4C, 0x49, 0x46])) {
		return {
			ext: 'flif',
			mime: 'image/flif'
		};
	}

	// Needs to be before `tif` check
	if ((check([0x49, 0x49, 0x2A, 0x0]) || check([0x4D, 0x4D, 0x0, 0x2A])) && check([0x43, 0x52], { offset: 8 })) {
		return {
			ext: 'cr2',
			mime: 'image/x-canon-cr2'
		};
	}

	if (check([0x49, 0x49, 0x2A, 0x0]) || check([0x4D, 0x4D, 0x0, 0x2A])) {
		return {
			ext: 'tif',
			mime: 'image/tiff'
		};
	}

	if (check([0x42, 0x4D])) {
		return {
			ext: 'bmp',
			mime: 'image/bmp'
		};
	}

	if (check([0x49, 0x49, 0xBC])) {
		return {
			ext: 'jxr',
			mime: 'image/vnd.ms-photo'
		};
	}

	if (check([0x38, 0x42, 0x50, 0x53])) {
		return {
			ext: 'psd',
			mime: 'image/vnd.adobe.photoshop'
		};
	}

	// Needs to be before the `zip` check
	if (check([0x50, 0x4B, 0x3, 0x4]) && check([0x6D, 0x69, 0x6D, 0x65, 0x74, 0x79, 0x70, 0x65, 0x61, 0x70, 0x70, 0x6C, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6F, 0x6E, 0x2F, 0x65, 0x70, 0x75, 0x62, 0x2B, 0x7A, 0x69, 0x70], { offset: 30 })) {
		return {
			ext: 'epub',
			mime: 'application/epub+zip'
		};
	}

	// Needs to be before `zip` check
	// Assumes signed `.xpi` from addons.mozilla.org
	if (check([0x50, 0x4B, 0x3, 0x4]) && check([0x4D, 0x45, 0x54, 0x41, 0x2D, 0x49, 0x4E, 0x46, 0x2F, 0x6D, 0x6F, 0x7A, 0x69, 0x6C, 0x6C, 0x61, 0x2E, 0x72, 0x73, 0x61], { offset: 30 })) {
		return {
			ext: 'xpi',
			mime: 'application/x-xpinstall'
		};
	}

	if (check([0x50, 0x4B]) && (buf[2] === 0x3 || buf[2] === 0x5 || buf[2] === 0x7) && (buf[3] === 0x4 || buf[3] === 0x6 || buf[3] === 0x8)) {
		return {
			ext: 'zip',
			mime: 'application/zip'
		};
	}

	if (check([0x75, 0x73, 0x74, 0x61, 0x72], { offset: 257 })) {
		return {
			ext: 'tar',
			mime: 'application/x-tar'
		};
	}

	if (check([0x52, 0x61, 0x72, 0x21, 0x1A, 0x7]) && (buf[6] === 0x0 || buf[6] === 0x1)) {
		return {
			ext: 'rar',
			mime: 'application/x-rar-compressed'
		};
	}

	if (check([0x1F, 0x8B, 0x8])) {
		return {
			ext: 'gz',
			mime: 'application/gzip'
		};
	}

	if (check([0x42, 0x5A, 0x68])) {
		return {
			ext: 'bz2',
			mime: 'application/x-bzip2'
		};
	}

	if (check([0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C])) {
		return {
			ext: '7z',
			mime: 'application/x-7z-compressed'
		};
	}

	if (check([0x78, 0x01])) {
		return {
			ext: 'dmg',
			mime: 'application/x-apple-diskimage'
		};
	}

	if (check([0x0, 0x0, 0x0]) && (buf[3] === 0x18 || buf[3] === 0x20) && check([0x66, 0x74, 0x79, 0x70], { offset: 4 }) || check([0x33, 0x67, 0x70, 0x35]) || check([0x0, 0x0, 0x0, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32]) && check([0x6D, 0x70, 0x34, 0x31, 0x6D, 0x70, 0x34, 0x32, 0x69, 0x73, 0x6F, 0x6D], { offset: 16 }) || check([0x0, 0x0, 0x0, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D]) || check([0x0, 0x0, 0x0, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32, 0x0, 0x0, 0x0, 0x0])) {
		return {
			ext: 'mp4',
			mime: 'video/mp4'
		};
	}

	if (check([0x0, 0x0, 0x0, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x56])) {
		return {
			ext: 'm4v',
			mime: 'video/x-m4v'
		};
	}

	if (check([0x4D, 0x54, 0x68, 0x64])) {
		return {
			ext: 'mid',
			mime: 'audio/midi'
		};
	}

	// https://github.com/threatstack/libmagic/blob/master/magic/Magdir/matroska
	if (check([0x1A, 0x45, 0xDF, 0xA3])) {
		var sliced = buf.subarray(4, 4 + 4096);
		var idPos = sliced.findIndex(function (el, i, arr) {
			return arr[i] === 0x42 && arr[i + 1] === 0x82;
		});

		if (idPos >= 0) {
			var docTypePos = idPos + 3;
			var findDocType = function findDocType(type) {
				return Array.from(type).every(function (c, i) {
					return sliced[docTypePos + i] === c.charCodeAt(0);
				});
			};

			if (findDocType('matroska')) {
				return {
					ext: 'mkv',
					mime: 'video/x-matroska'
				};
			}

			if (findDocType('webm')) {
				return {
					ext: 'webm',
					mime: 'video/webm'
				};
			}
		}
	}

	if (check([0x0, 0x0, 0x0, 0x14, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20]) || check([0x66, 0x72, 0x65, 0x65], { offset: 4 }) || check([0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20], { offset: 4 }) || check([0x6D, 0x64, 0x61, 0x74], { offset: 4 }) || // MJPEG
	check([0x77, 0x69, 0x64, 0x65], { offset: 4 })) {
		return {
			ext: 'mov',
			mime: 'video/quicktime'
		};
	}

	if (check([0x52, 0x49, 0x46, 0x46]) && check([0x41, 0x56, 0x49], { offset: 8 })) {
		return {
			ext: 'avi',
			mime: 'video/x-msvideo'
		};
	}

	if (check([0x30, 0x26, 0xB2, 0x75, 0x8E, 0x66, 0xCF, 0x11, 0xA6, 0xD9])) {
		return {
			ext: 'wmv',
			mime: 'video/x-ms-wmv'
		};
	}

	if (check([0x0, 0x0, 0x1, 0xBA])) {
		return {
			ext: 'mpg',
			mime: 'video/mpeg'
		};
	}

	if (check([0x49, 0x44, 0x33]) || check([0xFF, 0xFB])) {
		return {
			ext: 'mp3',
			mime: 'audio/mpeg'
		};
	}

	if (check([0x66, 0x74, 0x79, 0x70, 0x4D, 0x34, 0x41], { offset: 4 }) || check([0x4D, 0x34, 0x41, 0x20])) {
		return {
			ext: 'm4a',
			mime: 'audio/m4a'
		};
	}

	// Needs to be before `ogg` check
	if (check([0x4F, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64], { offset: 28 })) {
		return {
			ext: 'opus',
			mime: 'audio/opus'
		};
	}

	if (check([0x4F, 0x67, 0x67, 0x53])) {
		return {
			ext: 'ogg',
			mime: 'audio/ogg'
		};
	}

	if (check([0x66, 0x4C, 0x61, 0x43])) {
		return {
			ext: 'flac',
			mime: 'audio/x-flac'
		};
	}

	if (check([0x52, 0x49, 0x46, 0x46]) && check([0x57, 0x41, 0x56, 0x45], { offset: 8 })) {
		return {
			ext: 'wav',
			mime: 'audio/x-wav'
		};
	}

	if (check([0x23, 0x21, 0x41, 0x4D, 0x52, 0x0A])) {
		return {
			ext: 'amr',
			mime: 'audio/amr'
		};
	}

	if (check([0x25, 0x50, 0x44, 0x46])) {
		return {
			ext: 'pdf',
			mime: 'application/pdf'
		};
	}

	if (check([0x4D, 0x5A])) {
		return {
			ext: 'exe',
			mime: 'application/x-msdownload'
		};
	}

	if ((buf[0] === 0x43 || buf[0] === 0x46) && check([0x57, 0x53], { offset: 1 })) {
		return {
			ext: 'swf',
			mime: 'application/x-shockwave-flash'
		};
	}

	if (check([0x7B, 0x5C, 0x72, 0x74, 0x66])) {
		return {
			ext: 'rtf',
			mime: 'application/rtf'
		};
	}

	if (check([0x00, 0x61, 0x73, 0x6D])) {
		return {
			ext: 'wasm',
			mime: 'application/wasm'
		};
	}

	if (check([0x77, 0x4F, 0x46, 0x46]) && (check([0x00, 0x01, 0x00, 0x00], { offset: 4 }) || check([0x4F, 0x54, 0x54, 0x4F], { offset: 4 }))) {
		return {
			ext: 'woff',
			mime: 'font/woff'
		};
	}

	if (check([0x77, 0x4F, 0x46, 0x32]) && (check([0x00, 0x01, 0x00, 0x00], { offset: 4 }) || check([0x4F, 0x54, 0x54, 0x4F], { offset: 4 }))) {
		return {
			ext: 'woff2',
			mime: 'font/woff2'
		};
	}

	if (check([0x4C, 0x50], { offset: 34 }) && (check([0x00, 0x00, 0x01], { offset: 8 }) || check([0x01, 0x00, 0x02], { offset: 8 }) || check([0x02, 0x00, 0x02], { offset: 8 }))) {
		return {
			ext: 'eot',
			mime: 'application/octet-stream'
		};
	}

	if (check([0x00, 0x01, 0x00, 0x00, 0x00])) {
		return {
			ext: 'ttf',
			mime: 'font/ttf'
		};
	}

	if (check([0x4F, 0x54, 0x54, 0x4F, 0x00])) {
		return {
			ext: 'otf',
			mime: 'font/otf'
		};
	}

	if (check([0x00, 0x00, 0x01, 0x00])) {
		return {
			ext: 'ico',
			mime: 'image/x-icon'
		};
	}

	if (check([0x46, 0x4C, 0x56, 0x01])) {
		return {
			ext: 'flv',
			mime: 'video/x-flv'
		};
	}

	if (check([0x25, 0x21])) {
		return {
			ext: 'ps',
			mime: 'application/postscript'
		};
	}

	if (check([0xFD, 0x37, 0x7A, 0x58, 0x5A, 0x00])) {
		return {
			ext: 'xz',
			mime: 'application/x-xz'
		};
	}

	if (check([0x53, 0x51, 0x4C, 0x69])) {
		return {
			ext: 'sqlite',
			mime: 'application/x-sqlite3'
		};
	}

	if (check([0x4E, 0x45, 0x53, 0x1A])) {
		return {
			ext: 'nes',
			mime: 'application/x-nintendo-nes-rom'
		};
	}

	if (check([0x43, 0x72, 0x32, 0x34])) {
		return {
			ext: 'crx',
			mime: 'application/x-google-chrome-extension'
		};
	}

	if (check([0x4D, 0x53, 0x43, 0x46]) || check([0x49, 0x53, 0x63, 0x28])) {
		return {
			ext: 'cab',
			mime: 'application/vnd.ms-cab-compressed'
		};
	}

	// Needs to be before `ar` check
	if (check([0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E, 0x0A, 0x64, 0x65, 0x62, 0x69, 0x61, 0x6E, 0x2D, 0x62, 0x69, 0x6E, 0x61, 0x72, 0x79])) {
		return {
			ext: 'deb',
			mime: 'application/x-deb'
		};
	}

	if (check([0x21, 0x3C, 0x61, 0x72, 0x63, 0x68, 0x3E])) {
		return {
			ext: 'ar',
			mime: 'application/x-unix-archive'
		};
	}

	if (check([0xED, 0xAB, 0xEE, 0xDB])) {
		return {
			ext: 'rpm',
			mime: 'application/x-rpm'
		};
	}

	if (check([0x1F, 0xA0]) || check([0x1F, 0x9D])) {
		return {
			ext: 'Z',
			mime: 'application/x-compress'
		};
	}

	if (check([0x4C, 0x5A, 0x49, 0x50])) {
		return {
			ext: 'lz',
			mime: 'application/x-lzip'
		};
	}

	if (check([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1])) {
		return {
			ext: 'msi',
			mime: 'application/x-msi'
		};
	}

	if (check([0x06, 0x0E, 0x2B, 0x34, 0x02, 0x05, 0x01, 0x01, 0x0D, 0x01, 0x02, 0x01, 0x01, 0x02])) {
		return {
			ext: 'mxf',
			mime: 'application/mxf'
		};
	}

	if (check([0x47], { offset: 4 }) && (check([0x47], { offset: 192 }) || check([0x47], { offset: 196 }))) {
		return {
			ext: 'mts',
			mime: 'video/mp2t'
		};
	}

	if (check([0x42, 0x4C, 0x45, 0x4E, 0x44, 0x45, 0x52])) {
		return {
			ext: 'blend',
			mime: 'application/x-blender'
		};
	}

	if (check([0x42, 0x50, 0x47, 0xFB])) {
		return {
			ext: 'bpg',
			mime: 'image/bpg'
		};
	}

	return null;
};

},{}],19:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],20:[function(require,module,exports){
'use strict';

var Uppy = require('/home/travis/build/transloadit/uppy/src/core/Core');
var FileInput = require('/home/travis/build/transloadit/uppy/src/plugins/FileInput');
var XHRUpload = require('/home/travis/build/transloadit/uppy/src/plugins/XHRUpload');
var ProgressBar = require('/home/travis/build/transloadit/uppy/src/plugins/ProgressBar');

var uppy = new Uppy({ debug: true, autoProceed: true });
uppy.use(FileInput, { target: '.UppyForm', replaceTargetContent: true });
uppy.use(XHRUpload, {
  endpoint: '//api2.transloadit.com',
  formData: true,
  fieldName: 'files[]'
});
uppy.use(ProgressBar, {
  target: 'body',
  fixed: true
});
uppy.run();

console.log('Uppy with Formtag and XHRUpload is loaded');

},{"/home/travis/build/transloadit/uppy/src/core/Core":9,"/home/travis/build/transloadit/uppy/src/plugins/FileInput":14,"/home/travis/build/transloadit/uppy/src/plugins/ProgressBar":15,"/home/travis/build/transloadit/uppy/src/plugins/XHRUpload":16}]},{},[20])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY3VpZC9kaXN0L2Jyb3dzZXItY3VpZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2VzNi1wcm9taXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9taW1lLW1hdGNoL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL25hbWVzcGFjZS1lbWl0dGVyL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3ByZWFjdC9kaXN0L3ByZWFjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcmV0dGllci1ieXRlcy9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy93aWxkY2FyZC9pbmRleC5qcyIsIi4uL3NyYy9jb3JlL0NvcmUuanMiLCIuLi9zcmMvY29yZS9QbHVnaW4uanMiLCIuLi9zcmMvY29yZS9UcmFuc2xhdG9yLmpzIiwiLi4vc3JjL2NvcmUvVXBweVNvY2tldC5qcyIsIi4uL3NyYy9jb3JlL1V0aWxzLmpzIiwiLi4vc3JjL3BsdWdpbnMvRmlsZUlucHV0LmpzIiwiLi4vc3JjL3BsdWdpbnMvUHJvZ3Jlc3NCYXIuanMiLCIuLi9zcmMvcGx1Z2lucy9YSFJVcGxvYWQuanMiLCIuLi9zcmMvc3RvcmUvRGVmYXVsdFN0b3JlLmpzIiwiLi4vc3JjL3ZlbmRvci9maWxlLXR5cGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL2V4YW1wbGVzL3hocnVwbG9hZC9hcHAuZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQy83QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNOLFFBQUssS0FEQztBQUVOLFNBQU07QUFGQSxHQUFQO0FBSUE7O0FBRUQsUUFBTyxJQUFQO0FBQ0EsQ0E1aUJEOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeExBLElBQU0sT0FBTyxRQUFRLG9CQUFSLENBQWI7QUFDQSxJQUFNLFlBQVksUUFBUSw0QkFBUixDQUFsQjtBQUNBLElBQU0sWUFBWSxRQUFRLDRCQUFSLENBQWxCO0FBQ0EsSUFBTSxjQUFjLFFBQVEsOEJBQVIsQ0FBcEI7O0FBRUEsSUFBTSxPQUFPLElBQUksSUFBSixDQUFTLEVBQUUsT0FBTyxJQUFULEVBQWUsYUFBYSxJQUE1QixFQUFULENBQWI7QUFDQSxLQUFLLEdBQUwsQ0FBUyxTQUFULEVBQW9CLEVBQUUsUUFBUSxXQUFWLEVBQXVCLHNCQUFzQixJQUE3QyxFQUFwQjtBQUNBLEtBQUssR0FBTCxDQUFTLFNBQVQsRUFBb0I7QUFDbEIsWUFBVSx3QkFEUTtBQUVsQixZQUFVLElBRlE7QUFHbEIsYUFBVztBQUhPLENBQXBCO0FBS0EsS0FBSyxHQUFMLENBQVMsV0FBVCxFQUFzQjtBQUNwQixVQUFRLE1BRFk7QUFFcEIsU0FBTztBQUZhLENBQXRCO0FBSUEsS0FBSyxHQUFMOztBQUVBLFFBQVEsR0FBUixDQUFZLDJDQUFaIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogY3VpZC5qc1xuICogQ29sbGlzaW9uLXJlc2lzdGFudCBVSUQgZ2VuZXJhdG9yIGZvciBicm93c2VycyBhbmQgbm9kZS5cbiAqIFNlcXVlbnRpYWwgZm9yIGZhc3QgZGIgbG9va3VwcyBhbmQgcmVjZW5jeSBzb3J0aW5nLlxuICogU2FmZSBmb3IgZWxlbWVudCBJRHMgYW5kIHNlcnZlci1zaWRlIGxvb2t1cHMuXG4gKlxuICogRXh0cmFjdGVkIGZyb20gQ0xDVFJcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEVyaWMgRWxsaW90dCAyMDEyXG4gKiBNSVQgTGljZW5zZVxuICovXG5cbi8qZ2xvYmFsIHdpbmRvdywgbmF2aWdhdG9yLCBkb2N1bWVudCwgcmVxdWlyZSwgcHJvY2VzcywgbW9kdWxlICovXG4oZnVuY3Rpb24gKGFwcCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciBuYW1lc3BhY2UgPSAnY3VpZCcsXG4gICAgYyA9IDAsXG4gICAgYmxvY2tTaXplID0gNCxcbiAgICBiYXNlID0gMzYsXG4gICAgZGlzY3JldGVWYWx1ZXMgPSBNYXRoLnBvdyhiYXNlLCBibG9ja1NpemUpLFxuXG4gICAgcGFkID0gZnVuY3Rpb24gcGFkKG51bSwgc2l6ZSkge1xuICAgICAgdmFyIHMgPSBcIjAwMDAwMDAwMFwiICsgbnVtO1xuICAgICAgcmV0dXJuIHMuc3Vic3RyKHMubGVuZ3RoLXNpemUpO1xuICAgIH0sXG5cbiAgICByYW5kb21CbG9jayA9IGZ1bmN0aW9uIHJhbmRvbUJsb2NrKCkge1xuICAgICAgcmV0dXJuIHBhZCgoTWF0aC5yYW5kb20oKSAqXG4gICAgICAgICAgICBkaXNjcmV0ZVZhbHVlcyA8PCAwKVxuICAgICAgICAgICAgLnRvU3RyaW5nKGJhc2UpLCBibG9ja1NpemUpO1xuICAgIH0sXG5cbiAgICBzYWZlQ291bnRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGMgPSAoYyA8IGRpc2NyZXRlVmFsdWVzKSA/IGMgOiAwO1xuICAgICAgYysrOyAvLyB0aGlzIGlzIG5vdCBzdWJsaW1pbmFsXG4gICAgICByZXR1cm4gYyAtIDE7XG4gICAgfSxcblxuICAgIGFwaSA9IGZ1bmN0aW9uIGN1aWQoKSB7XG4gICAgICAvLyBTdGFydGluZyB3aXRoIGEgbG93ZXJjYXNlIGxldHRlciBtYWtlc1xuICAgICAgLy8gaXQgSFRNTCBlbGVtZW50IElEIGZyaWVuZGx5LlxuICAgICAgdmFyIGxldHRlciA9ICdjJywgLy8gaGFyZC1jb2RlZCBhbGxvd3MgZm9yIHNlcXVlbnRpYWwgYWNjZXNzXG5cbiAgICAgICAgLy8gdGltZXN0YW1wXG4gICAgICAgIC8vIHdhcm5pbmc6IHRoaXMgZXhwb3NlcyB0aGUgZXhhY3QgZGF0ZSBhbmQgdGltZVxuICAgICAgICAvLyB0aGF0IHRoZSB1aWQgd2FzIGNyZWF0ZWQuXG4gICAgICAgIHRpbWVzdGFtcCA9IChuZXcgRGF0ZSgpLmdldFRpbWUoKSkudG9TdHJpbmcoYmFzZSksXG5cbiAgICAgICAgLy8gUHJldmVudCBzYW1lLW1hY2hpbmUgY29sbGlzaW9ucy5cbiAgICAgICAgY291bnRlcixcblxuICAgICAgICAvLyBBIGZldyBjaGFycyB0byBnZW5lcmF0ZSBkaXN0aW5jdCBpZHMgZm9yIGRpZmZlcmVudFxuICAgICAgICAvLyBjbGllbnRzIChzbyBkaWZmZXJlbnQgY29tcHV0ZXJzIGFyZSBmYXIgbGVzc1xuICAgICAgICAvLyBsaWtlbHkgdG8gZ2VuZXJhdGUgdGhlIHNhbWUgaWQpXG4gICAgICAgIGZpbmdlcnByaW50ID0gYXBpLmZpbmdlcnByaW50KCksXG5cbiAgICAgICAgLy8gR3JhYiBzb21lIG1vcmUgY2hhcnMgZnJvbSBNYXRoLnJhbmRvbSgpXG4gICAgICAgIHJhbmRvbSA9IHJhbmRvbUJsb2NrKCkgKyByYW5kb21CbG9jaygpO1xuXG4gICAgICAgIGNvdW50ZXIgPSBwYWQoc2FmZUNvdW50ZXIoKS50b1N0cmluZyhiYXNlKSwgYmxvY2tTaXplKTtcblxuICAgICAgcmV0dXJuICAobGV0dGVyICsgdGltZXN0YW1wICsgY291bnRlciArIGZpbmdlcnByaW50ICsgcmFuZG9tKTtcbiAgICB9O1xuXG4gIGFwaS5zbHVnID0gZnVuY3Rpb24gc2x1ZygpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKDM2KSxcbiAgICAgIGNvdW50ZXIsXG4gICAgICBwcmludCA9IGFwaS5maW5nZXJwcmludCgpLnNsaWNlKDAsMSkgK1xuICAgICAgICBhcGkuZmluZ2VycHJpbnQoKS5zbGljZSgtMSksXG4gICAgICByYW5kb20gPSByYW5kb21CbG9jaygpLnNsaWNlKC0yKTtcblxuICAgICAgY291bnRlciA9IHNhZmVDb3VudGVyKCkudG9TdHJpbmcoMzYpLnNsaWNlKC00KTtcblxuICAgIHJldHVybiBkYXRlLnNsaWNlKC0yKSArXG4gICAgICBjb3VudGVyICsgcHJpbnQgKyByYW5kb207XG4gIH07XG5cbiAgYXBpLmdsb2JhbENvdW50ID0gZnVuY3Rpb24gZ2xvYmFsQ291bnQoKSB7XG4gICAgLy8gV2Ugd2FudCB0byBjYWNoZSB0aGUgcmVzdWx0cyBvZiB0aGlzXG4gICAgdmFyIGNhY2hlID0gKGZ1bmN0aW9uIGNhbGMoKSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgIGNvdW50ID0gMDtcblxuICAgICAgICBmb3IgKGkgaW4gd2luZG93KSB7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICAgIH0oKSk7XG5cbiAgICBhcGkuZ2xvYmFsQ291bnQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBjYWNoZTsgfTtcbiAgICByZXR1cm4gY2FjaGU7XG4gIH07XG5cbiAgYXBpLmZpbmdlcnByaW50ID0gZnVuY3Rpb24gYnJvd3NlclByaW50KCkge1xuICAgIHJldHVybiBwYWQoKG5hdmlnYXRvci5taW1lVHlwZXMubGVuZ3RoICtcbiAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQubGVuZ3RoKS50b1N0cmluZygzNikgK1xuICAgICAgYXBpLmdsb2JhbENvdW50KCkudG9TdHJpbmcoMzYpLCA0KTtcbiAgfTtcblxuICAvLyBkb24ndCBjaGFuZ2UgYW55dGhpbmcgZnJvbSBoZXJlIGRvd24uXG4gIGlmIChhcHAucmVnaXN0ZXIpIHtcbiAgICBhcHAucmVnaXN0ZXIobmFtZXNwYWNlLCBhcGkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBhcGk7XG4gIH0gZWxzZSB7XG4gICAgYXBwW25hbWVzcGFjZV0gPSBhcGk7XG4gIH1cblxufSh0aGlzLmFwcGxpdHVkZSB8fCB0aGlzKSk7XG4iLCIvKiFcbiAqIEBvdmVydmlldyBlczYtcHJvbWlzZSAtIGEgdGlueSBpbXBsZW1lbnRhdGlvbiBvZiBQcm9taXNlcy9BKy5cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE0IFllaHVkYSBLYXR6LCBUb20gRGFsZSwgU3RlZmFuIFBlbm5lciBhbmQgY29udHJpYnV0b3JzIChDb252ZXJzaW9uIHRvIEVTNiBBUEkgYnkgSmFrZSBBcmNoaWJhbGQpXG4gKiBAbGljZW5zZSAgIExpY2Vuc2VkIHVuZGVyIE1JVCBsaWNlbnNlXG4gKiAgICAgICAgICAgIFNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vamFrZWFyY2hpYmFsZC9lczYtcHJvbWlzZS9tYXN0ZXIvTElDRU5TRVxuICogQHZlcnNpb24gICAzLjIuMVxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkdXRpbHMkJG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nIHx8ICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHV0aWxzJCRpc0Z1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzTWF5YmVUaGVuYWJsZSh4KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHggIT09IG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkX2lzQXJyYXk7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkdXRpbHMkJF9pc0FycmF5ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSR1dGlscyQkX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuICAgIH1cblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkdXRpbHMkJGlzQXJyYXkgPSBsaWIkZXM2JHByb21pc2UkdXRpbHMkJF9pc0FycmF5O1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuID0gMDtcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJHZlcnR4TmV4dDtcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGN1c3RvbVNjaGVkdWxlckZuO1xuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbl0gPSBjYWxsYmFjaztcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuICsgMV0gPSBhcmc7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkbGVuICs9IDI7XG4gICAgICBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbiA9PT0gMikge1xuICAgICAgICAvLyBJZiBsZW4gaXMgMiwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgICAgIC8vIHdpbGwgYmUgcHJvY2Vzc2VkIGJ5IHRoaXMgZmx1c2ggdGhhdCB3ZSBhcmUgc2NoZWR1bGluZy5cbiAgICAgICAgaWYgKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbikge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbihsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2V0U2NoZWR1bGVyKHNjaGVkdWxlRm4pIHtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRjdXN0b21TY2hlZHVsZXJGbiA9IHNjaGVkdWxlRm47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHNldEFzYXAoYXNhcEZuKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcCA9IGFzYXBGbjtcbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJXaW5kb3cgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDogdW5kZWZpbmVkO1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3Nlckdsb2JhbCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyV2luZG93IHx8IHt9O1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkYXNhcCQkQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGxpYiRlczYkcHJvbWlzZSRhc2FwJCRicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRpc05vZGUgPSB0eXBlb2Ygc2VsZiA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcblxuICAgIC8vIHRlc3QgZm9yIHdlYiB3b3JrZXIgYnV0IG5vdCBpbiBJRTEwXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgdHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAndW5kZWZpbmVkJztcblxuICAgIC8vIG5vZGVcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTmV4dFRpY2soKSB7XG4gICAgICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcbiAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vY3Vqb2pzL3doZW4vaXNzdWVzLzQxMCBmb3IgZGV0YWlsc1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHZlcnR4XG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVZlcnR4VGltZXIoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR2ZXJ0eE5leHQobGliJGVzNiRwcm9taXNlJGFzYXAkJGZsdXNoKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgbGliJGVzNiRwcm9taXNlJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCk7XG4gICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIG5vZGUuZGF0YSA9IChpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMik7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIHdlYiB3b3JrZXJcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTWVzc2FnZUNoYW5uZWwoKSB7XG4gICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2g7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlU2V0VGltZW91dCgpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgc2V0VGltZW91dChsaWIkZXM2JHByb21pc2UkYXNhcCQkZmx1c2gsIDEpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlID0gbmV3IEFycmF5KDEwMDApO1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRmbHVzaCgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGliJGVzNiRwcm9taXNlJGFzYXAkJGxlbjsgaSs9Mikge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbaV07XG4gICAgICAgIHZhciBhcmcgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkcXVldWVbaSsxXTtcblxuICAgICAgICBjYWxsYmFjayhhcmcpO1xuXG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHF1ZXVlW2krMV0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRsZW4gPSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhdHRlbXB0VmVydHgoKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgciA9IHJlcXVpcmU7XG4gICAgICAgIHZhciB2ZXJ0eCA9IHIoJ3ZlcnR4Jyk7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCR2ZXJ0eE5leHQgPSB2ZXJ0eC5ydW5Pbkxvb3AgfHwgdmVydHgucnVuT25Db250ZXh0O1xuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVZlcnR4VGltZXIoKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVNldFRpbWVvdXQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2g7XG4gICAgLy8gRGVjaWRlIHdoYXQgYXN5bmMgbWV0aG9kIHRvIHVzZSB0byB0cmlnZ2VyaW5nIHByb2Nlc3Npbmcgb2YgcXVldWVkIGNhbGxiYWNrczpcbiAgICBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGlzTm9kZSkge1xuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTmV4dFRpY2soKTtcbiAgICB9IGVsc2UgaWYgKGxpYiRlczYkcHJvbWlzZSRhc2FwJCRCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkdXNlTXV0YXRpb25PYnNlcnZlcigpO1xuICAgIH0gZWxzZSBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGlzV29ya2VyKSB7XG4gICAgICBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2NoZWR1bGVGbHVzaCA9IGxpYiRlczYkcHJvbWlzZSRhc2FwJCR1c2VNZXNzYWdlQ2hhbm5lbCgpO1xuICAgIH0gZWxzZSBpZiAobGliJGVzNiRwcm9taXNlJGFzYXAkJGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXR0ZW1wdFZlcnR4KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRzY2hlZHVsZUZsdXNoID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHVzZVNldFRpbWVvdXQoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHRoZW4kJHRoZW4ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgICAgIHZhciBwYXJlbnQgPSB0aGlzO1xuXG4gICAgICB2YXIgY2hpbGQgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcblxuICAgICAgaWYgKGNoaWxkW2xpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBST01JU0VfSURdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbWFrZVByb21pc2UoY2hpbGQpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RhdGUgPSBwYXJlbnQuX3N0YXRlO1xuXG4gICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzW3N0YXRlIC0gMV07XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc3RhdGUsIGNoaWxkLCBjYWxsYmFjaywgcGFyZW50Ll9yZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSR0aGVuJCRkZWZhdWx0ID0gbGliJGVzNiRwcm9taXNlJHRoZW4kJHRoZW47XG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkcmVzb2x2ZShvYmplY3QpIHtcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH1cblxuICAgICAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3IobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCk7XG4gICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIG9iamVjdCk7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZXNvbHZlJCRyZXNvbHZlO1xuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQUk9NSVNFX0lEID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDE2KTtcblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3AoKSB7fVxuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcgICA9IHZvaWQgMDtcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEID0gMTtcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQgID0gMjtcblxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUiA9IG5ldyBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRFcnJvck9iamVjdCgpO1xuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc2VsZkZ1bGZpbGxtZW50KCkge1xuICAgICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgY2Fubm90IHJlc29sdmUgYSBwcm9taXNlIHdpdGggaXRzZWxmXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGNhbm5vdFJldHVybk93bigpIHtcbiAgICAgIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZ2V0VGhlbihwcm9taXNlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvciA9IGVycm9yO1xuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkdHJ5VGhlbih0aGVuLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuKSB7XG4gICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAoZnVuY3Rpb24ocHJvbWlzZSkge1xuICAgICAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgICAgIHZhciBlcnJvciA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHRyeVRoZW4odGhlbiwgdGhlbmFibGUsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHNlYWxlZCkgeyByZXR1cm47IH1cbiAgICAgICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIGlmIChzZWFsZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9LCAnU2V0dGxlOiAnICsgKHByb21pc2UuX2xhYmVsIHx8ICcgdW5rbm93biBwcm9taXNlJykpO1xuXG4gICAgICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9LCBwcm9taXNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xuICAgICAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gICAgICB9IGVsc2UgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4pIHtcbiAgICAgIGlmIChtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yID09PSBwcm9taXNlLmNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgdGhlbiA9PT0gbGliJGVzNiRwcm9taXNlJHRoZW4kJGRlZmF1bHQgJiZcbiAgICAgICAgICBjb25zdHJ1Y3Rvci5yZXNvbHZlID09PSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0KSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoZW4gPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SLmVycm9yKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGVuID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNGdW5jdGlvbih0aGVuKSkge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGhhbmRsZUZvcmVpZ25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xuICAgICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRzZWxmRnVsZmlsbG1lbnQoKSk7XG4gICAgICB9IGVsc2UgaWYgKGxpYiRlczYkcHJvbWlzZSR1dGlscyQkb2JqZWN0T3JGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSwgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZ2V0VGhlbih2YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gICAgICBpZiAocHJvbWlzZS5fb25lcnJvcikge1xuICAgICAgICBwcm9taXNlLl9vbmVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gICAgICB9XG5cbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2gocHJvbWlzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7IHJldHVybjsgfVxuXG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEO1xuXG4gICAgICBpZiAocHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2gsIHByb21pc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUEVORElORykgeyByZXR1cm47IH1cbiAgICAgIHByb21pc2UuX3N0YXRlID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQ7XG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XG5cbiAgICAgIGxpYiRlczYkcHJvbWlzZSRhc2FwJCRhc2FwKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbikge1xuICAgICAgdmFyIHN1YnNjcmliZXJzID0gcGFyZW50Ll9zdWJzY3JpYmVycztcbiAgICAgIHZhciBsZW5ndGggPSBzdWJzY3JpYmVycy5sZW5ndGg7XG5cbiAgICAgIHBhcmVudC5fb25lcnJvciA9IG51bGw7XG5cbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgICAgIHN1YnNjcmliZXJzW2xlbmd0aCArIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICAgICAgc3Vic2NyaWJlcnNbbGVuZ3RoICsgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURURdICA9IG9uUmVqZWN0aW9uO1xuXG4gICAgICBpZiAobGVuZ3RoID09PSAwICYmIHBhcmVudC5fc3RhdGUpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJGFzYXAkJGFzYXAobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcHVibGlzaCwgcGFyZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRwdWJsaXNoKHByb21pc2UpIHtcbiAgICAgIHZhciBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzO1xuICAgICAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgICAgdmFyIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhkZXRhaWwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKSB7XG4gICAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SID0gbmV3IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEVycm9yT2JqZWN0KCk7XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCR0cnlDYXRjaChjYWxsYmFjaywgZGV0YWlsKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZGV0YWlsKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xuICAgICAgICByZXR1cm4gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgICAgIHZhciBoYXNDYWxsYmFjayA9IGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICAgICAgdmFsdWUsIGVycm9yLCBzdWNjZWVkZWQsIGZhaWxlZDtcblxuICAgICAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgICAgIHZhbHVlID0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCk7XG5cbiAgICAgICAgaWYgKHZhbHVlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IpIHtcbiAgICAgICAgICBmYWlsZWQgPSB0cnVlO1xuICAgICAgICAgIGVycm9yID0gdmFsdWUuZXJyb3I7XG4gICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkY2Fubm90UmV0dXJuT3duKCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGRldGFpbDtcbiAgICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgIC8vIG5vb3BcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIGVycm9yKTtcbiAgICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkRlVMRklMTEVEKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSl7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIHJlamVjdFByb21pc2UocmVhc29uKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaWQgPSAwO1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5leHRJZCgpIHtcbiAgICAgIHJldHVybiBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpZCsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG1ha2VQcm9taXNlKHByb21pc2UpIHtcbiAgICAgIHByb21pc2VbbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUFJPTUlTRV9JRF0gPSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpZCsrO1xuICAgICAgcHJvbWlzZS5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICBwcm9taXNlLl9zdWJzY3JpYmVycyA9IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkYWxsKGVudHJpZXMpIHtcbiAgICAgIHJldHVybiBuZXcgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJGRlZmF1bHQodGhpcywgZW50cmllcykucHJvbWlzZTtcbiAgICB9XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkZGVmYXVsdCA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJGFsbCQkYWxsO1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJhY2UkJHJhY2UoZW50cmllcykge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICAgIGlmICghbGliJGVzNiRwcm9taXNlJHV0aWxzJCRpc0FycmF5KGVudHJpZXMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgQ29uc3RydWN0b3IucmVzb2x2ZShlbnRyaWVzW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJhY2UkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyYWNlJCRyYWNlO1xuICAgIGZ1bmN0aW9uIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlamVjdCQkcmVqZWN0KHJlYXNvbikge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcbiAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZWplY3QkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRyZWplY3QkJHJlamVjdDtcblxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJG5lZWRzUmVzb2x2ZXIoKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGEgcmVzb2x2ZXIgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJG5lZWRzTmV3KCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbiAgICB9XG5cbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZTtcbiAgICAvKipcbiAgICAgIFByb21pc2Ugb2JqZWN0cyByZXByZXNlbnQgdGhlIGV2ZW50dWFsIHJlc3VsdCBvZiBhbiBhc3luY2hyb25vdXMgb3BlcmF0aW9uLiBUaGVcbiAgICAgIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsIHdoaWNoXG4gICAgICByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZSByZWFzb25cbiAgICAgIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuXG4gICAgICBUZXJtaW5vbG9neVxuICAgICAgLS0tLS0tLS0tLS1cblxuICAgICAgLSBgcHJvbWlzZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHdpdGggYSBgdGhlbmAgbWV0aG9kIHdob3NlIGJlaGF2aW9yIGNvbmZvcm1zIHRvIHRoaXMgc3BlY2lmaWNhdGlvbi5cbiAgICAgIC0gYHRoZW5hYmxlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gdGhhdCBkZWZpbmVzIGEgYHRoZW5gIG1ldGhvZC5cbiAgICAgIC0gYHZhbHVlYCBpcyBhbnkgbGVnYWwgSmF2YVNjcmlwdCB2YWx1ZSAoaW5jbHVkaW5nIHVuZGVmaW5lZCwgYSB0aGVuYWJsZSwgb3IgYSBwcm9taXNlKS5cbiAgICAgIC0gYGV4Y2VwdGlvbmAgaXMgYSB2YWx1ZSB0aGF0IGlzIHRocm93biB1c2luZyB0aGUgdGhyb3cgc3RhdGVtZW50LlxuICAgICAgLSBgcmVhc29uYCBpcyBhIHZhbHVlIHRoYXQgaW5kaWNhdGVzIHdoeSBhIHByb21pc2Ugd2FzIHJlamVjdGVkLlxuICAgICAgLSBgc2V0dGxlZGAgdGhlIGZpbmFsIHJlc3Rpbmcgc3RhdGUgb2YgYSBwcm9taXNlLCBmdWxmaWxsZWQgb3IgcmVqZWN0ZWQuXG5cbiAgICAgIEEgcHJvbWlzZSBjYW4gYmUgaW4gb25lIG9mIHRocmVlIHN0YXRlczogcGVuZGluZywgZnVsZmlsbGVkLCBvciByZWplY3RlZC5cblxuICAgICAgUHJvbWlzZXMgdGhhdCBhcmUgZnVsZmlsbGVkIGhhdmUgYSBmdWxmaWxsbWVudCB2YWx1ZSBhbmQgYXJlIGluIHRoZSBmdWxmaWxsZWRcbiAgICAgIHN0YXRlLiAgUHJvbWlzZXMgdGhhdCBhcmUgcmVqZWN0ZWQgaGF2ZSBhIHJlamVjdGlvbiByZWFzb24gYW5kIGFyZSBpbiB0aGVcbiAgICAgIHJlamVjdGVkIHN0YXRlLiAgQSBmdWxmaWxsbWVudCB2YWx1ZSBpcyBuZXZlciBhIHRoZW5hYmxlLlxuXG4gICAgICBQcm9taXNlcyBjYW4gYWxzbyBiZSBzYWlkIHRvICpyZXNvbHZlKiBhIHZhbHVlLiAgSWYgdGhpcyB2YWx1ZSBpcyBhbHNvIGFcbiAgICAgIHByb21pc2UsIHRoZW4gdGhlIG9yaWdpbmFsIHByb21pc2UncyBzZXR0bGVkIHN0YXRlIHdpbGwgbWF0Y2ggdGhlIHZhbHVlJ3NcbiAgICAgIHNldHRsZWQgc3RhdGUuICBTbyBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IHJlamVjdHMgd2lsbFxuICAgICAgaXRzZWxmIHJlamVjdCwgYW5kIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgd2lsbFxuICAgICAgaXRzZWxmIGZ1bGZpbGwuXG5cblxuICAgICAgQmFzaWMgVXNhZ2U6XG4gICAgICAtLS0tLS0tLS0tLS1cblxuICAgICAgYGBganNcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIC8vIG9uIHN1Y2Nlc3NcbiAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG5cbiAgICAgICAgLy8gb24gZmFpbHVyZVxuICAgICAgICByZWplY3QocmVhc29uKTtcbiAgICAgIH0pO1xuXG4gICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAvLyBvbiByZWplY3Rpb25cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEFkdmFuY2VkIFVzYWdlOlxuICAgICAgLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFByb21pc2VzIHNoaW5lIHdoZW4gYWJzdHJhY3RpbmcgYXdheSBhc3luY2hyb25vdXMgaW50ZXJhY3Rpb25zIHN1Y2ggYXNcbiAgICAgIGBYTUxIdHRwUmVxdWVzdGBzLlxuXG4gICAgICBgYGBqc1xuICAgICAgZnVuY3Rpb24gZ2V0SlNPTih1cmwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZXI7XG4gICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcbiAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICB4aHIuc2VuZCgpO1xuXG4gICAgICAgICAgZnVuY3Rpb24gaGFuZGxlcigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IHRoaXMuRE9ORSkge1xuICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignZ2V0SlNPTjogYCcgKyB1cmwgKyAnYCBmYWlsZWQgd2l0aCBzdGF0dXM6IFsnICsgdGhpcy5zdGF0dXMgKyAnXScpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBnZXRKU09OKCcvcG9zdHMuanNvbicpLnRoZW4oZnVuY3Rpb24oanNvbikge1xuICAgICAgICAvLyBvbiBmdWxmaWxsbWVudFxuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIC8vIG9uIHJlamVjdGlvblxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgVW5saWtlIGNhbGxiYWNrcywgcHJvbWlzZXMgYXJlIGdyZWF0IGNvbXBvc2FibGUgcHJpbWl0aXZlcy5cblxuICAgICAgYGBganNcbiAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgZ2V0SlNPTignL3Bvc3RzJyksXG4gICAgICAgIGdldEpTT04oJy9jb21tZW50cycpXG4gICAgICBdKS50aGVuKGZ1bmN0aW9uKHZhbHVlcyl7XG4gICAgICAgIHZhbHVlc1swXSAvLyA9PiBwb3N0c0pTT05cbiAgICAgICAgdmFsdWVzWzFdIC8vID0+IGNvbW1lbnRzSlNPTlxuXG4gICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAY2xhc3MgUHJvbWlzZVxuICAgICAgQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZXJcbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICAgIEBjb25zdHJ1Y3RvclxuICAgICovXG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UocmVzb2x2ZXIpIHtcbiAgICAgIHRoaXNbbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUFJPTUlTRV9JRF0gPSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRuZXh0SWQoKTtcbiAgICAgIHRoaXMuX3Jlc3VsdCA9IHRoaXMuX3N0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcblxuICAgICAgaWYgKGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJG5vb3AgIT09IHJlc29sdmVyKSB7XG4gICAgICAgIHR5cGVvZiByZXNvbHZlciAhPT0gJ2Z1bmN0aW9uJyAmJiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkbmVlZHNSZXNvbHZlcigpO1xuICAgICAgICB0aGlzIGluc3RhbmNlb2YgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UgPyBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRpbml0aWFsaXplUHJvbWlzZSh0aGlzLCByZXNvbHZlcikgOiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkbmVlZHNOZXcoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5hbGwgPSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSRhbGwkJGRlZmF1bHQ7XG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucmFjZSA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJhY2UkJGRlZmF1bHQ7XG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucmVzb2x2ZSA9IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJHJlc29sdmUkJGRlZmF1bHQ7XG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucmVqZWN0ID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVqZWN0JCRkZWZhdWx0O1xuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLl9zZXRTY2hlZHVsZXIgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkc2V0U2NoZWR1bGVyO1xuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLl9zZXRBc2FwID0gbGliJGVzNiRwcm9taXNlJGFzYXAkJHNldEFzYXA7XG4gICAgbGliJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UuX2FzYXAgPSBsaWIkZXM2JHByb21pc2UkYXNhcCQkYXNhcDtcblxuICAgIGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLnByb3RvdHlwZSA9IHtcbiAgICAgIGNvbnN0cnVjdG9yOiBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZSxcblxuICAgIC8qKlxuICAgICAgVGhlIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsXG4gICAgICB3aGljaCByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZVxuICAgICAgcmVhc29uIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAvLyB1c2VyIGlzIGF2YWlsYWJsZVxuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gdXNlciBpcyB1bmF2YWlsYWJsZSwgYW5kIHlvdSBhcmUgZ2l2ZW4gdGhlIHJlYXNvbiB3aHlcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIENoYWluaW5nXG4gICAgICAtLS0tLS0tLVxuXG4gICAgICBUaGUgcmV0dXJuIHZhbHVlIG9mIGB0aGVuYCBpcyBpdHNlbGYgYSBwcm9taXNlLiAgVGhpcyBzZWNvbmQsICdkb3duc3RyZWFtJ1xuICAgICAgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZpcnN0IHByb21pc2UncyBmdWxmaWxsbWVudFxuICAgICAgb3IgcmVqZWN0aW9uIGhhbmRsZXIsIG9yIHJlamVjdGVkIGlmIHRoZSBoYW5kbGVyIHRocm93cyBhbiBleGNlcHRpb24uXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHVzZXIubmFtZTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgcmV0dXJuICdkZWZhdWx0IG5hbWUnO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodXNlck5hbWUpIHtcbiAgICAgICAgLy8gSWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGB1c2VyTmFtZWAgd2lsbCBiZSB0aGUgdXNlcidzIG5hbWUsIG90aGVyd2lzZSBpdFxuICAgICAgICAvLyB3aWxsIGJlIGAnZGVmYXVsdCBuYW1lJ2BcbiAgICAgIH0pO1xuXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScpO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgLy8gaWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGByZWFzb25gIHdpbGwgYmUgJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jy5cbiAgICAgICAgLy8gSWYgYGZpbmRVc2VyYCByZWplY3RlZCwgYHJlYXNvbmAgd2lsbCBiZSAnYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScuXG4gICAgICB9KTtcbiAgICAgIGBgYFxuICAgICAgSWYgdGhlIGRvd25zdHJlYW0gcHJvbWlzZSBkb2VzIG5vdCBzcGVjaWZ5IGEgcmVqZWN0aW9uIGhhbmRsZXIsIHJlamVjdGlvbiByZWFzb25zIHdpbGwgYmUgcHJvcGFnYXRlZCBmdXJ0aGVyIGRvd25zdHJlYW0uXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFBlZGFnb2dpY2FsRXhjZXB0aW9uKCdVcHN0cmVhbSBlcnJvcicpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBUaGUgYFBlZGdhZ29jaWFsRXhjZXB0aW9uYCBpcyBwcm9wYWdhdGVkIGFsbCB0aGUgd2F5IGRvd24gdG8gaGVyZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQXNzaW1pbGF0aW9uXG4gICAgICAtLS0tLS0tLS0tLS1cblxuICAgICAgU29tZXRpbWVzIHRoZSB2YWx1ZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgdG8gYSBkb3duc3RyZWFtIHByb21pc2UgY2FuIG9ubHkgYmVcbiAgICAgIHJldHJpZXZlZCBhc3luY2hyb25vdXNseS4gVGhpcyBjYW4gYmUgYWNoaWV2ZWQgYnkgcmV0dXJuaW5nIGEgcHJvbWlzZSBpbiB0aGVcbiAgICAgIGZ1bGZpbGxtZW50IG9yIHJlamVjdGlvbiBoYW5kbGVyLiBUaGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgdGhlbiBiZSBwZW5kaW5nXG4gICAgICB1bnRpbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpcyBzZXR0bGVkLiBUaGlzIGlzIGNhbGxlZCAqYXNzaW1pbGF0aW9uKi5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgICAvLyBUaGUgdXNlcidzIGNvbW1lbnRzIGFyZSBub3cgYXZhaWxhYmxlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBJZiB0aGUgYXNzaW1saWF0ZWQgcHJvbWlzZSByZWplY3RzLCB0aGVuIHRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCBhbHNvIHJlamVjdC5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIGZ1bGZpbGxzLCB3ZSdsbCBoYXZlIHRoZSB2YWx1ZSBoZXJlXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgcmVqZWN0cywgd2UnbGwgaGF2ZSB0aGUgcmVhc29uIGhlcmVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFNpbXBsZSBFeGFtcGxlXG4gICAgICAtLS0tLS0tLS0tLS0tLVxuXG4gICAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGZpbmRSZXN1bHQoKTtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfVxuICAgICAgYGBgXG5cbiAgICAgIEVycmJhY2sgRXhhbXBsZVxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFJlc3VsdChmdW5jdGlvbihyZXN1bHQsIGVycil7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAvLyBmYWlsdXJlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBQcm9taXNlIEV4YW1wbGU7XG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIGZpbmRSZXN1bHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEFkdmFuY2VkIEV4YW1wbGVcbiAgICAgIC0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFN5bmNocm9ub3VzIEV4YW1wbGVcblxuICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgdmFyIGF1dGhvciwgYm9va3M7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGF1dGhvciA9IGZpbmRBdXRob3IoKTtcbiAgICAgICAgYm9va3MgID0gZmluZEJvb2tzQnlBdXRob3IoYXV0aG9yKTtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfVxuICAgICAgYGBgXG5cbiAgICAgIEVycmJhY2sgRXhhbXBsZVxuXG4gICAgICBgYGBqc1xuXG4gICAgICBmdW5jdGlvbiBmb3VuZEJvb2tzKGJvb2tzKSB7XG5cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZmFpbHVyZShyZWFzb24pIHtcblxuICAgICAgfVxuXG4gICAgICBmaW5kQXV0aG9yKGZ1bmN0aW9uKGF1dGhvciwgZXJyKXtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAvLyBmYWlsdXJlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZpbmRCb29va3NCeUF1dGhvcihhdXRob3IsIGZ1bmN0aW9uKGJvb2tzLCBlcnIpIHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgZm91bmRCb29rcyhib29rcyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICAgIGZhaWx1cmUocmVhc29uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBQcm9taXNlIEV4YW1wbGU7XG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIGZpbmRBdXRob3IoKS5cbiAgICAgICAgdGhlbihmaW5kQm9va3NCeUF1dGhvcikuXG4gICAgICAgIHRoZW4oZnVuY3Rpb24oYm9va3Mpe1xuICAgICAgICAgIC8vIGZvdW5kIGJvb2tzXG4gICAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQG1ldGhvZCB0aGVuXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGZpbGxlZFxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3RlZFxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgICAgQHJldHVybiB7UHJvbWlzZX1cbiAgICAqL1xuICAgICAgdGhlbjogbGliJGVzNiRwcm9taXNlJHRoZW4kJGRlZmF1bHQsXG5cbiAgICAvKipcbiAgICAgIGBjYXRjaGAgaXMgc2ltcGx5IHN1Z2FyIGZvciBgdGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uKWAgd2hpY2ggbWFrZXMgaXQgdGhlIHNhbWVcbiAgICAgIGFzIHRoZSBjYXRjaCBibG9jayBvZiBhIHRyeS9jYXRjaCBzdGF0ZW1lbnQuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xuICAgICAgfVxuXG4gICAgICAvLyBzeW5jaHJvbm91c1xuICAgICAgdHJ5IHtcbiAgICAgICAgZmluZEF1dGhvcigpO1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgIH1cblxuICAgICAgLy8gYXN5bmMgd2l0aCBwcm9taXNlc1xuICAgICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIGNhdGNoXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgICAgQHJldHVybiB7UHJvbWlzZX1cbiAgICAqL1xuICAgICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvcjtcbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQpIHtcbiAgICAgIHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgICAgIHRoaXMucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcihsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRub29wKTtcblxuICAgICAgaWYgKCF0aGlzLnByb21pc2VbbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUFJPTUlTRV9JRF0pIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbWFrZVByb21pc2UodGhpcy5wcm9taXNlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxpYiRlczYkcHJvbWlzZSR1dGlscyQkaXNBcnJheShpbnB1dCkpIHtcbiAgICAgICAgdGhpcy5faW5wdXQgICAgID0gaW5wdXQ7XG4gICAgICAgIHRoaXMubGVuZ3RoICAgICA9IGlucHV0Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgICAgIHRoaXMuX3Jlc3VsdCA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmxlbmd0aCB8fCAwO1xuICAgICAgICAgIHRoaXMuX2VudW1lcmF0ZSgpO1xuICAgICAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICAgIGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkcmVqZWN0KHRoaXMucHJvbWlzZSwgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJHZhbGlkYXRpb25FcnJvcigpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkdmFsaWRhdGlvbkVycm9yKCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG4gICAgfVxuXG4gICAgbGliJGVzNiRwcm9taXNlJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsZW5ndGggID0gdGhpcy5sZW5ndGg7XG4gICAgICB2YXIgaW5wdXQgICA9IHRoaXMuX2lucHV0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgdGhpcy5fc3RhdGUgPT09IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuX2VhY2hFbnRyeShpbnB1dFtpXSwgaSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fZWFjaEVudHJ5ID0gZnVuY3Rpb24oZW50cnksIGkpIHtcbiAgICAgIHZhciBjID0gdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvcjtcbiAgICAgIHZhciByZXNvbHZlID0gYy5yZXNvbHZlO1xuXG4gICAgICBpZiAocmVzb2x2ZSA9PT0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCkge1xuICAgICAgICB2YXIgdGhlbiA9IGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJGdldFRoZW4oZW50cnkpO1xuXG4gICAgICAgIGlmICh0aGVuID09PSBsaWIkZXM2JHByb21pc2UkdGhlbiQkZGVmYXVsdCAmJlxuICAgICAgICAgICAgZW50cnkuX3N0YXRlICE9PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgICAgdGhpcy5fc2V0dGxlZEF0KGVudHJ5Ll9zdGF0ZSwgaSwgZW50cnkuX3Jlc3VsdCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoZW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLl9yZW1haW5pbmctLTtcbiAgICAgICAgICB0aGlzLl9yZXN1bHRbaV0gPSBlbnRyeTtcbiAgICAgICAgfSBlbHNlIGlmIChjID09PSBsaWIkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdCkge1xuICAgICAgICAgIHZhciBwcm9taXNlID0gbmV3IGMobGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkbm9vcCk7XG4gICAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBlbnRyeSwgdGhlbik7XG4gICAgICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHByb21pc2UsIGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChuZXcgYyhmdW5jdGlvbihyZXNvbHZlKSB7IHJlc29sdmUoZW50cnkpOyB9KSwgaSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChyZXNvbHZlKGVudHJ5KSwgaSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGxpYiRlczYkcHJvbWlzZSRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fc2V0dGxlZEF0ID0gZnVuY3Rpb24oc3RhdGUsIGksIHZhbHVlKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IHRoaXMucHJvbWlzZTtcblxuICAgICAgaWYgKHByb21pc2UuX3N0YXRlID09PSBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRQRU5ESU5HKSB7XG4gICAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuXG4gICAgICAgIGlmIChzdGF0ZSA9PT0gbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgICBsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBsaWIkZXM2JHByb21pc2UkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3dpbGxTZXR0bGVBdCA9IGZ1bmN0aW9uKHByb21pc2UsIGkpIHtcbiAgICAgIHZhciBlbnVtZXJhdG9yID0gdGhpcztcblxuICAgICAgbGliJGVzNiRwcm9taXNlJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHByb21pc2UsIHVuZGVmaW5lZCwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgZW51bWVyYXRvci5fc2V0dGxlZEF0KGxpYiRlczYkcHJvbWlzZSQkaW50ZXJuYWwkJEZVTEZJTExFRCwgaSwgdmFsdWUpO1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdChsaWIkZXM2JHByb21pc2UkJGludGVybmFsJCRSRUpFQ1RFRCwgaSwgcmVhc29uKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZnVuY3Rpb24gbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRwb2x5ZmlsbCgpIHtcbiAgICAgIHZhciBsb2NhbDtcblxuICAgICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgbG9jYWwgPSBnbG9iYWw7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGxvY2FsID0gc2VsZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgbG9jYWwgPSBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5ZmlsbCBmYWlsZWQgYmVjYXVzZSBnbG9iYWwgb2JqZWN0IGlzIHVuYXZhaWxhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQnKTtcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBQID0gbG9jYWwuUHJvbWlzZTtcblxuICAgICAgaWYgKFAgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFAucmVzb2x2ZSgpKSA9PT0gJ1tvYmplY3QgUHJvbWlzZV0nICYmICFQLmNhc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsb2NhbC5Qcm9taXNlID0gbGliJGVzNiRwcm9taXNlJHByb21pc2UkJGRlZmF1bHQ7XG4gICAgfVxuICAgIHZhciBsaWIkZXM2JHByb21pc2UkcG9seWZpbGwkJGRlZmF1bHQgPSBsaWIkZXM2JHByb21pc2UkcG9seWZpbGwkJHBvbHlmaWxsO1xuXG4gICAgdmFyIGxpYiRlczYkcHJvbWlzZSR1bWQkJEVTNlByb21pc2UgPSB7XG4gICAgICAnUHJvbWlzZSc6IGxpYiRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0LFxuICAgICAgJ3BvbHlmaWxsJzogbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRkZWZhdWx0XG4gICAgfTtcblxuICAgIC8qIGdsb2JhbCBkZWZpbmU6dHJ1ZSBtb2R1bGU6dHJ1ZSB3aW5kb3c6IHRydWUgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbJ2FtZCddKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBsaWIkZXM2JHByb21pc2UkdW1kJCRFUzZQcm9taXNlOyB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSB7XG4gICAgICBtb2R1bGVbJ2V4cG9ydHMnXSA9IGxpYiRlczYkcHJvbWlzZSR1bWQkJEVTNlByb21pc2U7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXNbJ0VTNlByb21pc2UnXSA9IGxpYiRlczYkcHJvbWlzZSR1bWQkJEVTNlByb21pc2U7XG4gICAgfVxuXG4gICAgbGliJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRkZWZhdWx0KCk7XG59KS5jYWxsKHRoaXMpO1xuXG4iLCIvKipcbiAqIGxvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHJlc3VsdCA9IHdhaXQgLSB0aW1lU2luY2VMYXN0Q2FsbDtcblxuICAgIHJldHVybiBtYXhpbmcgPyBuYXRpdmVNaW4ocmVzdWx0LCBtYXhXYWl0IC0gdGltZVNpbmNlTGFzdEludm9rZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzaG91bGRJbnZva2UodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWU7XG5cbiAgICAvLyBFaXRoZXIgdGhpcyBpcyB0aGUgZmlyc3QgY2FsbCwgYWN0aXZpdHkgaGFzIHN0b3BwZWQgYW5kIHdlJ3JlIGF0IHRoZVxuICAgIC8vIHRyYWlsaW5nIGVkZ2UsIHRoZSBzeXN0ZW0gdGltZSBoYXMgZ29uZSBiYWNrd2FyZHMgYW5kIHdlJ3JlIHRyZWF0aW5nXG4gICAgLy8gaXQgYXMgdGhlIHRyYWlsaW5nIGVkZ2UsIG9yIHdlJ3ZlIGhpdCB0aGUgYG1heFdhaXRgIGxpbWl0LlxuICAgIHJldHVybiAobGFzdENhbGxUaW1lID09PSB1bmRlZmluZWQgfHwgKHRpbWVTaW5jZUxhc3RDYWxsID49IHdhaXQpIHx8XG4gICAgICAodGltZVNpbmNlTGFzdENhbGwgPCAwKSB8fCAobWF4aW5nICYmIHRpbWVTaW5jZUxhc3RJbnZva2UgPj0gbWF4V2FpdCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGltZXJFeHBpcmVkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCk7XG4gICAgaWYgKHNob3VsZEludm9rZSh0aW1lKSkge1xuICAgICAgcmV0dXJuIHRyYWlsaW5nRWRnZSh0aW1lKTtcbiAgICB9XG4gICAgLy8gUmVzdGFydCB0aGUgdGltZXIuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCByZW1haW5pbmdXYWl0KHRpbWUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYWlsaW5nRWRnZSh0aW1lKSB7XG4gICAgdGltZXJJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8vIE9ubHkgaW52b2tlIGlmIHdlIGhhdmUgYGxhc3RBcmdzYCB3aGljaCBtZWFucyBgZnVuY2AgaGFzIGJlZW5cbiAgICAvLyBkZWJvdW5jZWQgYXQgbGVhc3Qgb25jZS5cbiAgICBpZiAodHJhaWxpbmcgJiYgbGFzdEFyZ3MpIHtcbiAgICAgIHJldHVybiBpbnZva2VGdW5jKHRpbWUpO1xuICAgIH1cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgIH1cbiAgICBsYXN0SW52b2tlVGltZSA9IDA7XG4gICAgbGFzdEFyZ3MgPSBsYXN0Q2FsbFRpbWUgPSBsYXN0VGhpcyA9IHRpbWVySWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICByZXR1cm4gdGltZXJJZCA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogdHJhaWxpbmdFZGdlKG5vdygpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpLFxuICAgICAgICBpc0ludm9raW5nID0gc2hvdWxkSW52b2tlKHRpbWUpO1xuXG4gICAgbGFzdEFyZ3MgPSBhcmd1bWVudHM7XG4gICAgbGFzdFRoaXMgPSB0aGlzO1xuICAgIGxhc3RDYWxsVGltZSA9IHRpbWU7XG5cbiAgICBpZiAoaXNJbnZva2luZykge1xuICAgICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbGVhZGluZ0VkZ2UobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXhpbmcpIHtcbiAgICAgICAgLy8gSGFuZGxlIGludm9jYXRpb25zIGluIGEgdGlnaHQgbG9vcC5cbiAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAgICAgcmV0dXJuIGludm9rZUZ1bmMobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICBkZWJvdW5jZWQuZmx1c2ggPSBmbHVzaDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgdGhyb3R0bGVkIGZ1bmN0aW9uIHRoYXQgb25seSBpbnZva2VzIGBmdW5jYCBhdCBtb3N0IG9uY2UgcGVyXG4gKiBldmVyeSBgd2FpdGAgbWlsbGlzZWNvbmRzLiBUaGUgdGhyb3R0bGVkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYFxuICogbWV0aG9kIHRvIGNhbmNlbCBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0b1xuICogaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgXG4gKiBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGUgbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgXG4gKiB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWQgd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlXG4gKiB0aHJvdHRsZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnQgY2FsbHMgdG8gdGhlIHRocm90dGxlZCBmdW5jdGlvbiByZXR1cm4gdGhlXG4gKiByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8udGhyb3R0bGVgIGFuZCBgXy5kZWJvdW5jZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB0aHJvdHRsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB0aHJvdHRsZSBpbnZvY2F0aW9ucyB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB0aHJvdHRsZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGV4Y2Vzc2l2ZWx5IHVwZGF0aW5nIHRoZSBwb3NpdGlvbiB3aGlsZSBzY3JvbGxpbmcuXG4gKiBqUXVlcnkod2luZG93KS5vbignc2Nyb2xsJywgXy50aHJvdHRsZSh1cGRhdGVQb3NpdGlvbiwgMTAwKSk7XG4gKlxuICogLy8gSW52b2tlIGByZW5ld1Rva2VuYCB3aGVuIHRoZSBjbGljayBldmVudCBpcyBmaXJlZCwgYnV0IG5vdCBtb3JlIHRoYW4gb25jZSBldmVyeSA1IG1pbnV0ZXMuXG4gKiB2YXIgdGhyb3R0bGVkID0gXy50aHJvdHRsZShyZW5ld1Rva2VuLCAzMDAwMDAsIHsgJ3RyYWlsaW5nJzogZmFsc2UgfSk7XG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgdGhyb3R0bGVkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIHRocm90dGxlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgdGhyb3R0bGVkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxlYWRpbmcgPSB0cnVlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAnbGVhZGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy5sZWFkaW5nIDogbGVhZGluZztcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG4gIHJldHVybiBkZWJvdW5jZShmdW5jLCB3YWl0LCB7XG4gICAgJ2xlYWRpbmcnOiBsZWFkaW5nLFxuICAgICdtYXhXYWl0Jzogd2FpdCxcbiAgICAndHJhaWxpbmcnOiB0cmFpbGluZ1xuICB9KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGhyb3R0bGU7XG4iLCJ2YXIgd2lsZGNhcmQgPSByZXF1aXJlKCd3aWxkY2FyZCcpO1xudmFyIHJlTWltZVBhcnRTcGxpdCA9IC9bXFwvXFwrXFwuXS87XG5cbi8qKlxuICAjIG1pbWUtbWF0Y2hcblxuICBBIHNpbXBsZSBmdW5jdGlvbiB0byBjaGVja2VyIHdoZXRoZXIgYSB0YXJnZXQgbWltZSB0eXBlIG1hdGNoZXMgYSBtaW1lLXR5cGVcbiAgcGF0dGVybiAoZS5nLiBpbWFnZS9qcGVnIG1hdGNoZXMgaW1hZ2UvanBlZyBPUiBpbWFnZS8qKS5cblxuICAjIyBFeGFtcGxlIFVzYWdlXG5cbiAgPDw8IGV4YW1wbGUuanNcblxuKiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhcmdldCwgcGF0dGVybikge1xuICBmdW5jdGlvbiB0ZXN0KHBhdHRlcm4pIHtcbiAgICB2YXIgcmVzdWx0ID0gd2lsZGNhcmQocGF0dGVybiwgdGFyZ2V0LCByZU1pbWVQYXJ0U3BsaXQpO1xuXG4gICAgLy8gZW5zdXJlIHRoYXQgd2UgaGF2ZSBhIHZhbGlkIG1pbWUgdHlwZSAoc2hvdWxkIGhhdmUgdHdvIHBhcnRzKVxuICAgIHJldHVybiByZXN1bHQgJiYgcmVzdWx0Lmxlbmd0aCA+PSAyO1xuICB9XG5cbiAgcmV0dXJuIHBhdHRlcm4gPyB0ZXN0KHBhdHRlcm4uc3BsaXQoJzsnKVswXSkgOiB0ZXN0O1xufTtcbiIsIi8qKlxuKiBDcmVhdGUgYW4gZXZlbnQgZW1pdHRlciB3aXRoIG5hbWVzcGFjZXNcbiogQG5hbWUgY3JlYXRlTmFtZXNwYWNlRW1pdHRlclxuKiBAZXhhbXBsZVxuKiB2YXIgZW1pdHRlciA9IHJlcXVpcmUoJy4vaW5kZXgnKSgpXG4qXG4qIGVtaXR0ZXIub24oJyonLCBmdW5jdGlvbiAoKSB7XG4qICAgY29uc29sZS5sb2coJ2FsbCBldmVudHMgZW1pdHRlZCcsIHRoaXMuZXZlbnQpXG4qIH0pXG4qXG4qIGVtaXR0ZXIub24oJ2V4YW1wbGUnLCBmdW5jdGlvbiAoKSB7XG4qICAgY29uc29sZS5sb2coJ2V4YW1wbGUgZXZlbnQgZW1pdHRlZCcpXG4qIH0pXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVOYW1lc3BhY2VFbWl0dGVyICgpIHtcbiAgdmFyIGVtaXR0ZXIgPSB7fVxuICB2YXIgX2ZucyA9IGVtaXR0ZXIuX2ZucyA9IHt9XG5cbiAgLyoqXG4gICogRW1pdCBhbiBldmVudC4gT3B0aW9uYWxseSBuYW1lc3BhY2UgdGhlIGV2ZW50LiBIYW5kbGVycyBhcmUgZmlyZWQgaW4gdGhlIG9yZGVyIGluIHdoaWNoIHRoZXkgd2VyZSBhZGRlZCB3aXRoIGV4YWN0IG1hdGNoZXMgdGFraW5nIHByZWNlZGVuY2UuIFNlcGFyYXRlIHRoZSBuYW1lc3BhY2UgYW5kIGV2ZW50IHdpdGggYSBgOmBcbiAgKiBAbmFtZSBlbWl0XG4gICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IOKAkyB0aGUgbmFtZSBvZiB0aGUgZXZlbnQsIHdpdGggb3B0aW9uYWwgbmFtZXNwYWNlXG4gICogQHBhcmFtIHsuLi4qfSBkYXRhIOKAkyB1cCB0byA2IGFyZ3VtZW50cyB0aGF0IGFyZSBwYXNzZWQgdG8gdGhlIGV2ZW50IGxpc3RlbmVyXG4gICogQGV4YW1wbGVcbiAgKiBlbWl0dGVyLmVtaXQoJ2V4YW1wbGUnKVxuICAqIGVtaXR0ZXIuZW1pdCgnZGVtbzp0ZXN0JylcbiAgKiBlbWl0dGVyLmVtaXQoJ2RhdGEnLCB7IGV4YW1wbGU6IHRydWV9LCAnYSBzdHJpbmcnLCAxKVxuICAqL1xuICBlbWl0dGVyLmVtaXQgPSBmdW5jdGlvbiBlbWl0IChldmVudCwgYXJnMSwgYXJnMiwgYXJnMywgYXJnNCwgYXJnNSwgYXJnNikge1xuICAgIHZhciB0b0VtaXQgPSBnZXRMaXN0ZW5lcnMoZXZlbnQpXG5cbiAgICBpZiAodG9FbWl0Lmxlbmd0aCkge1xuICAgICAgZW1pdEFsbChldmVudCwgdG9FbWl0LCBbYXJnMSwgYXJnMiwgYXJnMywgYXJnNCwgYXJnNSwgYXJnNl0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogQ3JlYXRlIGVuIGV2ZW50IGxpc3RlbmVyLlxuICAqIEBuYW1lIG9uXG4gICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgKiBAZXhhbXBsZVxuICAqIGVtaXR0ZXIub24oJ2V4YW1wbGUnLCBmdW5jdGlvbiAoKSB7fSlcbiAgKiBlbWl0dGVyLm9uKCdkZW1vJywgZnVuY3Rpb24gKCkge30pXG4gICovXG4gIGVtaXR0ZXIub24gPSBmdW5jdGlvbiBvbiAoZXZlbnQsIGZuKSB7XG4gICAgaWYgKCFfZm5zW2V2ZW50XSkge1xuICAgICAgX2Zuc1tldmVudF0gPSBbXVxuICAgIH1cblxuICAgIF9mbnNbZXZlbnRdLnB1c2goZm4pXG4gIH1cblxuICAvKipcbiAgKiBDcmVhdGUgZW4gZXZlbnQgbGlzdGVuZXIgdGhhdCBmaXJlcyBvbmNlLlxuICAqIEBuYW1lIG9uY2VcbiAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAqIEBleGFtcGxlXG4gICogZW1pdHRlci5vbmNlKCdleGFtcGxlJywgZnVuY3Rpb24gKCkge30pXG4gICogZW1pdHRlci5vbmNlKCdkZW1vJywgZnVuY3Rpb24gKCkge30pXG4gICovXG4gIGVtaXR0ZXIub25jZSA9IGZ1bmN0aW9uIG9uY2UgKGV2ZW50LCBmbikge1xuICAgIGZ1bmN0aW9uIG9uZSAoKSB7XG4gICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICBlbWl0dGVyLm9mZihldmVudCwgb25lKVxuICAgIH1cbiAgICB0aGlzLm9uKGV2ZW50LCBvbmUpXG4gIH1cblxuICAvKipcbiAgKiBTdG9wIGxpc3RlbmluZyB0byBhbiBldmVudC4gU3RvcCBhbGwgbGlzdGVuZXJzIG9uIGFuIGV2ZW50IGJ5IG9ubHkgcGFzc2luZyB0aGUgZXZlbnQgbmFtZS4gU3RvcCBhIHNpbmdsZSBsaXN0ZW5lciBieSBwYXNzaW5nIHRoYXQgZXZlbnQgaGFuZGxlciBhcyBhIGNhbGxiYWNrLlxuICAqIFlvdSBtdXN0IGJlIGV4cGxpY2l0IGFib3V0IHdoYXQgd2lsbCBiZSB1bnN1YnNjcmliZWQ6IGBlbWl0dGVyLm9mZignZGVtbycpYCB3aWxsIHVuc3Vic2NyaWJlIGFuIGBlbWl0dGVyLm9uKCdkZW1vJylgIGxpc3RlbmVyLFxuICAqIGBlbWl0dGVyLm9mZignZGVtbzpleGFtcGxlJylgIHdpbGwgdW5zdWJzY3JpYmUgYW4gYGVtaXR0ZXIub24oJ2RlbW86ZXhhbXBsZScpYCBsaXN0ZW5lclxuICAqIEBuYW1lIG9mZlxuICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl0g4oCTIHRoZSBzcGVjaWZpYyBoYW5kbGVyXG4gICogQGV4YW1wbGVcbiAgKiBlbWl0dGVyLm9mZignZXhhbXBsZScpXG4gICogZW1pdHRlci5vZmYoJ2RlbW8nLCBmdW5jdGlvbiAoKSB7fSlcbiAgKi9cbiAgZW1pdHRlci5vZmYgPSBmdW5jdGlvbiBvZmYgKGV2ZW50LCBmbikge1xuICAgIHZhciBrZWVwID0gW11cblxuICAgIGlmIChldmVudCAmJiBmbikge1xuICAgICAgdmFyIGZucyA9IHRoaXMuX2Zuc1tldmVudF1cbiAgICAgIHZhciBpID0gMFxuICAgICAgdmFyIGwgPSBmbnMubGVuZ3RoXG5cbiAgICAgIGZvciAoaTsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoZm5zW2ldICE9PSBmbikge1xuICAgICAgICAgIGtlZXAucHVzaChmbnNbaV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBrZWVwLmxlbmd0aCA/IHRoaXMuX2Zuc1tldmVudF0gPSBrZWVwIDogZGVsZXRlIHRoaXMuX2Zuc1tldmVudF1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExpc3RlbmVycyAoZSkge1xuICAgIHZhciBvdXQgPSBfZm5zW2VdID8gX2Zuc1tlXSA6IFtdXG4gICAgdmFyIGlkeCA9IGUuaW5kZXhPZignOicpXG4gICAgdmFyIGFyZ3MgPSAoaWR4ID09PSAtMSkgPyBbZV0gOiBbZS5zdWJzdHJpbmcoMCwgaWR4KSwgZS5zdWJzdHJpbmcoaWR4ICsgMSldXG5cbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKF9mbnMpXG4gICAgdmFyIGkgPSAwXG4gICAgdmFyIGwgPSBrZXlzLmxlbmd0aFxuXG4gICAgZm9yIChpOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgaWYgKGtleSA9PT0gJyonKSB7XG4gICAgICAgIG91dCA9IG91dC5jb25jYXQoX2Zuc1trZXldKVxuICAgICAgfVxuXG4gICAgICBpZiAoYXJncy5sZW5ndGggPT09IDIgJiYgYXJnc1swXSA9PT0ga2V5KSB7XG4gICAgICAgIG91dCA9IG91dC5jb25jYXQoX2Zuc1trZXldKVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvdXRcbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXRBbGwgKGUsIGZucywgYXJncykge1xuICAgIHZhciBpID0gMFxuICAgIHZhciBsID0gZm5zLmxlbmd0aFxuXG4gICAgZm9yIChpOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoIWZuc1tpXSkgYnJlYWtcbiAgICAgIGZuc1tpXS5ldmVudCA9IGVcbiAgICAgIGZuc1tpXS5hcHBseShmbnNbaV0sIGFyZ3MpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVtaXR0ZXJcbn1cbiIsIiFmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgZnVuY3Rpb24gVk5vZGUoKSB7fVxuICAgIGZ1bmN0aW9uIGgobm9kZU5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGxhc3RTaW1wbGUsIGNoaWxkLCBzaW1wbGUsIGksIGNoaWxkcmVuID0gRU1QVFlfQ0hJTERSRU47XG4gICAgICAgIGZvciAoaSA9IGFyZ3VtZW50cy5sZW5ndGg7IGktLSA+IDI7ICkgc3RhY2sucHVzaChhcmd1bWVudHNbaV0pO1xuICAgICAgICBpZiAoYXR0cmlidXRlcyAmJiBudWxsICE9IGF0dHJpYnV0ZXMuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmICghc3RhY2subGVuZ3RoKSBzdGFjay5wdXNoKGF0dHJpYnV0ZXMuY2hpbGRyZW4pO1xuICAgICAgICAgICAgZGVsZXRlIGF0dHJpYnV0ZXMuY2hpbGRyZW47XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkgaWYgKChjaGlsZCA9IHN0YWNrLnBvcCgpKSAmJiB2b2lkIDAgIT09IGNoaWxkLnBvcCkgZm9yIChpID0gY2hpbGQubGVuZ3RoOyBpLS07ICkgc3RhY2sucHVzaChjaGlsZFtpXSk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgY2hpbGQpIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChzaW1wbGUgPSAnZnVuY3Rpb24nICE9IHR5cGVvZiBub2RlTmFtZSkgaWYgKG51bGwgPT0gY2hpbGQpIGNoaWxkID0gJyc7IGVsc2UgaWYgKCdudW1iZXInID09IHR5cGVvZiBjaGlsZCkgY2hpbGQgPSBTdHJpbmcoY2hpbGQpOyBlbHNlIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgY2hpbGQpIHNpbXBsZSA9ICExO1xuICAgICAgICAgICAgaWYgKHNpbXBsZSAmJiBsYXN0U2ltcGxlKSBjaGlsZHJlbltjaGlsZHJlbi5sZW5ndGggLSAxXSArPSBjaGlsZDsgZWxzZSBpZiAoY2hpbGRyZW4gPT09IEVNUFRZX0NISUxEUkVOKSBjaGlsZHJlbiA9IFsgY2hpbGQgXTsgZWxzZSBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIGxhc3RTaW1wbGUgPSBzaW1wbGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHAgPSBuZXcgVk5vZGUoKTtcbiAgICAgICAgcC5ub2RlTmFtZSA9IG5vZGVOYW1lO1xuICAgICAgICBwLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHAuYXR0cmlidXRlcyA9IG51bGwgPT0gYXR0cmlidXRlcyA/IHZvaWQgMCA6IGF0dHJpYnV0ZXM7XG4gICAgICAgIHAua2V5ID0gbnVsbCA9PSBhdHRyaWJ1dGVzID8gdm9pZCAwIDogYXR0cmlidXRlcy5rZXk7XG4gICAgICAgIGlmICh2b2lkIDAgIT09IG9wdGlvbnMudm5vZGUpIG9wdGlvbnMudm5vZGUocCk7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBleHRlbmQob2JqLCBwcm9wcykge1xuICAgICAgICBmb3IgKHZhciBpIGluIHByb3BzKSBvYmpbaV0gPSBwcm9wc1tpXTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xvbmVFbGVtZW50KHZub2RlLCBwcm9wcykge1xuICAgICAgICByZXR1cm4gaCh2bm9kZS5ub2RlTmFtZSwgZXh0ZW5kKGV4dGVuZCh7fSwgdm5vZGUuYXR0cmlidXRlcyksIHByb3BzKSwgYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiB2bm9kZS5jaGlsZHJlbik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVucXVldWVSZW5kZXIoY29tcG9uZW50KSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9fZCAmJiAoY29tcG9uZW50Ll9fZCA9ICEwKSAmJiAxID09IGl0ZW1zLnB1c2goY29tcG9uZW50KSkgKG9wdGlvbnMuZGVib3VuY2VSZW5kZXJpbmcgfHwgZGVmZXIpKHJlcmVuZGVyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVyZW5kZXIoKSB7XG4gICAgICAgIHZhciBwLCBsaXN0ID0gaXRlbXM7XG4gICAgICAgIGl0ZW1zID0gW107XG4gICAgICAgIHdoaWxlIChwID0gbGlzdC5wb3AoKSkgaWYgKHAuX19kKSByZW5kZXJDb21wb25lbnQocCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzU2FtZU5vZGVUeXBlKG5vZGUsIHZub2RlLCBoeWRyYXRpbmcpIHtcbiAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2bm9kZSB8fCAnbnVtYmVyJyA9PSB0eXBlb2Ygdm5vZGUpIHJldHVybiB2b2lkIDAgIT09IG5vZGUuc3BsaXRUZXh0O1xuICAgICAgICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHZub2RlLm5vZGVOYW1lKSByZXR1cm4gIW5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yICYmIGlzTmFtZWROb2RlKG5vZGUsIHZub2RlLm5vZGVOYW1lKTsgZWxzZSByZXR1cm4gaHlkcmF0aW5nIHx8IG5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNOYW1lZE5vZGUobm9kZSwgbm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuX19uID09PSBub2RlTmFtZSB8fCBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE5vZGVQcm9wcyh2bm9kZSkge1xuICAgICAgICB2YXIgcHJvcHMgPSBleHRlbmQoe30sIHZub2RlLmF0dHJpYnV0ZXMpO1xuICAgICAgICBwcm9wcy5jaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0gdm5vZGUubm9kZU5hbWUuZGVmYXVsdFByb3BzO1xuICAgICAgICBpZiAodm9pZCAwICE9PSBkZWZhdWx0UHJvcHMpIGZvciAodmFyIGkgaW4gZGVmYXVsdFByb3BzKSBpZiAodm9pZCAwID09PSBwcm9wc1tpXSkgcHJvcHNbaV0gPSBkZWZhdWx0UHJvcHNbaV07XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlTm9kZShub2RlTmFtZSwgaXNTdmcpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBpc1N2ZyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBub2RlTmFtZSkgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcbiAgICAgICAgbm9kZS5fX24gPSBub2RlTmFtZTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSkge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudE5vZGUpIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldEFjY2Vzc29yKG5vZGUsIG5hbWUsIG9sZCwgdmFsdWUsIGlzU3ZnKSB7XG4gICAgICAgIGlmICgnY2xhc3NOYW1lJyA9PT0gbmFtZSkgbmFtZSA9ICdjbGFzcyc7XG4gICAgICAgIGlmICgna2V5JyA9PT0gbmFtZSkgOyBlbHNlIGlmICgncmVmJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKG9sZCkgb2xkKG51bGwpO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB2YWx1ZShub2RlKTtcbiAgICAgICAgfSBlbHNlIGlmICgnY2xhc3MnID09PSBuYW1lICYmICFpc1N2Zykgbm9kZS5jbGFzc05hbWUgPSB2YWx1ZSB8fCAnJzsgZWxzZSBpZiAoJ3N0eWxlJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCAnc3RyaW5nJyA9PSB0eXBlb2YgdmFsdWUgfHwgJ3N0cmluZycgPT0gdHlwZW9mIG9sZCkgbm9kZS5zdHlsZS5jc3NUZXh0ID0gdmFsdWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgJ29iamVjdCcgPT0gdHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBvbGQpIGZvciAodmFyIGkgaW4gb2xkKSBpZiAoIShpIGluIHZhbHVlKSkgbm9kZS5zdHlsZVtpXSA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gdmFsdWUpIG5vZGUuc3R5bGVbaV0gPSAnbnVtYmVyJyA9PSB0eXBlb2YgdmFsdWVbaV0gJiYgITEgPT09IElTX05PTl9ESU1FTlNJT05BTC50ZXN0KGkpID8gdmFsdWVbaV0gKyAncHgnIDogdmFsdWVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSBub2RlLmlubmVySFRNTCA9IHZhbHVlLl9faHRtbCB8fCAnJztcbiAgICAgICAgfSBlbHNlIGlmICgnbycgPT0gbmFtZVswXSAmJiAnbicgPT0gbmFtZVsxXSkge1xuICAgICAgICAgICAgdmFyIHVzZUNhcHR1cmUgPSBuYW1lICE9PSAobmFtZSA9IG5hbWUucmVwbGFjZSgvQ2FwdHVyZSQvLCAnJykpO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKS5zdWJzdHJpbmcoMik7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9sZCkgbm9kZS5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50UHJveHksIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgfSBlbHNlIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudFByb3h5LCB1c2VDYXB0dXJlKTtcbiAgICAgICAgICAgIChub2RlLl9fbCB8fCAobm9kZS5fX2wgPSB7fSkpW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2xpc3QnICE9PSBuYW1lICYmICd0eXBlJyAhPT0gbmFtZSAmJiAhaXNTdmcgJiYgbmFtZSBpbiBub2RlKSB7XG4gICAgICAgICAgICBzZXRQcm9wZXJ0eShub2RlLCBuYW1lLCBudWxsID09IHZhbHVlID8gJycgOiB2YWx1ZSk7XG4gICAgICAgICAgICBpZiAobnVsbCA9PSB2YWx1ZSB8fCAhMSA9PT0gdmFsdWUpIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5zID0gaXNTdmcgJiYgbmFtZSAhPT0gKG5hbWUgPSBuYW1lLnJlcGxhY2UoL154bGlua1xcOj8vLCAnJykpO1xuICAgICAgICAgICAgaWYgKG51bGwgPT0gdmFsdWUgfHwgITEgPT09IHZhbHVlKSBpZiAobnMpIG5vZGUucmVtb3ZlQXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCBuYW1lLnRvTG93ZXJDYXNlKCkpOyBlbHNlIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpOyBlbHNlIGlmICgnZnVuY3Rpb24nICE9IHR5cGVvZiB2YWx1ZSkgaWYgKG5zKSBub2RlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgbmFtZS50b0xvd2VyQ2FzZSgpLCB2YWx1ZSk7IGVsc2Ugbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldFByb3BlcnR5KG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBub2RlW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV2ZW50UHJveHkoZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2xbZS50eXBlXShvcHRpb25zLmV2ZW50ICYmIG9wdGlvbnMuZXZlbnQoZSkgfHwgZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZsdXNoTW91bnRzKCkge1xuICAgICAgICB2YXIgYztcbiAgICAgICAgd2hpbGUgKGMgPSBtb3VudHMucG9wKCkpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyTW91bnQpIG9wdGlvbnMuYWZ0ZXJNb3VudChjKTtcbiAgICAgICAgICAgIGlmIChjLmNvbXBvbmVudERpZE1vdW50KSBjLmNvbXBvbmVudERpZE1vdW50KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgcGFyZW50LCBjb21wb25lbnRSb290KSB7XG4gICAgICAgIGlmICghZGlmZkxldmVsKyspIHtcbiAgICAgICAgICAgIGlzU3ZnTW9kZSA9IG51bGwgIT0gcGFyZW50ICYmIHZvaWQgMCAhPT0gcGFyZW50Lm93bmVyU1ZHRWxlbWVudDtcbiAgICAgICAgICAgIGh5ZHJhdGluZyA9IG51bGwgIT0gZG9tICYmICEoJ19fcHJlYWN0YXR0cl8nIGluIGRvbSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9IGlkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBjb21wb25lbnRSb290KTtcbiAgICAgICAgaWYgKHBhcmVudCAmJiByZXQucGFyZW50Tm9kZSAhPT0gcGFyZW50KSBwYXJlbnQuYXBwZW5kQ2hpbGQocmV0KTtcbiAgICAgICAgaWYgKCEtLWRpZmZMZXZlbCkge1xuICAgICAgICAgICAgaHlkcmF0aW5nID0gITE7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudFJvb3QpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpIHtcbiAgICAgICAgdmFyIG91dCA9IGRvbSwgcHJldlN2Z01vZGUgPSBpc1N2Z01vZGU7XG4gICAgICAgIGlmIChudWxsID09IHZub2RlIHx8ICdib29sZWFuJyA9PSB0eXBlb2Ygdm5vZGUpIHZub2RlID0gJyc7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygdm5vZGUgfHwgJ251bWJlcicgPT0gdHlwZW9mIHZub2RlKSB7XG4gICAgICAgICAgICBpZiAoZG9tICYmIHZvaWQgMCAhPT0gZG9tLnNwbGl0VGV4dCAmJiBkb20ucGFyZW50Tm9kZSAmJiAoIWRvbS5fY29tcG9uZW50IHx8IGNvbXBvbmVudFJvb3QpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5ub2RlVmFsdWUgIT0gdm5vZGUpIGRvbS5ub2RlVmFsdWUgPSB2bm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodm5vZGUpO1xuICAgICAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShkb20sICEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQuX19wcmVhY3RhdHRyXyA9ICEwO1xuICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdm5vZGVOYW1lID0gdm5vZGUubm9kZU5hbWU7XG4gICAgICAgIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiB2bm9kZU5hbWUpIHJldHVybiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgIGlzU3ZnTW9kZSA9ICdzdmcnID09PSB2bm9kZU5hbWUgPyAhMCA6ICdmb3JlaWduT2JqZWN0JyA9PT0gdm5vZGVOYW1lID8gITEgOiBpc1N2Z01vZGU7XG4gICAgICAgIHZub2RlTmFtZSA9IFN0cmluZyh2bm9kZU5hbWUpO1xuICAgICAgICBpZiAoIWRvbSB8fCAhaXNOYW1lZE5vZGUoZG9tLCB2bm9kZU5hbWUpKSB7XG4gICAgICAgICAgICBvdXQgPSBjcmVhdGVOb2RlKHZub2RlTmFtZSwgaXNTdmdNb2RlKTtcbiAgICAgICAgICAgIGlmIChkb20pIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIG91dC5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGRvbS5wYXJlbnROb2RlKSBkb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3V0LCBkb20pO1xuICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGRvbSwgITApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBmYyA9IG91dC5maXJzdENoaWxkLCBwcm9wcyA9IG91dC5fX3ByZWFjdGF0dHJfLCB2Y2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaWYgKG51bGwgPT0gcHJvcHMpIHtcbiAgICAgICAgICAgIHByb3BzID0gb3V0Ll9fcHJlYWN0YXR0cl8gPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGEgPSBvdXQuYXR0cmlidXRlcywgaSA9IGEubGVuZ3RoOyBpLS07ICkgcHJvcHNbYVtpXS5uYW1lXSA9IGFbaV0udmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoeWRyYXRpbmcgJiYgdmNoaWxkcmVuICYmIDEgPT09IHZjaGlsZHJlbi5sZW5ndGggJiYgJ3N0cmluZycgPT0gdHlwZW9mIHZjaGlsZHJlblswXSAmJiBudWxsICE9IGZjICYmIHZvaWQgMCAhPT0gZmMuc3BsaXRUZXh0ICYmIG51bGwgPT0gZmMubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIGlmIChmYy5ub2RlVmFsdWUgIT0gdmNoaWxkcmVuWzBdKSBmYy5ub2RlVmFsdWUgPSB2Y2hpbGRyZW5bMF07XG4gICAgICAgIH0gZWxzZSBpZiAodmNoaWxkcmVuICYmIHZjaGlsZHJlbi5sZW5ndGggfHwgbnVsbCAhPSBmYykgaW5uZXJEaWZmTm9kZShvdXQsIHZjaGlsZHJlbiwgY29udGV4dCwgbW91bnRBbGwsIGh5ZHJhdGluZyB8fCBudWxsICE9IHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKTtcbiAgICAgICAgZGlmZkF0dHJpYnV0ZXMob3V0LCB2bm9kZS5hdHRyaWJ1dGVzLCBwcm9wcyk7XG4gICAgICAgIGlzU3ZnTW9kZSA9IHByZXZTdmdNb2RlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbm5lckRpZmZOb2RlKGRvbSwgdmNoaWxkcmVuLCBjb250ZXh0LCBtb3VudEFsbCwgaXNIeWRyYXRpbmcpIHtcbiAgICAgICAgdmFyIGosIGMsIGYsIHZjaGlsZCwgY2hpbGQsIG9yaWdpbmFsQ2hpbGRyZW4gPSBkb20uY2hpbGROb2RlcywgY2hpbGRyZW4gPSBbXSwga2V5ZWQgPSB7fSwga2V5ZWRMZW4gPSAwLCBtaW4gPSAwLCBsZW4gPSBvcmlnaW5hbENoaWxkcmVuLmxlbmd0aCwgY2hpbGRyZW5MZW4gPSAwLCB2bGVuID0gdmNoaWxkcmVuID8gdmNoaWxkcmVuLmxlbmd0aCA6IDA7XG4gICAgICAgIGlmICgwICE9PSBsZW4pIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBfY2hpbGQgPSBvcmlnaW5hbENoaWxkcmVuW2ldLCBwcm9wcyA9IF9jaGlsZC5fX3ByZWFjdGF0dHJfLCBrZXkgPSB2bGVuICYmIHByb3BzID8gX2NoaWxkLl9jb21wb25lbnQgPyBfY2hpbGQuX2NvbXBvbmVudC5fX2sgOiBwcm9wcy5rZXkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAga2V5ZWRMZW4rKztcbiAgICAgICAgICAgICAgICBrZXllZFtrZXldID0gX2NoaWxkO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wcyB8fCAodm9pZCAwICE9PSBfY2hpbGQuc3BsaXRUZXh0ID8gaXNIeWRyYXRpbmcgPyBfY2hpbGQubm9kZVZhbHVlLnRyaW0oKSA6ICEwIDogaXNIeWRyYXRpbmcpKSBjaGlsZHJlbltjaGlsZHJlbkxlbisrXSA9IF9jaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoMCAhPT0gdmxlbikgZm9yICh2YXIgaSA9IDA7IGkgPCB2bGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZjaGlsZCA9IHZjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBrZXkgPSB2Y2hpbGQua2V5O1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleWVkTGVuICYmIHZvaWQgMCAhPT0ga2V5ZWRba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGtleWVkW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGtleWVkW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGtleWVkTGVuLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghY2hpbGQgJiYgbWluIDwgY2hpbGRyZW5MZW4pIGZvciAoaiA9IG1pbjsgaiA8IGNoaWxkcmVuTGVuOyBqKyspIGlmICh2b2lkIDAgIT09IGNoaWxkcmVuW2pdICYmIGlzU2FtZU5vZGVUeXBlKGMgPSBjaGlsZHJlbltqXSwgdmNoaWxkLCBpc0h5ZHJhdGluZykpIHtcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGM7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW5bal0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGNoaWxkcmVuTGVuIC0gMSkgY2hpbGRyZW5MZW4tLTtcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gbWluKSBtaW4rKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoaWxkID0gaWRpZmYoY2hpbGQsIHZjaGlsZCwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgZiA9IG9yaWdpbmFsQ2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQgJiYgY2hpbGQgIT09IGRvbSAmJiBjaGlsZCAhPT0gZikgaWYgKG51bGwgPT0gZikgZG9tLmFwcGVuZENoaWxkKGNoaWxkKTsgZWxzZSBpZiAoY2hpbGQgPT09IGYubmV4dFNpYmxpbmcpIHJlbW92ZU5vZGUoZik7IGVsc2UgZG9tLmluc2VydEJlZm9yZShjaGlsZCwgZik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleWVkTGVuKSBmb3IgKHZhciBpIGluIGtleWVkKSBpZiAodm9pZCAwICE9PSBrZXllZFtpXSkgcmVjb2xsZWN0Tm9kZVRyZWUoa2V5ZWRbaV0sICExKTtcbiAgICAgICAgd2hpbGUgKG1pbiA8PSBjaGlsZHJlbkxlbikgaWYgKHZvaWQgMCAhPT0gKGNoaWxkID0gY2hpbGRyZW5bY2hpbGRyZW5MZW4tLV0pKSByZWNvbGxlY3ROb2RlVHJlZShjaGlsZCwgITEpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZWNvbGxlY3ROb2RlVHJlZShub2RlLCB1bm1vdW50T25seSkge1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gbm9kZS5fY29tcG9uZW50O1xuICAgICAgICBpZiAoY29tcG9uZW50KSB1bm1vdW50Q29tcG9uZW50KGNvbXBvbmVudCk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG51bGwgIT0gbm9kZS5fX3ByZWFjdGF0dHJfICYmIG5vZGUuX19wcmVhY3RhdHRyXy5yZWYpIG5vZGUuX19wcmVhY3RhdHRyXy5yZWYobnVsbCk7XG4gICAgICAgICAgICBpZiAoITEgPT09IHVubW91bnRPbmx5IHx8IG51bGwgPT0gbm9kZS5fX3ByZWFjdGF0dHJfKSByZW1vdmVOb2RlKG5vZGUpO1xuICAgICAgICAgICAgcmVtb3ZlQ2hpbGRyZW4obm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW4obm9kZSkge1xuICAgICAgICBub2RlID0gbm9kZS5sYXN0Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgICAgICB2YXIgbmV4dCA9IG5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUobm9kZSwgITApO1xuICAgICAgICAgICAgbm9kZSA9IG5leHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZkF0dHJpYnV0ZXMoZG9tLCBhdHRycywgb2xkKSB7XG4gICAgICAgIHZhciBuYW1lO1xuICAgICAgICBmb3IgKG5hbWUgaW4gb2xkKSBpZiAoKCFhdHRycyB8fCBudWxsID09IGF0dHJzW25hbWVdKSAmJiBudWxsICE9IG9sZFtuYW1lXSkgc2V0QWNjZXNzb3IoZG9tLCBuYW1lLCBvbGRbbmFtZV0sIG9sZFtuYW1lXSA9IHZvaWQgMCwgaXNTdmdNb2RlKTtcbiAgICAgICAgZm9yIChuYW1lIGluIGF0dHJzKSBpZiAoISgnY2hpbGRyZW4nID09PSBuYW1lIHx8ICdpbm5lckhUTUwnID09PSBuYW1lIHx8IG5hbWUgaW4gb2xkICYmIGF0dHJzW25hbWVdID09PSAoJ3ZhbHVlJyA9PT0gbmFtZSB8fCAnY2hlY2tlZCcgPT09IG5hbWUgPyBkb21bbmFtZV0gOiBvbGRbbmFtZV0pKSkgc2V0QWNjZXNzb3IoZG9tLCBuYW1lLCBvbGRbbmFtZV0sIG9sZFtuYW1lXSA9IGF0dHJzW25hbWVdLCBpc1N2Z01vZGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb2xsZWN0Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICB2YXIgbmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAoY29tcG9uZW50c1tuYW1lXSB8fCAoY29tcG9uZW50c1tuYW1lXSA9IFtdKSkucHVzaChjb21wb25lbnQpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoQ3RvciwgcHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGluc3QsIGxpc3QgPSBjb21wb25lbnRzW0N0b3IubmFtZV07XG4gICAgICAgIGlmIChDdG9yLnByb3RvdHlwZSAmJiBDdG9yLnByb3RvdHlwZS5yZW5kZXIpIHtcbiAgICAgICAgICAgIGluc3QgPSBuZXcgQ3Rvcihwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBDb21wb25lbnQuY2FsbChpbnN0LCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnN0ID0gbmV3IENvbXBvbmVudChwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpbnN0LmNvbnN0cnVjdG9yID0gQ3RvcjtcbiAgICAgICAgICAgIGluc3QucmVuZGVyID0gZG9SZW5kZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpc3QpIGZvciAodmFyIGkgPSBsaXN0Lmxlbmd0aDsgaS0tOyApIGlmIChsaXN0W2ldLmNvbnN0cnVjdG9yID09PSBDdG9yKSB7XG4gICAgICAgICAgICBpbnN0Ll9fYiA9IGxpc3RbaV0uX19iO1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZG9SZW5kZXIocHJvcHMsIHN0YXRlLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0Q29tcG9uZW50UHJvcHMoY29tcG9uZW50LCBwcm9wcywgb3B0cywgY29udGV4dCwgbW91bnRBbGwpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX194KSB7XG4gICAgICAgICAgICBjb21wb25lbnQuX194ID0gITA7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9fciA9IHByb3BzLnJlZikgZGVsZXRlIHByb3BzLnJlZjtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19rID0gcHJvcHMua2V5KSBkZWxldGUgcHJvcHMua2V5O1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQuYmFzZSB8fCBtb3VudEFsbCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSBjb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKSBjb21wb25lbnQuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhwcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoY29udGV4dCAmJiBjb250ZXh0ICE9PSBjb21wb25lbnQuY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGlmICghY29tcG9uZW50Ll9fYykgY29tcG9uZW50Ll9fYyA9IGNvbXBvbmVudC5jb250ZXh0O1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghY29tcG9uZW50Ll9fcCkgY29tcG9uZW50Ll9fcCA9IGNvbXBvbmVudC5wcm9wcztcbiAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9feCA9ICExO1xuICAgICAgICAgICAgaWYgKDAgIT09IG9wdHMpIGlmICgxID09PSBvcHRzIHx8ICExICE9PSBvcHRpb25zLnN5bmNDb21wb25lbnRVcGRhdGVzIHx8ICFjb21wb25lbnQuYmFzZSkgcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudCwgMSwgbW91bnRBbGwpOyBlbHNlIGVucXVldWVSZW5kZXIoY29tcG9uZW50KTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuX19yKSBjb21wb25lbnQuX19yKGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudCwgb3B0cywgbW91bnRBbGwsIGlzQ2hpbGQpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX194KSB7XG4gICAgICAgICAgICB2YXIgcmVuZGVyZWQsIGluc3QsIGNiYXNlLCBwcm9wcyA9IGNvbXBvbmVudC5wcm9wcywgc3RhdGUgPSBjb21wb25lbnQuc3RhdGUsIGNvbnRleHQgPSBjb21wb25lbnQuY29udGV4dCwgcHJldmlvdXNQcm9wcyA9IGNvbXBvbmVudC5fX3AgfHwgcHJvcHMsIHByZXZpb3VzU3RhdGUgPSBjb21wb25lbnQuX19zIHx8IHN0YXRlLCBwcmV2aW91c0NvbnRleHQgPSBjb21wb25lbnQuX19jIHx8IGNvbnRleHQsIGlzVXBkYXRlID0gY29tcG9uZW50LmJhc2UsIG5leHRCYXNlID0gY29tcG9uZW50Ll9fYiwgaW5pdGlhbEJhc2UgPSBpc1VwZGF0ZSB8fCBuZXh0QmFzZSwgaW5pdGlhbENoaWxkQ29tcG9uZW50ID0gY29tcG9uZW50Ll9jb21wb25lbnQsIHNraXAgPSAhMTtcbiAgICAgICAgICAgIGlmIChpc1VwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByZXZpb3VzUHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gcHJldmlvdXNTdGF0ZTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IHByZXZpb3VzQ29udGV4dDtcbiAgICAgICAgICAgICAgICBpZiAoMiAhPT0gb3B0cyAmJiBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlICYmICExID09PSBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCkpIHNraXAgPSAhMDsgZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tcG9uZW50Ll9fcCA9IGNvbXBvbmVudC5fX3MgPSBjb21wb25lbnQuX19jID0gY29tcG9uZW50Ll9fYiA9IG51bGw7XG4gICAgICAgICAgICBjb21wb25lbnQuX19kID0gITE7XG4gICAgICAgICAgICBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICByZW5kZXJlZCA9IGNvbXBvbmVudC5yZW5kZXIocHJvcHMsIHN0YXRlLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmdldENoaWxkQ29udGV4dCkgY29udGV4dCA9IGV4dGVuZChleHRlbmQoe30sIGNvbnRleHQpLCBjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KCkpO1xuICAgICAgICAgICAgICAgIHZhciB0b1VubW91bnQsIGJhc2UsIGNoaWxkQ29tcG9uZW50ID0gcmVuZGVyZWQgJiYgcmVuZGVyZWQubm9kZU5hbWU7XG4gICAgICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjaGlsZFByb3BzID0gZ2V0Tm9kZVByb3BzKHJlbmRlcmVkKTtcbiAgICAgICAgICAgICAgICAgICAgaW5zdCA9IGluaXRpYWxDaGlsZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluc3QgJiYgaW5zdC5jb25zdHJ1Y3RvciA9PT0gY2hpbGRDb21wb25lbnQgJiYgY2hpbGRQcm9wcy5rZXkgPT0gaW5zdC5fX2spIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDEsIGNvbnRleHQsICExKTsgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbnN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50Ll9jb21wb25lbnQgPSBpbnN0ID0gY3JlYXRlQ29tcG9uZW50KGNoaWxkQ29tcG9uZW50LCBjaGlsZFByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QuX19iID0gaW5zdC5fX2IgfHwgbmV4dEJhc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0Ll9fdSA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDAsIGNvbnRleHQsICExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbXBvbmVudChpbnN0LCAxLCBtb3VudEFsbCwgITApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJhc2UgPSBpbnN0LmJhc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2Jhc2UgPSBpbml0aWFsQmFzZTtcbiAgICAgICAgICAgICAgICAgICAgdG9Vbm1vdW50ID0gaW5pdGlhbENoaWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9Vbm1vdW50KSBjYmFzZSA9IGNvbXBvbmVudC5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWxCYXNlIHx8IDEgPT09IG9wdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYmFzZSkgY2Jhc2UuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlID0gZGlmZihjYmFzZSwgcmVuZGVyZWQsIGNvbnRleHQsIG1vdW50QWxsIHx8ICFpc1VwZGF0ZSwgaW5pdGlhbEJhc2UgJiYgaW5pdGlhbEJhc2UucGFyZW50Tm9kZSwgITApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbml0aWFsQmFzZSAmJiBiYXNlICE9PSBpbml0aWFsQmFzZSAmJiBpbnN0ICE9PSBpbml0aWFsQ2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJhc2VQYXJlbnQgPSBpbml0aWFsQmFzZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmFzZVBhcmVudCAmJiBiYXNlICE9PSBiYXNlUGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlUGFyZW50LnJlcGxhY2VDaGlsZChiYXNlLCBpbml0aWFsQmFzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRvVW5tb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxCYXNlLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKGluaXRpYWxCYXNlLCAhMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgdW5tb3VudENvbXBvbmVudCh0b1VubW91bnQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5iYXNlID0gYmFzZTtcbiAgICAgICAgICAgICAgICBpZiAoYmFzZSAmJiAhaXNDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50UmVmID0gY29tcG9uZW50LCB0ID0gY29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodCA9IHQuX191KSAoY29tcG9uZW50UmVmID0gdCkuYmFzZSA9IGJhc2U7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UuX2NvbXBvbmVudCA9IGNvbXBvbmVudFJlZjtcbiAgICAgICAgICAgICAgICAgICAgYmFzZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPSBjb21wb25lbnRSZWYuY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1VwZGF0ZSB8fCBtb3VudEFsbCkgbW91bnRzLnVuc2hpZnQoY29tcG9uZW50KTsgZWxzZSBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZSkgY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZShwcmV2aW91c1Byb3BzLCBwcmV2aW91c1N0YXRlLCBwcmV2aW91c0NvbnRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyVXBkYXRlKSBvcHRpb25zLmFmdGVyVXBkYXRlKGNvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobnVsbCAhPSBjb21wb25lbnQuX19oKSB3aGlsZSAoY29tcG9uZW50Ll9faC5sZW5ndGgpIGNvbXBvbmVudC5fX2gucG9wKCkuY2FsbChjb21wb25lbnQpO1xuICAgICAgICAgICAgaWYgKCFkaWZmTGV2ZWwgJiYgIWlzQ2hpbGQpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gYnVpbGRDb21wb25lbnRGcm9tVk5vZGUoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwpIHtcbiAgICAgICAgdmFyIGMgPSBkb20gJiYgZG9tLl9jb21wb25lbnQsIG9yaWdpbmFsQ29tcG9uZW50ID0gYywgb2xkRG9tID0gZG9tLCBpc0RpcmVjdE93bmVyID0gYyAmJiBkb20uX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZSwgaXNPd25lciA9IGlzRGlyZWN0T3duZXIsIHByb3BzID0gZ2V0Tm9kZVByb3BzKHZub2RlKTtcbiAgICAgICAgd2hpbGUgKGMgJiYgIWlzT3duZXIgJiYgKGMgPSBjLl9fdSkpIGlzT3duZXIgPSBjLmNvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICAgICAgaWYgKGMgJiYgaXNPd25lciAmJiAoIW1vdW50QWxsIHx8IGMuX2NvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGMsIHByb3BzLCAzLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBkb20gPSBjLmJhc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWxDb21wb25lbnQgJiYgIWlzRGlyZWN0T3duZXIpIHtcbiAgICAgICAgICAgICAgICB1bm1vdW50Q29tcG9uZW50KG9yaWdpbmFsQ29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICBkb20gPSBvbGREb20gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYyA9IGNyZWF0ZUNvbXBvbmVudCh2bm9kZS5ub2RlTmFtZSwgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGRvbSAmJiAhYy5fX2IpIHtcbiAgICAgICAgICAgICAgICBjLl9fYiA9IGRvbTtcbiAgICAgICAgICAgICAgICBvbGREb20gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoYywgcHJvcHMsIDEsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgICAgIGRvbSA9IGMuYmFzZTtcbiAgICAgICAgICAgIGlmIChvbGREb20gJiYgZG9tICE9PSBvbGREb20pIHtcbiAgICAgICAgICAgICAgICBvbGREb20uX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUob2xkRG9tLCAhMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvbTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdW5tb3VudENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYmVmb3JlVW5tb3VudCkgb3B0aW9ucy5iZWZvcmVVbm1vdW50KGNvbXBvbmVudCk7XG4gICAgICAgIHZhciBiYXNlID0gY29tcG9uZW50LmJhc2U7XG4gICAgICAgIGNvbXBvbmVudC5fX3ggPSAhMDtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG4gICAgICAgIGNvbXBvbmVudC5iYXNlID0gbnVsbDtcbiAgICAgICAgdmFyIGlubmVyID0gY29tcG9uZW50Ll9jb21wb25lbnQ7XG4gICAgICAgIGlmIChpbm5lcikgdW5tb3VudENvbXBvbmVudChpbm5lcik7IGVsc2UgaWYgKGJhc2UpIHtcbiAgICAgICAgICAgIGlmIChiYXNlLl9fcHJlYWN0YXR0cl8gJiYgYmFzZS5fX3ByZWFjdGF0dHJfLnJlZikgYmFzZS5fX3ByZWFjdGF0dHJfLnJlZihudWxsKTtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fX2IgPSBiYXNlO1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShiYXNlKTtcbiAgICAgICAgICAgIGNvbGxlY3RDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICAgIHJlbW92ZUNoaWxkcmVuKGJhc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb21wb25lbnQuX19yKSBjb21wb25lbnQuX19yKG51bGwpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBDb21wb25lbnQocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fX2QgPSAhMDtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVuZGVyKHZub2RlLCBwYXJlbnQsIG1lcmdlKSB7XG4gICAgICAgIHJldHVybiBkaWZmKG1lcmdlLCB2bm9kZSwge30sICExLCBwYXJlbnQsICExKTtcbiAgICB9XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICB2YXIgRU1QVFlfQ0hJTERSRU4gPSBbXTtcbiAgICB2YXIgZGVmZXIgPSAnZnVuY3Rpb24nID09IHR5cGVvZiBQcm9taXNlID8gUHJvbWlzZS5yZXNvbHZlKCkudGhlbi5iaW5kKFByb21pc2UucmVzb2x2ZSgpKSA6IHNldFRpbWVvdXQ7XG4gICAgdmFyIElTX05PTl9ESU1FTlNJT05BTCA9IC9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIHZhciBtb3VudHMgPSBbXTtcbiAgICB2YXIgZGlmZkxldmVsID0gMDtcbiAgICB2YXIgaXNTdmdNb2RlID0gITE7XG4gICAgdmFyIGh5ZHJhdGluZyA9ICExO1xuICAgIHZhciBjb21wb25lbnRzID0ge307XG4gICAgZXh0ZW5kKENvbXBvbmVudC5wcm90b3R5cGUsIHtcbiAgICAgICAgc2V0U3RhdGU6IGZ1bmN0aW9uKHN0YXRlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLnN0YXRlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9fcykgdGhpcy5fX3MgPSBleHRlbmQoe30sIHMpO1xuICAgICAgICAgICAgZXh0ZW5kKHMsICdmdW5jdGlvbicgPT0gdHlwZW9mIHN0YXRlID8gc3RhdGUocywgdGhpcy5wcm9wcykgOiBzdGF0ZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spICh0aGlzLl9faCA9IHRoaXMuX19oIHx8IFtdKS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGVucXVldWVSZW5kZXIodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGZvcmNlVXBkYXRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSAodGhpcy5fX2ggPSB0aGlzLl9faCB8fCBbXSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICByZW5kZXJDb21wb25lbnQodGhpcywgMik7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBwcmVhY3QgPSB7XG4gICAgICAgIGg6IGgsXG4gICAgICAgIGNyZWF0ZUVsZW1lbnQ6IGgsXG4gICAgICAgIGNsb25lRWxlbWVudDogY2xvbmVFbGVtZW50LFxuICAgICAgICBDb21wb25lbnQ6IENvbXBvbmVudCxcbiAgICAgICAgcmVuZGVyOiByZW5kZXIsXG4gICAgICAgIHJlcmVuZGVyOiByZXJlbmRlcixcbiAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgIH07XG4gICAgaWYgKCd1bmRlZmluZWQnICE9IHR5cGVvZiBtb2R1bGUpIG1vZHVsZS5leHBvcnRzID0gcHJlYWN0OyBlbHNlIHNlbGYucHJlYWN0ID0gcHJlYWN0O1xufSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0LmpzLm1hcCIsIm1vZHVsZS5leHBvcnRzID0gcHJldHRpZXJCeXRlc1xuXG5mdW5jdGlvbiBwcmV0dGllckJ5dGVzIChudW0pIHtcbiAgaWYgKHR5cGVvZiBudW0gIT09ICdudW1iZXInIHx8IGlzTmFOKG51bSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIG51bWJlciwgZ290ICcgKyB0eXBlb2YgbnVtKVxuICB9XG5cbiAgdmFyIG5lZyA9IG51bSA8IDBcbiAgdmFyIHVuaXRzID0gWydCJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJywgJ0VCJywgJ1pCJywgJ1lCJ11cblxuICBpZiAobmVnKSB7XG4gICAgbnVtID0gLW51bVxuICB9XG5cbiAgaWYgKG51bSA8IDEpIHtcbiAgICByZXR1cm4gKG5lZyA/ICctJyA6ICcnKSArIG51bSArICcgQidcbiAgfVxuXG4gIHZhciBleHBvbmVudCA9IE1hdGgubWluKE1hdGguZmxvb3IoTWF0aC5sb2cobnVtKSAvIE1hdGgubG9nKDEwMDApKSwgdW5pdHMubGVuZ3RoIC0gMSlcbiAgbnVtID0gTnVtYmVyKG51bSAvIE1hdGgucG93KDEwMDAsIGV4cG9uZW50KSlcbiAgdmFyIHVuaXQgPSB1bml0c1tleHBvbmVudF1cblxuICBpZiAobnVtID49IDEwIHx8IG51bSAlIDEgPT09IDApIHtcbiAgICAvLyBEbyBub3Qgc2hvdyBkZWNpbWFscyB3aGVuIHRoZSBudW1iZXIgaXMgdHdvLWRpZ2l0LCBvciBpZiB0aGUgbnVtYmVyIGhhcyBub1xuICAgIC8vIGRlY2ltYWwgY29tcG9uZW50LlxuICAgIHJldHVybiAobmVnID8gJy0nIDogJycpICsgbnVtLnRvRml4ZWQoMCkgKyAnICcgKyB1bml0XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIChuZWcgPyAnLScgOiAnJykgKyBudW0udG9GaXhlZCgxKSArICcgJyArIHVuaXRcbiAgfVxufVxuIiwiLyoganNoaW50IG5vZGU6IHRydWUgKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gICMgd2lsZGNhcmRcblxuICBWZXJ5IHNpbXBsZSB3aWxkY2FyZCBtYXRjaGluZywgd2hpY2ggaXMgZGVzaWduZWQgdG8gcHJvdmlkZSB0aGUgc2FtZVxuICBmdW5jdGlvbmFsaXR5IHRoYXQgaXMgZm91bmQgaW4gdGhlXG4gIFtldmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9hZG9iZS13ZWJwbGF0Zm9ybS9ldmUpIGV2ZW50aW5nIGxpYnJhcnkuXG5cbiAgIyMgVXNhZ2VcblxuICBJdCB3b3JrcyB3aXRoIHN0cmluZ3M6XG5cbiAgPDw8IGV4YW1wbGVzL3N0cmluZ3MuanNcblxuICBBcnJheXM6XG5cbiAgPDw8IGV4YW1wbGVzL2FycmF5cy5qc1xuXG4gIE9iamVjdHMgKG1hdGNoaW5nIGFnYWluc3Qga2V5cyk6XG5cbiAgPDw8IGV4YW1wbGVzL29iamVjdHMuanNcblxuICBXaGlsZSB0aGUgbGlicmFyeSB3b3JrcyBpbiBOb2RlLCBpZiB5b3UgYXJlIGFyZSBsb29raW5nIGZvciBmaWxlLWJhc2VkXG4gIHdpbGRjYXJkIG1hdGNoaW5nIHRoZW4geW91IHNob3VsZCBoYXZlIGEgbG9vayBhdDpcblxuICA8aHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9ub2RlLWdsb2I+XG4qKi9cblxuZnVuY3Rpb24gV2lsZGNhcmRNYXRjaGVyKHRleHQsIHNlcGFyYXRvcikge1xuICB0aGlzLnRleHQgPSB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgdGhpcy5oYXNXaWxkID0gfnRleHQuaW5kZXhPZignKicpO1xuICB0aGlzLnNlcGFyYXRvciA9IHNlcGFyYXRvcjtcbiAgdGhpcy5wYXJ0cyA9IHRleHQuc3BsaXQoc2VwYXJhdG9yKTtcbn1cblxuV2lsZGNhcmRNYXRjaGVyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gIHZhciBtYXRjaGVzID0gdHJ1ZTtcbiAgdmFyIHBhcnRzID0gdGhpcy5wYXJ0cztcbiAgdmFyIGlpO1xuICB2YXIgcGFydHNDb3VudCA9IHBhcnRzLmxlbmd0aDtcbiAgdmFyIHRlc3RQYXJ0cztcblxuICBpZiAodHlwZW9mIGlucHV0ID09ICdzdHJpbmcnIHx8IGlucHV0IGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmhhc1dpbGQgJiYgdGhpcy50ZXh0ICE9IGlucHV0KSB7XG4gICAgICBtYXRjaGVzID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlc3RQYXJ0cyA9IChpbnB1dCB8fCAnJykuc3BsaXQodGhpcy5zZXBhcmF0b3IpO1xuICAgICAgZm9yIChpaSA9IDA7IG1hdGNoZXMgJiYgaWkgPCBwYXJ0c0NvdW50OyBpaSsrKSB7XG4gICAgICAgIGlmIChwYXJ0c1tpaV0gPT09ICcqJykgIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmIChpaSA8IHRlc3RQYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICBtYXRjaGVzID0gcGFydHNbaWldID09PSB0ZXN0UGFydHNbaWldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1hdGNoZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJZiBtYXRjaGVzLCB0aGVuIHJldHVybiB0aGUgY29tcG9uZW50IHBhcnRzXG4gICAgICBtYXRjaGVzID0gbWF0Y2hlcyAmJiB0ZXN0UGFydHM7XG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKHR5cGVvZiBpbnB1dC5zcGxpY2UgPT0gJ2Z1bmN0aW9uJykge1xuICAgIG1hdGNoZXMgPSBbXTtcblxuICAgIGZvciAoaWkgPSBpbnB1dC5sZW5ndGg7IGlpLS07ICkge1xuICAgICAgaWYgKHRoaXMubWF0Y2goaW5wdXRbaWldKSkge1xuICAgICAgICBtYXRjaGVzW21hdGNoZXMubGVuZ3RoXSA9IGlucHV0W2lpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGlucHV0ID09ICdvYmplY3QnKSB7XG4gICAgbWF0Y2hlcyA9IHt9O1xuXG4gICAgZm9yICh2YXIga2V5IGluIGlucHV0KSB7XG4gICAgICBpZiAodGhpcy5tYXRjaChrZXkpKSB7XG4gICAgICAgIG1hdGNoZXNba2V5XSA9IGlucHV0W2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1hdGNoZXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRleHQsIHRlc3QsIHNlcGFyYXRvcikge1xuICB2YXIgbWF0Y2hlciA9IG5ldyBXaWxkY2FyZE1hdGNoZXIodGV4dCwgc2VwYXJhdG9yIHx8IC9bXFwvXFwuXS8pO1xuICBpZiAodHlwZW9mIHRlc3QgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gbWF0Y2hlci5tYXRjaCh0ZXN0KTtcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVyO1xufTtcbiIsImNvbnN0IFV0aWxzID0gcmVxdWlyZSgnLi4vY29yZS9VdGlscycpXG5jb25zdCBUcmFuc2xhdG9yID0gcmVxdWlyZSgnLi4vY29yZS9UcmFuc2xhdG9yJylcbmNvbnN0IGVlID0gcmVxdWlyZSgnbmFtZXNwYWNlLWVtaXR0ZXInKVxuY29uc3QgY3VpZCA9IHJlcXVpcmUoJ2N1aWQnKVxuY29uc3QgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKVxuY29uc3QgcHJldHR5Qnl0ZXMgPSByZXF1aXJlKCdwcmV0dGllci1ieXRlcycpXG5jb25zdCBtYXRjaCA9IHJlcXVpcmUoJ21pbWUtbWF0Y2gnKVxuY29uc3QgRGVmYXVsdFN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmUvRGVmYXVsdFN0b3JlJylcbi8vIGNvbnN0IGRlZXBGcmVlemUgPSByZXF1aXJlKCdkZWVwLWZyZWV6ZS1zdHJpY3QnKVxuXG4vKipcbiAqIFVwcHkgQ29yZSBtb2R1bGUuXG4gKiBNYW5hZ2VzIHBsdWdpbnMsIHN0YXRlIHVwZGF0ZXMsIGFjdHMgYXMgYW4gZXZlbnQgYnVzLFxuICogYWRkcy9yZW1vdmVzIGZpbGVzIGFuZCBtZXRhZGF0YS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0cyDigJQgVXBweSBvcHRpb25zXG4gKi9cbmNsYXNzIFVwcHkge1xuICBjb25zdHJ1Y3RvciAob3B0cykge1xuICAgIGNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gICAgICBzdHJpbmdzOiB7XG4gICAgICAgIHlvdUNhbk9ubHlVcGxvYWRYOiB7XG4gICAgICAgICAgMDogJ1lvdSBjYW4gb25seSB1cGxvYWQgJXtzbWFydF9jb3VudH0gZmlsZScsXG4gICAgICAgICAgMTogJ1lvdSBjYW4gb25seSB1cGxvYWQgJXtzbWFydF9jb3VudH0gZmlsZXMnXG4gICAgICAgIH0sXG4gICAgICAgIHlvdUhhdmVUb0F0TGVhc3RTZWxlY3RYOiB7XG4gICAgICAgICAgMDogJ1lvdSBoYXZlIHRvIHNlbGVjdCBhdCBsZWFzdCAle3NtYXJ0X2NvdW50fSBmaWxlJyxcbiAgICAgICAgICAxOiAnWW91IGhhdmUgdG8gc2VsZWN0IGF0IGxlYXN0ICV7c21hcnRfY291bnR9IGZpbGVzJ1xuICAgICAgICB9LFxuICAgICAgICBleGNlZWRzU2l6ZTogJ1RoaXMgZmlsZSBleGNlZWRzIG1heGltdW0gYWxsb3dlZCBzaXplIG9mJyxcbiAgICAgICAgeW91Q2FuT25seVVwbG9hZEZpbGVUeXBlczogJ1lvdSBjYW4gb25seSB1cGxvYWQ6JyxcbiAgICAgICAgdXBweVNlcnZlckVycm9yOiAnQ29ubmVjdGlvbiB3aXRoIFVwcHkgU2VydmVyIGZhaWxlZCdcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBpZDogJ3VwcHknLFxuICAgICAgYXV0b1Byb2NlZWQ6IHRydWUsXG4gICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICByZXN0cmljdGlvbnM6IHtcbiAgICAgICAgbWF4RmlsZVNpemU6IGZhbHNlLFxuICAgICAgICBtYXhOdW1iZXJPZkZpbGVzOiBmYWxzZSxcbiAgICAgICAgbWluTnVtYmVyT2ZGaWxlczogZmFsc2UsXG4gICAgICAgIGFsbG93ZWRGaWxlVHlwZXM6IGZhbHNlXG4gICAgICB9LFxuICAgICAgbWV0YToge30sXG4gICAgICBvbkJlZm9yZUZpbGVBZGRlZDogKGN1cnJlbnRGaWxlLCBmaWxlcykgPT4gUHJvbWlzZS5yZXNvbHZlKCksXG4gICAgICBvbkJlZm9yZVVwbG9hZDogKGZpbGVzLCBkb25lKSA9PiBQcm9taXNlLnJlc29sdmUoKSxcbiAgICAgIGxvY2FsZTogZGVmYXVsdExvY2FsZSxcbiAgICAgIHN0b3JlOiBuZXcgRGVmYXVsdFN0b3JlKCksXG4gICAgICB0aHVtYm5haWxHZW5lcmF0aW9uOiB0cnVlXG4gICAgfVxuXG4gICAgLy8gTWVyZ2UgZGVmYXVsdCBvcHRpb25zIHdpdGggdGhlIG9uZXMgc2V0IGJ5IHVzZXJcbiAgICB0aGlzLm9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0cylcblxuICAgIHRoaXMubG9jYWxlID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdExvY2FsZSwgdGhpcy5vcHRzLmxvY2FsZSlcbiAgICB0aGlzLmxvY2FsZS5zdHJpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdExvY2FsZS5zdHJpbmdzLCB0aGlzLm9wdHMubG9jYWxlLnN0cmluZ3MpXG5cbiAgICAvLyBpMThuXG4gICAgdGhpcy50cmFuc2xhdG9yID0gbmV3IFRyYW5zbGF0b3Ioe2xvY2FsZTogdGhpcy5sb2NhbGV9KVxuICAgIHRoaXMuaTE4biA9IHRoaXMudHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0aGlzLnRyYW5zbGF0b3IpXG5cbiAgICAvLyBDb250YWluZXIgZm9yIGRpZmZlcmVudCB0eXBlcyBvZiBwbHVnaW5zXG4gICAgdGhpcy5wbHVnaW5zID0ge31cblxuICAgIHRoaXMudHJhbnNsYXRvciA9IG5ldyBUcmFuc2xhdG9yKHtsb2NhbGU6IHRoaXMub3B0cy5sb2NhbGV9KVxuICAgIHRoaXMuaTE4biA9IHRoaXMudHJhbnNsYXRvci50cmFuc2xhdGUuYmluZCh0aGlzLnRyYW5zbGF0b3IpXG4gICAgdGhpcy5nZXRTdGF0ZSA9IHRoaXMuZ2V0U3RhdGUuYmluZCh0aGlzKVxuICAgIHRoaXMuZ2V0UGx1Z2luID0gdGhpcy5nZXRQbHVnaW4uYmluZCh0aGlzKVxuICAgIHRoaXMuc2V0RmlsZU1ldGEgPSB0aGlzLnNldEZpbGVNZXRhLmJpbmQodGhpcylcbiAgICB0aGlzLnNldEZpbGVTdGF0ZSA9IHRoaXMuc2V0RmlsZVN0YXRlLmJpbmQodGhpcylcbiAgICB0aGlzLmxvZyA9IHRoaXMubG9nLmJpbmQodGhpcylcbiAgICB0aGlzLmluZm8gPSB0aGlzLmluZm8uYmluZCh0aGlzKVxuICAgIHRoaXMuaGlkZUluZm8gPSB0aGlzLmhpZGVJbmZvLmJpbmQodGhpcylcbiAgICB0aGlzLmFkZEZpbGUgPSB0aGlzLmFkZEZpbGUuYmluZCh0aGlzKVxuICAgIHRoaXMucmVtb3ZlRmlsZSA9IHRoaXMucmVtb3ZlRmlsZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5wYXVzZVJlc3VtZSA9IHRoaXMucGF1c2VSZXN1bWUuYmluZCh0aGlzKVxuICAgIHRoaXMuX2NhbGN1bGF0ZVByb2dyZXNzID0gdGhpcy5fY2FsY3VsYXRlUHJvZ3Jlc3MuYmluZCh0aGlzKVxuICAgIHRoaXMudXBkYXRlT25saW5lU3RhdHVzID0gdGhpcy51cGRhdGVPbmxpbmVTdGF0dXMuYmluZCh0aGlzKVxuICAgIHRoaXMucmVzZXRQcm9ncmVzcyA9IHRoaXMucmVzZXRQcm9ncmVzcy5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLnBhdXNlQWxsID0gdGhpcy5wYXVzZUFsbC5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZXN1bWVBbGwgPSB0aGlzLnJlc3VtZUFsbC5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZXRyeUFsbCA9IHRoaXMucmV0cnlBbGwuYmluZCh0aGlzKVxuICAgIHRoaXMuY2FuY2VsQWxsID0gdGhpcy5jYW5jZWxBbGwuYmluZCh0aGlzKVxuICAgIHRoaXMucmV0cnlVcGxvYWQgPSB0aGlzLnJldHJ5VXBsb2FkLmJpbmQodGhpcylcbiAgICB0aGlzLnVwbG9hZCA9IHRoaXMudXBsb2FkLmJpbmQodGhpcylcblxuICAgIHRoaXMuZW1pdHRlciA9IGVlKClcbiAgICB0aGlzLm9uID0gdGhpcy5lbWl0dGVyLm9uLmJpbmQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMub2ZmID0gdGhpcy5lbWl0dGVyLm9mZi5iaW5kKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLm9uY2UgPSB0aGlzLmVtaXR0ZXIub25jZS5iaW5kKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLmVtaXQgPSB0aGlzLmVtaXR0ZXIuZW1pdC5iaW5kKHRoaXMuZW1pdHRlcilcblxuICAgIHRoaXMucHJlUHJvY2Vzc29ycyA9IFtdXG4gICAgdGhpcy51cGxvYWRlcnMgPSBbXVxuICAgIHRoaXMucG9zdFByb2Nlc3NvcnMgPSBbXVxuXG4gICAgdGhpcy5zdG9yZSA9IHRoaXMub3B0cy5zdG9yZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGx1Z2luczoge30sXG4gICAgICBmaWxlczoge30sXG4gICAgICBjdXJyZW50VXBsb2Fkczoge30sXG4gICAgICBjYXBhYmlsaXRpZXM6IHtcbiAgICAgICAgcmVzdW1hYmxlVXBsb2FkczogZmFsc2VcbiAgICAgIH0sXG4gICAgICB0b3RhbFByb2dyZXNzOiAwLFxuICAgICAgbWV0YTogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRzLm1ldGEpLFxuICAgICAgaW5mbzoge1xuICAgICAgICBpc0hpZGRlbjogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ2luZm8nLFxuICAgICAgICBtZXNzYWdlOiAnJ1xuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLl9zdG9yZVVuc3Vic2NyaWJlID0gdGhpcy5zdG9yZS5zdWJzY3JpYmUoKHByZXZTdGF0ZSwgbmV4dFN0YXRlLCBwYXRjaCkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdzdGF0ZS11cGRhdGUnLCBwcmV2U3RhdGUsIG5leHRTdGF0ZSwgcGF0Y2gpXG4gICAgICB0aGlzLnVwZGF0ZUFsbChuZXh0U3RhdGUpXG4gICAgfSlcblxuICAgIC8vIGZvciBkZWJ1Z2dpbmcgYW5kIHRlc3RpbmdcbiAgICAvLyB0aGlzLnVwZGF0ZU51bSA9IDBcbiAgICBpZiAodGhpcy5vcHRzLmRlYnVnKSB7XG4gICAgICBnbG9iYWwudXBweUxvZyA9ICcnXG4gICAgICBnbG9iYWxbdGhpcy5vcHRzLmlkXSA9IHRoaXNcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZSBvbiBhbGwgcGx1Z2lucyBhbmQgcnVuIGB1cGRhdGVgIG9uIHRoZW0uXG4gICAqIENhbGxlZCBlYWNoIHRpbWUgc3RhdGUgY2hhbmdlcy5cbiAgICpcbiAgICovXG4gIHVwZGF0ZUFsbCAoc3RhdGUpIHtcbiAgICB0aGlzLml0ZXJhdGVQbHVnaW5zKHBsdWdpbiA9PiB7XG4gICAgICBwbHVnaW4udXBkYXRlKHN0YXRlKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBzdGF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge3BhdGNofSBvYmplY3RcbiAgICovXG4gIHNldFN0YXRlIChwYXRjaCkge1xuICAgIHRoaXMuc3RvcmUuc2V0U3RhdGUocGF0Y2gpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBjdXJyZW50IHN0YXRlLlxuICAgKi9cbiAgZ2V0U3RhdGUgKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKClcbiAgfVxuXG4gIC8qKlxuICAqIEJhY2sgY29tcGF0IGZvciB3aGVuIHRoaXMuc3RhdGUgaXMgdXNlZCBpbnN0ZWFkIG9mIHRoaXMuZ2V0U3RhdGUoKS5cbiAgKi9cbiAgZ2V0IHN0YXRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZSgpXG4gIH1cblxuICAvKipcbiAgKiBTaG9ydGhhbmQgdG8gc2V0IHN0YXRlIGZvciBhIHNwZWNpZmljIGZpbGUuXG4gICovXG4gIHNldEZpbGVTdGF0ZSAoZmlsZUlELCBzdGF0ZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0U3RhdGUoKS5maWxlcywge1xuICAgICAgICBbZmlsZUlEXTogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0sIHN0YXRlKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgcmVzZXRQcm9ncmVzcyAoKSB7XG4gICAgY29uc3QgZGVmYXVsdFByb2dyZXNzID0ge1xuICAgICAgcGVyY2VudGFnZTogMCxcbiAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICB1cGxvYWRDb21wbGV0ZTogZmFsc2UsXG4gICAgICB1cGxvYWRTdGFydGVkOiBmYWxzZVxuICAgIH1cbiAgICBjb25zdCBmaWxlcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0U3RhdGUoKS5maWxlcylcbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSB7fVxuICAgIE9iamVjdC5rZXlzKGZpbGVzKS5mb3JFYWNoKGZpbGVJRCA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVkRmlsZSA9IE9iamVjdC5hc3NpZ24oe30sIGZpbGVzW2ZpbGVJRF0pXG4gICAgICB1cGRhdGVkRmlsZS5wcm9ncmVzcyA9IE9iamVjdC5hc3NpZ24oe30sIHVwZGF0ZWRGaWxlLnByb2dyZXNzLCBkZWZhdWx0UHJvZ3Jlc3MpXG4gICAgICB1cGRhdGVkRmlsZXNbZmlsZUlEXSA9IHVwZGF0ZWRGaWxlXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZmlsZXM6IHVwZGF0ZWRGaWxlcyxcbiAgICAgIHRvdGFsUHJvZ3Jlc3M6IDBcbiAgICB9KVxuXG4gICAgLy8gVE9ETyBEb2N1bWVudCBvbiB0aGUgd2Vic2l0ZVxuICAgIHRoaXMuZW1pdCgncmVzZXQtcHJvZ3Jlc3MnKVxuICB9XG5cbiAgYWRkUHJlUHJvY2Vzc29yIChmbikge1xuICAgIHRoaXMucHJlUHJvY2Vzc29ycy5wdXNoKGZuKVxuICB9XG5cbiAgcmVtb3ZlUHJlUHJvY2Vzc29yIChmbikge1xuICAgIGNvbnN0IGkgPSB0aGlzLnByZVByb2Nlc3NvcnMuaW5kZXhPZihmbilcbiAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgIHRoaXMucHJlUHJvY2Vzc29ycy5zcGxpY2UoaSwgMSlcbiAgICB9XG4gIH1cblxuICBhZGRQb3N0UHJvY2Vzc29yIChmbikge1xuICAgIHRoaXMucG9zdFByb2Nlc3NvcnMucHVzaChmbilcbiAgfVxuXG4gIHJlbW92ZVBvc3RQcm9jZXNzb3IgKGZuKSB7XG4gICAgY29uc3QgaSA9IHRoaXMucG9zdFByb2Nlc3NvcnMuaW5kZXhPZihmbilcbiAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgIHRoaXMucG9zdFByb2Nlc3NvcnMuc3BsaWNlKGksIDEpXG4gICAgfVxuICB9XG5cbiAgYWRkVXBsb2FkZXIgKGZuKSB7XG4gICAgdGhpcy51cGxvYWRlcnMucHVzaChmbilcbiAgfVxuXG4gIHJlbW92ZVVwbG9hZGVyIChmbikge1xuICAgIGNvbnN0IGkgPSB0aGlzLnVwbG9hZGVycy5pbmRleE9mKGZuKVxuICAgIGlmIChpICE9PSAtMSkge1xuICAgICAgdGhpcy51cGxvYWRlcnMuc3BsaWNlKGksIDEpXG4gICAgfVxuICB9XG5cbiAgc2V0TWV0YSAoZGF0YSkge1xuICAgIGNvbnN0IHVwZGF0ZWRNZXRhID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTdGF0ZSgpLm1ldGEsIGRhdGEpXG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzKVxuXG4gICAgT2JqZWN0LmtleXModXBkYXRlZEZpbGVzKS5mb3JFYWNoKChmaWxlSUQpID0+IHtcbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0gT2JqZWN0LmFzc2lnbih7fSwgdXBkYXRlZEZpbGVzW2ZpbGVJRF0sIHtcbiAgICAgICAgbWV0YTogT2JqZWN0LmFzc2lnbih7fSwgdXBkYXRlZEZpbGVzW2ZpbGVJRF0ubWV0YSwgZGF0YSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMubG9nKCdBZGRpbmcgbWV0YWRhdGE6JylcbiAgICB0aGlzLmxvZyhkYXRhKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtZXRhOiB1cGRhdGVkTWV0YSxcbiAgICAgIGZpbGVzOiB1cGRhdGVkRmlsZXNcbiAgICB9KVxuICB9XG5cbiAgc2V0RmlsZU1ldGEgKGZpbGVJRCwgZGF0YSkge1xuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0U3RhdGUoKS5maWxlcylcbiAgICBpZiAoIXVwZGF0ZWRGaWxlc1tmaWxlSURdKSB7XG4gICAgICB0aGlzLmxvZygnV2FzIHRyeWluZyB0byBzZXQgbWV0YWRhdGEgZm9yIGEgZmlsZSB0aGF04oCZcyBub3Qgd2l0aCB1cyBhbnltb3JlOiAnLCBmaWxlSUQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgbmV3TWV0YSA9IE9iamVjdC5hc3NpZ24oe30sIHVwZGF0ZWRGaWxlc1tmaWxlSURdLm1ldGEsIGRhdGEpXG4gICAgdXBkYXRlZEZpbGVzW2ZpbGVJRF0gPSBPYmplY3QuYXNzaWduKHt9LCB1cGRhdGVkRmlsZXNbZmlsZUlEXSwge1xuICAgICAgbWV0YTogbmV3TWV0YVxuICAgIH0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7ZmlsZXM6IHVwZGF0ZWRGaWxlc30pXG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgZmlsZSBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlSUQgVGhlIElEIG9mIHRoZSBmaWxlIG9iamVjdCB0byByZXR1cm4uXG4gICAqL1xuICBnZXRGaWxlIChmaWxlSUQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF1cbiAgfVxuXG4gIC8qKlxuICAqIENoZWNrIGlmIG1pbk51bWJlck9mRmlsZXMgcmVzdHJpY3Rpb24gaXMgcmVhY2hlZCBiZWZvcmUgdXBsb2FkaW5nLlxuICAqXG4gICogQHJldHVybiB7Ym9vbGVhbn1cbiAgKiBAcHJpdmF0ZVxuICAqL1xuICBfY2hlY2tNaW5OdW1iZXJPZkZpbGVzICgpIHtcbiAgICBjb25zdCB7bWluTnVtYmVyT2ZGaWxlc30gPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZ2V0U3RhdGUoKS5maWxlcykubGVuZ3RoIDwgbWluTnVtYmVyT2ZGaWxlcykge1xuICAgICAgdGhpcy5pbmZvKGAke3RoaXMuaTE4bigneW91SGF2ZVRvQXRMZWFzdFNlbGVjdFgnLCB7c21hcnRfY291bnQ6IG1pbk51bWJlck9mRmlsZXN9KX1gLCAnZXJyb3InLCA1MDAwKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgKiBDaGVjayBpZiBmaWxlIHBhc3NlcyBhIHNldCBvZiByZXN0cmljdGlvbnMgc2V0IGluIG9wdGlvbnM6IG1heEZpbGVTaXplLFxuICAqIG1heE51bWJlck9mRmlsZXMgYW5kIGFsbG93ZWRGaWxlVHlwZXMuXG4gICpcbiAgKiBAcGFyYW0ge29iamVjdH0gZmlsZSBvYmplY3QgdG8gY2hlY2tcbiAgKiBAcmV0dXJuIHtib29sZWFufVxuICAqIEBwcml2YXRlXG4gICovXG4gIF9jaGVja1Jlc3RyaWN0aW9ucyAoZmlsZSkge1xuICAgIGNvbnN0IHttYXhGaWxlU2l6ZSwgbWF4TnVtYmVyT2ZGaWxlcywgYWxsb3dlZEZpbGVUeXBlc30gPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zXG5cbiAgICBpZiAobWF4TnVtYmVyT2ZGaWxlcykge1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuZ2V0U3RhdGUoKS5maWxlcykubGVuZ3RoICsgMSA+IG1heE51bWJlck9mRmlsZXMpIHtcbiAgICAgICAgdGhpcy5pbmZvKGAke3RoaXMuaTE4bigneW91Q2FuT25seVVwbG9hZFgnLCB7c21hcnRfY291bnQ6IG1heE51bWJlck9mRmlsZXN9KX1gLCAnZXJyb3InLCA1MDAwKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWxsb3dlZEZpbGVUeXBlcykge1xuICAgICAgY29uc3QgaXNDb3JyZWN0RmlsZVR5cGUgPSBhbGxvd2VkRmlsZVR5cGVzLmZpbHRlcigodHlwZSkgPT4ge1xuICAgICAgICBpZiAoIWZpbGUudHlwZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiBtYXRjaChmaWxlLnR5cGUsIHR5cGUpXG4gICAgICB9KS5sZW5ndGggPiAwXG5cbiAgICAgIGlmICghaXNDb3JyZWN0RmlsZVR5cGUpIHtcbiAgICAgICAgY29uc3QgYWxsb3dlZEZpbGVUeXBlc1N0cmluZyA9IGFsbG93ZWRGaWxlVHlwZXMuam9pbignLCAnKVxuICAgICAgICB0aGlzLmluZm8oYCR7dGhpcy5pMThuKCd5b3VDYW5Pbmx5VXBsb2FkRmlsZVR5cGVzJyl9ICR7YWxsb3dlZEZpbGVUeXBlc1N0cmluZ31gLCAnZXJyb3InLCA1MDAwKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWF4RmlsZVNpemUpIHtcbiAgICAgIGlmIChmaWxlLmRhdGEuc2l6ZSA+IG1heEZpbGVTaXplKSB7XG4gICAgICAgIHRoaXMuaW5mbyhgJHt0aGlzLmkxOG4oJ2V4Y2VlZHNTaXplJyl9ICR7cHJldHR5Qnl0ZXMobWF4RmlsZVNpemUpfWAsICdlcnJvcicsIDUwMDApXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgKiBBZGQgYSBuZXcgZmlsZSB0byBgc3RhdGUuZmlsZXNgLiBUaGlzIHdpbGwgcnVuIGBvbkJlZm9yZUZpbGVBZGRlZGAsXG4gICogdHJ5IHRvIGd1ZXNzIGZpbGUgdHlwZSBpbiBhIGNsZXZlciB3YXksIGNoZWNrIGZpbGUgYWdhaW5zdCByZXN0cmljdGlvbnMsXG4gICogYW5kIHN0YXJ0IGFuIHVwbG9hZCBpZiBgYXV0b1Byb2NlZWQgPT09IHRydWVgLlxuICAqXG4gICogQHBhcmFtIHtvYmplY3R9IGZpbGUgb2JqZWN0IHRvIGFkZFxuICAqL1xuICBhZGRGaWxlIChmaWxlKSB7XG4gICAgLy8gV3JhcCB0aGlzIGluIGEgUHJvbWlzZSBgLnRoZW4oKWAgaGFuZGxlciBzbyBlcnJvcnMgd2lsbCByZWplY3QgdGhlIFByb21pc2VcbiAgICAvLyBpbnN0ZWFkIG9mIHRocm93aW5nLlxuICAgIGNvbnN0IGJlZm9yZUZpbGVBZGRlZCA9IFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAudGhlbigoKSA9PiB0aGlzLm9wdHMub25CZWZvcmVGaWxlQWRkZWQoZmlsZSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzKSlcblxuICAgIHJldHVybiBiZWZvcmVGaWxlQWRkZWQuY2F0Y2goKGVycikgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHR5cGVvZiBlcnIgPT09ICdvYmplY3QnID8gZXJyLm1lc3NhZ2UgOiBlcnJcbiAgICAgIHRoaXMuaW5mbyhtZXNzYWdlLCAnZXJyb3InLCA1MDAwKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihgb25CZWZvcmVGaWxlQWRkZWQ6ICR7bWVzc2FnZX1gKSlcbiAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBVdGlscy5nZXRGaWxlVHlwZShmaWxlKS50aGVuKChmaWxlVHlwZSkgPT4ge1xuICAgICAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMpXG4gICAgICAgIGxldCBmaWxlTmFtZVxuICAgICAgICBpZiAoZmlsZS5uYW1lKSB7XG4gICAgICAgICAgZmlsZU5hbWUgPSBmaWxlLm5hbWVcbiAgICAgICAgfSBlbHNlIGlmIChmaWxlVHlwZS5zcGxpdCgnLycpWzBdID09PSAnaW1hZ2UnKSB7XG4gICAgICAgICAgZmlsZU5hbWUgPSBmaWxlVHlwZS5zcGxpdCgnLycpWzBdICsgJy4nICsgZmlsZVR5cGUuc3BsaXQoJy8nKVsxXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpbGVOYW1lID0gJ25vbmFtZSdcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWxlRXh0ZW5zaW9uID0gVXRpbHMuZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24oZmlsZU5hbWUpLmV4dGVuc2lvblxuICAgICAgICBjb25zdCBpc1JlbW90ZSA9IGZpbGUuaXNSZW1vdGUgfHwgZmFsc2VcblxuICAgICAgICBjb25zdCBmaWxlSUQgPSBVdGlscy5nZW5lcmF0ZUZpbGVJRChmaWxlKVxuXG4gICAgICAgIGNvbnN0IG5ld0ZpbGUgPSB7XG4gICAgICAgICAgc291cmNlOiBmaWxlLnNvdXJjZSB8fCAnJyxcbiAgICAgICAgICBpZDogZmlsZUlELFxuICAgICAgICAgIG5hbWU6IGZpbGVOYW1lLFxuICAgICAgICAgIGV4dGVuc2lvbjogZmlsZUV4dGVuc2lvbiB8fCAnJyxcbiAgICAgICAgICBtZXRhOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkubWV0YSwge1xuICAgICAgICAgICAgbmFtZTogZmlsZU5hbWUsXG4gICAgICAgICAgICB0eXBlOiBmaWxlVHlwZVxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHR5cGU6IGZpbGVUeXBlLFxuICAgICAgICAgIGRhdGE6IGZpbGUuZGF0YSxcbiAgICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgICAgcGVyY2VudGFnZTogMCxcbiAgICAgICAgICAgIGJ5dGVzVXBsb2FkZWQ6IDAsXG4gICAgICAgICAgICBieXRlc1RvdGFsOiBmaWxlLmRhdGEuc2l6ZSB8fCAwLFxuICAgICAgICAgICAgdXBsb2FkQ29tcGxldGU6IGZhbHNlLFxuICAgICAgICAgICAgdXBsb2FkU3RhcnRlZDogZmFsc2VcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNpemU6IGZpbGUuZGF0YS5zaXplIHx8ICdOL0EnLFxuICAgICAgICAgIGlzUmVtb3RlOiBpc1JlbW90ZSxcbiAgICAgICAgICByZW1vdGU6IGZpbGUucmVtb3RlIHx8ICcnLFxuICAgICAgICAgIHByZXZpZXc6IGZpbGUucHJldmlld1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNGaWxlQWxsb3dlZCA9IHRoaXMuX2NoZWNrUmVzdHJpY3Rpb25zKG5ld0ZpbGUpXG4gICAgICAgIGlmICghaXNGaWxlQWxsb3dlZCkgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignRmlsZSBub3QgYWxsb3dlZCcpKVxuXG4gICAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0gbmV3RmlsZVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtmaWxlczogdXBkYXRlZEZpbGVzfSlcblxuICAgICAgICB0aGlzLmVtaXQoJ2ZpbGUtYWRkZWQnLCBuZXdGaWxlKVxuICAgICAgICB0aGlzLmxvZyhgQWRkZWQgZmlsZTogJHtmaWxlTmFtZX0sICR7ZmlsZUlEfSwgbWltZSB0eXBlOiAke2ZpbGVUeXBlfWApXG5cbiAgICAgICAgaWYgKHRoaXMub3B0cy5hdXRvUHJvY2VlZCAmJiAhdGhpcy5zY2hlZHVsZWRBdXRvUHJvY2VlZCkge1xuICAgICAgICAgIHRoaXMuc2NoZWR1bGVkQXV0b1Byb2NlZWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVkQXV0b1Byb2NlZWQgPSBudWxsXG4gICAgICAgICAgICB0aGlzLnVwbG9hZCgpLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2sgfHwgZXJyLm1lc3NhZ2UgfHwgZXJyKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9LCA0KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICByZW1vdmVGaWxlIChmaWxlSUQpIHtcbiAgICBjb25zdCB7IGZpbGVzLCBjdXJyZW50VXBsb2FkcyB9ID0gdGhpcy5zdGF0ZVxuICAgIGNvbnN0IHVwZGF0ZWRGaWxlcyA9IE9iamVjdC5hc3NpZ24oe30sIGZpbGVzKVxuICAgIGNvbnN0IHJlbW92ZWRGaWxlID0gdXBkYXRlZEZpbGVzW2ZpbGVJRF1cbiAgICBkZWxldGUgdXBkYXRlZEZpbGVzW2ZpbGVJRF1cblxuICAgIC8vIFJlbW92ZSB0aGlzIGZpbGUgZnJvbSBpdHMgYGN1cnJlbnRVcGxvYWRgLlxuICAgIGNvbnN0IHVwZGF0ZWRVcGxvYWRzID0gT2JqZWN0LmFzc2lnbih7fSwgY3VycmVudFVwbG9hZHMpXG4gICAgY29uc3QgcmVtb3ZlVXBsb2FkcyA9IFtdXG4gICAgT2JqZWN0LmtleXModXBkYXRlZFVwbG9hZHMpLmZvckVhY2goKHVwbG9hZElEKSA9PiB7XG4gICAgICBjb25zdCBuZXdGaWxlSURzID0gY3VycmVudFVwbG9hZHNbdXBsb2FkSURdLmZpbGVJRHMuZmlsdGVyKCh1cGxvYWRGaWxlSUQpID0+IHVwbG9hZEZpbGVJRCAhPT0gZmlsZUlEKVxuICAgICAgLy8gUmVtb3ZlIHRoZSB1cGxvYWQgaWYgbm8gZmlsZXMgYXJlIGFzc29jaWF0ZWQgd2l0aCBpdCBhbnltb3JlLlxuICAgICAgaWYgKG5ld0ZpbGVJRHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJlbW92ZVVwbG9hZHMucHVzaCh1cGxvYWRJRClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZWRVcGxvYWRzW3VwbG9hZElEXSA9IE9iamVjdC5hc3NpZ24oe30sIGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXSwge1xuICAgICAgICBmaWxlSURzOiBuZXdGaWxlSURzXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRVcGxvYWRzOiB1cGRhdGVkVXBsb2FkcyxcbiAgICAgIGZpbGVzOiB1cGRhdGVkRmlsZXNcbiAgICB9KVxuXG4gICAgcmVtb3ZlVXBsb2Fkcy5mb3JFYWNoKCh1cGxvYWRJRCkgPT4ge1xuICAgICAgdGhpcy5fcmVtb3ZlVXBsb2FkKHVwbG9hZElEKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jYWxjdWxhdGVUb3RhbFByb2dyZXNzKClcbiAgICB0aGlzLmVtaXQoJ2ZpbGUtcmVtb3ZlZCcsIGZpbGVJRClcblxuICAgIC8vIENsZWFuIHVwIG9iamVjdCBVUkxzLlxuICAgIGlmIChyZW1vdmVkRmlsZS5wcmV2aWV3ICYmIFV0aWxzLmlzT2JqZWN0VVJMKHJlbW92ZWRGaWxlLnByZXZpZXcpKSB7XG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHJlbW92ZWRGaWxlLnByZXZpZXcpXG4gICAgfVxuXG4gICAgdGhpcy5sb2coYFJlbW92ZWQgZmlsZTogJHtmaWxlSUR9YClcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIHByZXZpZXcgaW1hZ2UgZm9yIHRoZSBnaXZlbiBmaWxlLCBpZiBwb3NzaWJsZS5cbiAgICovXG4gIGdlbmVyYXRlUHJldmlldyAoZmlsZSkge1xuICAgIGlmIChVdGlscy5pc1ByZXZpZXdTdXBwb3J0ZWQoZmlsZS50eXBlKSAmJiAhZmlsZS5pc1JlbW90ZSkge1xuICAgICAgbGV0IHByZXZpZXdQcm9taXNlXG4gICAgICBpZiAodGhpcy5vcHRzLnRodW1ibmFpbEdlbmVyYXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgcHJldmlld1Byb21pc2UgPSBVdGlscy5jcmVhdGVUaHVtYm5haWwoZmlsZSwgMjgwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldmlld1Byb21pc2UgPSBQcm9taXNlLnJlc29sdmUoVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlLmRhdGEpKVxuICAgICAgfVxuICAgICAgcHJldmlld1Byb21pc2UudGhlbigocHJldmlldykgPT4ge1xuICAgICAgICB0aGlzLnNldFByZXZpZXdVUkwoZmlsZS5pZCwgcHJldmlldylcbiAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgY29uc29sZS53YXJuKGVyci5zdGFjayB8fCBlcnIubWVzc2FnZSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcHJldmlldyBVUkwgZm9yIGEgZmlsZS5cbiAgICovXG4gIHNldFByZXZpZXdVUkwgKGZpbGVJRCwgcHJldmlldykge1xuICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGVJRCwgeyBwcmV2aWV3OiBwcmV2aWV3IH0pXG4gIH1cblxuICBwYXVzZVJlc3VtZSAoZmlsZUlEKSB7XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzKVxuXG4gICAgaWYgKHVwZGF0ZWRGaWxlc1tmaWxlSURdLnVwbG9hZENvbXBsZXRlKSByZXR1cm5cblxuICAgIGNvbnN0IHdhc1BhdXNlZCA9IHVwZGF0ZWRGaWxlc1tmaWxlSURdLmlzUGF1c2VkIHx8IGZhbHNlXG4gICAgY29uc3QgaXNQYXVzZWQgPSAhd2FzUGF1c2VkXG5cbiAgICBjb25zdCB1cGRhdGVkRmlsZSA9IE9iamVjdC5hc3NpZ24oe30sIHVwZGF0ZWRGaWxlc1tmaWxlSURdLCB7XG4gICAgICBpc1BhdXNlZDogaXNQYXVzZWRcbiAgICB9KVxuXG4gICAgdXBkYXRlZEZpbGVzW2ZpbGVJRF0gPSB1cGRhdGVkRmlsZVxuICAgIHRoaXMuc2V0U3RhdGUoe2ZpbGVzOiB1cGRhdGVkRmlsZXN9KVxuXG4gICAgdGhpcy5lbWl0KCd1cGxvYWQtcGF1c2UnLCBmaWxlSUQsIGlzUGF1c2VkKVxuXG4gICAgcmV0dXJuIGlzUGF1c2VkXG4gIH1cblxuICBwYXVzZUFsbCAoKSB7XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzKVxuICAgIGNvbnN0IGluUHJvZ3Jlc3NVcGRhdGVkRmlsZXMgPSBPYmplY3Qua2V5cyh1cGRhdGVkRmlsZXMpLmZpbHRlcigoZmlsZSkgPT4ge1xuICAgICAgcmV0dXJuICF1cGRhdGVkRmlsZXNbZmlsZV0ucHJvZ3Jlc3MudXBsb2FkQ29tcGxldGUgJiZcbiAgICAgICAgICAgICB1cGRhdGVkRmlsZXNbZmlsZV0ucHJvZ3Jlc3MudXBsb2FkU3RhcnRlZFxuICAgIH0pXG5cbiAgICBpblByb2dyZXNzVXBkYXRlZEZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZWRGaWxlID0gT2JqZWN0LmFzc2lnbih7fSwgdXBkYXRlZEZpbGVzW2ZpbGVdLCB7XG4gICAgICAgIGlzUGF1c2VkOiB0cnVlXG4gICAgICB9KVxuICAgICAgdXBkYXRlZEZpbGVzW2ZpbGVdID0gdXBkYXRlZEZpbGVcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoe2ZpbGVzOiB1cGRhdGVkRmlsZXN9KVxuXG4gICAgdGhpcy5lbWl0KCdwYXVzZS1hbGwnKVxuICB9XG5cbiAgcmVzdW1lQWxsICgpIHtcbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMpXG4gICAgY29uc3QgaW5Qcm9ncmVzc1VwZGF0ZWRGaWxlcyA9IE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykuZmlsdGVyKChmaWxlKSA9PiB7XG4gICAgICByZXR1cm4gIXVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRDb21wbGV0ZSAmJlxuICAgICAgICAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlXS5wcm9ncmVzcy51cGxvYWRTdGFydGVkXG4gICAgfSlcblxuICAgIGluUHJvZ3Jlc3NVcGRhdGVkRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlZEZpbGUgPSBPYmplY3QuYXNzaWduKHt9LCB1cGRhdGVkRmlsZXNbZmlsZV0sIHtcbiAgICAgICAgaXNQYXVzZWQ6IGZhbHNlLFxuICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgfSlcbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlXSA9IHVwZGF0ZWRGaWxlXG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHtmaWxlczogdXBkYXRlZEZpbGVzfSlcblxuICAgIHRoaXMuZW1pdCgncmVzdW1lLWFsbCcpXG4gIH1cblxuICByZXRyeUFsbCAoKSB7XG4gICAgY29uc3QgdXBkYXRlZEZpbGVzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzKVxuICAgIGNvbnN0IGZpbGVzVG9SZXRyeSA9IE9iamVjdC5rZXlzKHVwZGF0ZWRGaWxlcykuZmlsdGVyKGZpbGUgPT4ge1xuICAgICAgcmV0dXJuIHVwZGF0ZWRGaWxlc1tmaWxlXS5lcnJvclxuICAgIH0pXG5cbiAgICBmaWxlc1RvUmV0cnkuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlZEZpbGUgPSBPYmplY3QuYXNzaWduKHt9LCB1cGRhdGVkRmlsZXNbZmlsZV0sIHtcbiAgICAgICAgaXNQYXVzZWQ6IGZhbHNlLFxuICAgICAgICBlcnJvcjogbnVsbFxuICAgICAgfSlcbiAgICAgIHVwZGF0ZWRGaWxlc1tmaWxlXSA9IHVwZGF0ZWRGaWxlXG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB1cGRhdGVkRmlsZXMsXG4gICAgICBlcnJvcjogbnVsbFxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXQoJ3JldHJ5LWFsbCcsIGZpbGVzVG9SZXRyeSlcblxuICAgIGNvbnN0IHVwbG9hZElEID0gdGhpcy5fY3JlYXRlVXBsb2FkKGZpbGVzVG9SZXRyeSlcbiAgICByZXR1cm4gdGhpcy5fcnVuVXBsb2FkKHVwbG9hZElEKVxuICB9XG5cbiAgY2FuY2VsQWxsICgpIHtcbiAgICB0aGlzLmVtaXQoJ2NhbmNlbC1hbGwnKVxuICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlczoge30sIHRvdGFsUHJvZ3Jlc3M6IDAgfSlcbiAgfVxuXG4gIHJldHJ5VXBsb2FkIChmaWxlSUQpIHtcbiAgICBjb25zdCB1cGRhdGVkRmlsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMpXG4gICAgY29uc3QgdXBkYXRlZEZpbGUgPSBPYmplY3QuYXNzaWduKHt9LCB1cGRhdGVkRmlsZXNbZmlsZUlEXSxcbiAgICAgIHsgZXJyb3I6IG51bGwsIGlzUGF1c2VkOiBmYWxzZSB9XG4gICAgKVxuICAgIHVwZGF0ZWRGaWxlc1tmaWxlSURdID0gdXBkYXRlZEZpbGVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZpbGVzOiB1cGRhdGVkRmlsZXNcbiAgICB9KVxuXG4gICAgdGhpcy5lbWl0KCd1cGxvYWQtcmV0cnknLCBmaWxlSUQpXG5cbiAgICBjb25zdCB1cGxvYWRJRCA9IHRoaXMuX2NyZWF0ZVVwbG9hZChbIGZpbGVJRCBdKVxuICAgIHJldHVybiB0aGlzLl9ydW5VcGxvYWQodXBsb2FkSUQpXG4gIH1cblxuICByZXNldCAoKSB7XG4gICAgdGhpcy5jYW5jZWxBbGwoKVxuICB9XG5cbiAgX2NhbGN1bGF0ZVByb2dyZXNzIChkYXRhKSB7XG4gICAgY29uc3QgZmlsZUlEID0gZGF0YS5pZFxuXG4gICAgLy8gc2tpcCBwcm9ncmVzcyBldmVudCBmb3IgYSBmaWxlIHRoYXTigJlzIGJlZW4gcmVtb3ZlZFxuICAgIGlmICghdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0pIHtcbiAgICAgIHRoaXMubG9nKCdUcnlpbmcgdG8gc2V0IHByb2dyZXNzIGZvciBhIGZpbGUgdGhhdOKAmXMgYmVlbiByZW1vdmVkOiAnLCBmaWxlSUQpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLnNldEZpbGVTdGF0ZShmaWxlSUQsIHtcbiAgICAgIHByb2dyZXNzOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZUlEXS5wcm9ncmVzcywge1xuICAgICAgICBieXRlc1VwbG9hZGVkOiBkYXRhLmJ5dGVzVXBsb2FkZWQsXG4gICAgICAgIGJ5dGVzVG90YWw6IGRhdGEuYnl0ZXNUb3RhbCxcbiAgICAgICAgcGVyY2VudGFnZTogTWF0aC5mbG9vcigoZGF0YS5ieXRlc1VwbG9hZGVkIC8gZGF0YS5ieXRlc1RvdGFsICogMTAwKS50b0ZpeGVkKDIpKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY2FsY3VsYXRlVG90YWxQcm9ncmVzcygpXG4gIH1cblxuICBfY2FsY3VsYXRlVG90YWxQcm9ncmVzcyAoKSB7XG4gICAgLy8gY2FsY3VsYXRlIHRvdGFsIHByb2dyZXNzLCB1c2luZyB0aGUgbnVtYmVyIG9mIGZpbGVzIGN1cnJlbnRseSB1cGxvYWRpbmcsXG4gICAgLy8gbXVsdGlwbGllZCBieSAxMDAgYW5kIHRoZSBzdW1tIG9mIGluZGl2aWR1YWwgcHJvZ3Jlc3Mgb2YgZWFjaCBmaWxlXG4gICAgY29uc3QgZmlsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMpXG5cbiAgICBjb25zdCBpblByb2dyZXNzID0gT2JqZWN0LmtleXMoZmlsZXMpLmZpbHRlcigoZmlsZSkgPT4ge1xuICAgICAgcmV0dXJuIGZpbGVzW2ZpbGVdLnByb2dyZXNzLnVwbG9hZFN0YXJ0ZWRcbiAgICB9KVxuICAgIGNvbnN0IHByb2dyZXNzTWF4ID0gaW5Qcm9ncmVzcy5sZW5ndGggKiAxMDBcbiAgICBsZXQgcHJvZ3Jlc3NBbGwgPSAwXG4gICAgaW5Qcm9ncmVzcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBwcm9ncmVzc0FsbCA9IHByb2dyZXNzQWxsICsgZmlsZXNbZmlsZV0ucHJvZ3Jlc3MucGVyY2VudGFnZVxuICAgIH0pXG5cbiAgICBjb25zdCB0b3RhbFByb2dyZXNzID0gcHJvZ3Jlc3NNYXggPT09IDAgPyAwIDogTWF0aC5mbG9vcigocHJvZ3Jlc3NBbGwgKiAxMDAgLyBwcm9ncmVzc01heCkudG9GaXhlZCgyKSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdG90YWxQcm9ncmVzczogdG90YWxQcm9ncmVzc1xuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGxpc3RlbmVycyBmb3IgYWxsIGdsb2JhbCBhY3Rpb25zLCBsaWtlOlxuICAgKiBgZXJyb3JgLCBgZmlsZS1hZGRlZGAsIGBmaWxlLXJlbW92ZWRgLCBgdXBsb2FkLXByb2dyZXNzYFxuICAgKlxuICAgKi9cbiAgYWN0aW9ucyAoKSB7XG4gICAgLy8gY29uc3QgbG9nID0gdGhpcy5sb2dcbiAgICAvLyB0aGlzLm9uKCcqJywgZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAvLyAgIGxvZyhgW0NvcmVdIEV2ZW50OiAke3RoaXMuZXZlbnR9YClcbiAgICAvLyAgIGxvZyhwYXlsb2FkKVxuICAgIC8vIH0pXG5cbiAgICAvLyBzdHJlc3MtdGVzdCByZS1yZW5kZXJpbmdcbiAgICAvLyBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgLy8gICB0aGlzLnNldFN0YXRlKHtibGE6ICdibGEnfSlcbiAgICAvLyB9LCAyMClcblxuICAgIHRoaXMub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigndXBsb2FkLWVycm9yJywgKGZpbGVJRCwgZXJyb3IpID0+IHtcbiAgICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGVJRCwgeyBlcnJvcjogZXJyb3IubWVzc2FnZSB9KVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yOiBlcnJvci5tZXNzYWdlIH0pXG5cbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0ubmFtZVxuICAgICAgbGV0IG1lc3NhZ2UgPSBgRmFpbGVkIHRvIHVwbG9hZCAke2ZpbGVOYW1lfWBcbiAgICAgIGlmICh0eXBlb2YgZXJyb3IgPT09ICdvYmplY3QnICYmIGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgbWVzc2FnZSA9IHsgbWVzc2FnZTogbWVzc2FnZSwgZGV0YWlsczogZXJyb3IubWVzc2FnZSB9XG4gICAgICB9XG4gICAgICB0aGlzLmluZm8obWVzc2FnZSwgJ2Vycm9yJywgNTAwMClcbiAgICB9KVxuXG4gICAgdGhpcy5vbigndXBsb2FkJywgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yOiBudWxsIH0pXG4gICAgfSlcblxuICAgIC8vIHRoaXMub24oJ2ZpbGUtYWRkJywgKGRhdGEpID0+IHtcbiAgICAvLyAgIHRoaXMuYWRkRmlsZShkYXRhKVxuICAgIC8vIH0pXG5cbiAgICB0aGlzLm9uKCdmaWxlLWFkZGVkJywgKGZpbGUpID0+IHtcbiAgICAgIHRoaXMuZ2VuZXJhdGVQcmV2aWV3KGZpbGUpXG4gICAgfSlcblxuICAgIHRoaXMub24oJ2ZpbGUtcmVtb3ZlJywgKGZpbGVJRCkgPT4ge1xuICAgICAgdGhpcy5yZW1vdmVGaWxlKGZpbGVJRClcbiAgICB9KVxuXG4gICAgdGhpcy5vbigndXBsb2FkLXN0YXJ0ZWQnLCAoZmlsZUlELCB1cGxvYWQpID0+IHtcbiAgICAgIHRoaXMuc2V0RmlsZVN0YXRlKGZpbGVJRCwge1xuICAgICAgICBwcm9ncmVzczogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTdGF0ZSgpLmZpbGVzW2ZpbGVJRF0ucHJvZ3Jlc3MsIHtcbiAgICAgICAgICB1cGxvYWRTdGFydGVkOiBEYXRlLm5vdygpLFxuICAgICAgICAgIHVwbG9hZENvbXBsZXRlOiBmYWxzZSxcbiAgICAgICAgICBwZXJjZW50YWdlOiAwLFxuICAgICAgICAgIGJ5dGVzVXBsb2FkZWQ6IDBcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8vIHVwbG9hZCBwcm9ncmVzcyBldmVudHMgY2FuIG9jY3VyIGZyZXF1ZW50bHksIGVzcGVjaWFsbHkgd2hlbiB5b3UgaGF2ZSBhIGdvb2RcbiAgICAvLyBjb25uZWN0aW9uIHRvIHRoZSByZW1vdGUgc2VydmVyLiBUaGVyZWZvcmUsIHdlIGFyZSB0aHJvdHRlbGluZyB0aGVtIHRvXG4gICAgLy8gcHJldmVudCBhY2Nlc3NpdmUgZnVuY3Rpb24gY2FsbHMuXG4gICAgLy8gc2VlIGFsc286IGh0dHBzOi8vZ2l0aHViLmNvbS90dXMvdHVzLWpzLWNsaWVudC9jb21taXQvOTk0MGYyN2IyMzYxZmQ3ZTEwYmE1OGIwOWI2MGQ4MjQyMjE4M2JiYlxuICAgIGNvbnN0IF90aHJvdHRsZWRDYWxjdWxhdGVQcm9ncmVzcyA9IHRocm90dGxlKHRoaXMuX2NhbGN1bGF0ZVByb2dyZXNzLCAxMDAsIHsgbGVhZGluZzogdHJ1ZSwgdHJhaWxpbmc6IGZhbHNlIH0pXG5cbiAgICB0aGlzLm9uKCd1cGxvYWQtcHJvZ3Jlc3MnLCBfdGhyb3R0bGVkQ2FsY3VsYXRlUHJvZ3Jlc3MpXG5cbiAgICB0aGlzLm9uKCd1cGxvYWQtc3VjY2VzcycsIChmaWxlSUQsIHVwbG9hZFJlc3AsIHVwbG9hZFVSTCkgPT4ge1xuICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZUlELCB7XG4gICAgICAgIHByb2dyZXNzOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZUlEXS5wcm9ncmVzcywge1xuICAgICAgICAgIHVwbG9hZENvbXBsZXRlOiB0cnVlLFxuICAgICAgICAgIHBlcmNlbnRhZ2U6IDEwMFxuICAgICAgICB9KSxcbiAgICAgICAgdXBsb2FkVVJMOiB1cGxvYWRVUkwsXG4gICAgICAgIGlzUGF1c2VkOiBmYWxzZVxuICAgICAgfSlcblxuICAgICAgdGhpcy5fY2FsY3VsYXRlVG90YWxQcm9ncmVzcygpXG4gICAgfSlcblxuICAgIHRoaXMub24oJ3ByZXByb2Nlc3MtcHJvZ3Jlc3MnLCAoZmlsZUlELCBwcm9ncmVzcykgPT4ge1xuICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZUlELCB7XG4gICAgICAgIHByb2dyZXNzOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZUlEXS5wcm9ncmVzcywge1xuICAgICAgICAgIHByZXByb2Nlc3M6IHByb2dyZXNzXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLm9uKCdwcmVwcm9jZXNzLWNvbXBsZXRlJywgKGZpbGVJRCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXMpXG4gICAgICBmaWxlc1tmaWxlSURdID0gT2JqZWN0LmFzc2lnbih7fSwgZmlsZXNbZmlsZUlEXSwge1xuICAgICAgICBwcm9ncmVzczogT2JqZWN0LmFzc2lnbih7fSwgZmlsZXNbZmlsZUlEXS5wcm9ncmVzcylcbiAgICAgIH0pXG4gICAgICBkZWxldGUgZmlsZXNbZmlsZUlEXS5wcm9ncmVzcy5wcmVwcm9jZXNzXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlczogZmlsZXMgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncG9zdHByb2Nlc3MtcHJvZ3Jlc3MnLCAoZmlsZUlELCBwcm9ncmVzcykgPT4ge1xuICAgICAgdGhpcy5zZXRGaWxlU3RhdGUoZmlsZUlELCB7XG4gICAgICAgIHByb2dyZXNzOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuZmlsZXNbZmlsZUlEXS5wcm9ncmVzcywge1xuICAgICAgICAgIHBvc3Rwcm9jZXNzOiBwcm9ncmVzc1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5vbigncG9zdHByb2Nlc3MtY29tcGxldGUnLCAoZmlsZUlEKSA9PiB7XG4gICAgICBjb25zdCBmaWxlcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0U3RhdGUoKS5maWxlcylcbiAgICAgIGZpbGVzW2ZpbGVJRF0gPSBPYmplY3QuYXNzaWduKHt9LCBmaWxlc1tmaWxlSURdLCB7XG4gICAgICAgIHByb2dyZXNzOiBPYmplY3QuYXNzaWduKHt9LCBmaWxlc1tmaWxlSURdLnByb2dyZXNzKVxuICAgICAgfSlcbiAgICAgIGRlbGV0ZSBmaWxlc1tmaWxlSURdLnByb2dyZXNzLnBvc3Rwcm9jZXNzXG4gICAgICAvLyBUT0RPIHNob3VsZCB3ZSBzZXQgc29tZSBraW5kIG9mIGBmdWxseUNvbXBsZXRlYCBwcm9wZXJ0eSBvbiB0aGUgZmlsZSBvYmplY3RcbiAgICAgIC8vIHNvIGl0J3MgZWFzaWVyIHRvIHNlZSB0aGF0IHRoZSBmaWxlIGlzIHVwbG9hZOKApmZ1bGx5IGNvbXBsZXRl4oCmcmF0aGVyIHRoYW5cbiAgICAgIC8vIHdoYXQgd2UgaGF2ZSB0byBkbyBub3cgKGB1cGxvYWRDb21wbGV0ZSAmJiAhcG9zdHByb2Nlc3NgKVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgZmlsZXM6IGZpbGVzIH0pXG4gICAgfSlcblxuICAgIHRoaXMub24oJ3Jlc3RvcmVkJywgKCkgPT4ge1xuICAgICAgLy8gRmlsZXMgbWF5IGhhdmUgY2hhbmdlZC0tZW5zdXJlIHByb2dyZXNzIGlzIHN0aWxsIGFjY3VyYXRlLlxuICAgICAgdGhpcy5fY2FsY3VsYXRlVG90YWxQcm9ncmVzcygpXG4gICAgfSlcblxuICAgIC8vIHNob3cgaW5mb3JtZXIgaWYgb2ZmbGluZVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsICgpID0+IHRoaXMudXBkYXRlT25saW5lU3RhdHVzKCkpXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsICgpID0+IHRoaXMudXBkYXRlT25saW5lU3RhdHVzKCkpXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudXBkYXRlT25saW5lU3RhdHVzKCksIDMwMDApXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlT25saW5lU3RhdHVzICgpIHtcbiAgICBjb25zdCBvbmxpbmUgPVxuICAgICAgdHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICA/IHdpbmRvdy5uYXZpZ2F0b3Iub25MaW5lXG4gICAgICAgIDogdHJ1ZVxuICAgIGlmICghb25saW5lKSB7XG4gICAgICB0aGlzLmVtaXQoJ2lzLW9mZmxpbmUnKVxuICAgICAgdGhpcy5pbmZvKCdObyBpbnRlcm5ldCBjb25uZWN0aW9uJywgJ2Vycm9yJywgMClcbiAgICAgIHRoaXMud2FzT2ZmbGluZSA9IHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0KCdpcy1vbmxpbmUnKVxuICAgICAgaWYgKHRoaXMud2FzT2ZmbGluZSkge1xuICAgICAgICB0aGlzLmVtaXQoJ2JhY2stb25saW5lJylcbiAgICAgICAgdGhpcy5pbmZvKCdDb25uZWN0ZWQhJywgJ3N1Y2Nlc3MnLCAzMDAwKVxuICAgICAgICB0aGlzLndhc09mZmxpbmUgPSBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldElEICgpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRzLmlkXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgcGx1Z2luIHdpdGggQ29yZS5cbiAgICpcbiAgICogQHBhcmFtIHtDbGFzc30gUGx1Z2luIG9iamVjdFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBvYmplY3QgdGhhdCB3aWxsIGJlIHBhc3NlZCB0byBQbHVnaW4gbGF0ZXJcbiAgICogQHJldHVybiB7T2JqZWN0fSBzZWxmIGZvciBjaGFpbmluZ1xuICAgKi9cbiAgdXNlIChQbHVnaW4sIG9wdHMpIHtcbiAgICBpZiAodHlwZW9mIFBsdWdpbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGV0IG1zZyA9IGBFeHBlY3RlZCBhIHBsdWdpbiBjbGFzcywgYnV0IGdvdCAke1BsdWdpbiA9PT0gbnVsbCA/ICdudWxsJyA6IHR5cGVvZiBQbHVnaW59LmAgK1xuICAgICAgICAnIFBsZWFzZSB2ZXJpZnkgdGhhdCB0aGUgcGx1Z2luIHdhcyBpbXBvcnRlZCBhbmQgc3BlbGxlZCBjb3JyZWN0bHkuJ1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihtc2cpXG4gICAgfVxuXG4gICAgLy8gSW5zdGFudGlhdGVcbiAgICBjb25zdCBwbHVnaW4gPSBuZXcgUGx1Z2luKHRoaXMsIG9wdHMpXG4gICAgY29uc3QgcGx1Z2luSWQgPSBwbHVnaW4uaWRcbiAgICB0aGlzLnBsdWdpbnNbcGx1Z2luLnR5cGVdID0gdGhpcy5wbHVnaW5zW3BsdWdpbi50eXBlXSB8fCBbXVxuXG4gICAgaWYgKCFwbHVnaW5JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3VyIHBsdWdpbiBtdXN0IGhhdmUgYW4gaWQnKVxuICAgIH1cblxuICAgIGlmICghcGx1Z2luLnR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91ciBwbHVnaW4gbXVzdCBoYXZlIGEgdHlwZScpXG4gICAgfVxuXG4gICAgbGV0IGV4aXN0c1BsdWdpbkFscmVhZHkgPSB0aGlzLmdldFBsdWdpbihwbHVnaW5JZClcbiAgICBpZiAoZXhpc3RzUGx1Z2luQWxyZWFkeSkge1xuICAgICAgbGV0IG1zZyA9IGBBbHJlYWR5IGZvdW5kIGEgcGx1Z2luIG5hbWVkICcke2V4aXN0c1BsdWdpbkFscmVhZHkuaWR9Jy5cbiAgICAgICAgVHJpZWQgdG8gdXNlOiAnJHtwbHVnaW5JZH0nLlxuICAgICAgICBVcHB5IGlzIGN1cnJlbnRseSBsaW1pdGVkIHRvIHJ1bm5pbmcgb25lIG9mIGV2ZXJ5IHBsdWdpbi5cbiAgICAgICAgU2hhcmUgeW91ciB1c2UgY2FzZSB3aXRoIHVzIG92ZXIgYXRcbiAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tL3RyYW5zbG9hZGl0L3VwcHkvaXNzdWVzL1xuICAgICAgICBpZiB5b3Ugd2FudCB1cyB0byByZWNvbnNpZGVyLmBcbiAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpXG4gICAgfVxuXG4gICAgdGhpcy5wbHVnaW5zW3BsdWdpbi50eXBlXS5wdXNoKHBsdWdpbilcbiAgICBwbHVnaW4uaW5zdGFsbCgpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgb25lIFBsdWdpbiBieSBuYW1lLlxuICAgKlxuICAgKiBAcGFyYW0gc3RyaW5nIG5hbWUgZGVzY3JpcHRpb25cbiAgICovXG4gIGdldFBsdWdpbiAobmFtZSkge1xuICAgIGxldCBmb3VuZFBsdWdpbiA9IGZhbHNlXG4gICAgdGhpcy5pdGVyYXRlUGx1Z2lucygocGx1Z2luKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5OYW1lID0gcGx1Z2luLmlkXG4gICAgICBpZiAocGx1Z2luTmFtZSA9PT0gbmFtZSkge1xuICAgICAgICBmb3VuZFBsdWdpbiA9IHBsdWdpblxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3VuZFBsdWdpblxuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgdGhyb3VnaCBhbGwgYHVzZWBkIHBsdWdpbnMuXG4gICAqXG4gICAqIEBwYXJhbSBmdW5jdGlvbiBtZXRob2QgZGVzY3JpcHRpb25cbiAgICovXG4gIGl0ZXJhdGVQbHVnaW5zIChtZXRob2QpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLnBsdWdpbnMpLmZvckVhY2gocGx1Z2luVHlwZSA9PiB7XG4gICAgICB0aGlzLnBsdWdpbnNbcGx1Z2luVHlwZV0uZm9yRWFjaChtZXRob2QpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmluc3RhbGwgYW5kIHJlbW92ZSBhIHBsdWdpbi5cbiAgICpcbiAgICogQHBhcmFtIHtQbHVnaW59IGluc3RhbmNlIFRoZSBwbHVnaW4gaW5zdGFuY2UgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUGx1Z2luIChpbnN0YW5jZSkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLnBsdWdpbnNbaW5zdGFuY2UudHlwZV1cblxuICAgIGlmIChpbnN0YW5jZS51bmluc3RhbGwpIHtcbiAgICAgIGluc3RhbmNlLnVuaW5zdGFsbCgpXG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSBsaXN0LmluZGV4T2YoaW5zdGFuY2UpXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgbGlzdC5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVuaW5zdGFsbCBhbGwgcGx1Z2lucyBhbmQgY2xvc2UgZG93biB0aGlzIFVwcHkgaW5zdGFuY2UuXG4gICAqL1xuICBjbG9zZSAoKSB7XG4gICAgdGhpcy5yZXNldCgpXG5cbiAgICB0aGlzLl9zdG9yZVVuc3Vic2NyaWJlKClcblxuICAgIHRoaXMuaXRlcmF0ZVBsdWdpbnMoKHBsdWdpbikgPT4ge1xuICAgICAgcGx1Z2luLnVuaW5zdGFsbCgpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAqIFNldCBpbmZvIG1lc3NhZ2UgaW4gYHN0YXRlLmluZm9gLCBzbyB0aGF0IFVJIHBsdWdpbnMgbGlrZSBgSW5mb3JtZXJgXG4gICogY2FuIGRpc3BsYXkgdGhlIG1lc3NhZ2UuXG4gICpcbiAgKiBAcGFyYW0ge3N0cmluZ30gbXNnIE1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkIGJ5IHRoZSBpbmZvcm1lclxuICAqL1xuXG4gIGluZm8gKG1lc3NhZ2UsIHR5cGUgPSAnaW5mbycsIGR1cmF0aW9uID0gMzAwMCkge1xuICAgIGNvbnN0IGlzQ29tcGxleE1lc3NhZ2UgPSB0eXBlb2YgbWVzc2FnZSA9PT0gJ29iamVjdCdcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5mbzoge1xuICAgICAgICBpc0hpZGRlbjogZmFsc2UsXG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIG1lc3NhZ2U6IGlzQ29tcGxleE1lc3NhZ2UgPyBtZXNzYWdlLm1lc3NhZ2UgOiBtZXNzYWdlLFxuICAgICAgICBkZXRhaWxzOiBpc0NvbXBsZXhNZXNzYWdlID8gbWVzc2FnZS5kZXRhaWxzIDogbnVsbFxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXQoJ2luZm8tdmlzaWJsZScpXG5cbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuaW5mb1RpbWVvdXRJRClcbiAgICBpZiAoZHVyYXRpb24gPT09IDApIHtcbiAgICAgIHRoaXMuaW5mb1RpbWVvdXRJRCA9IHVuZGVmaW5lZFxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gaGlkZSB0aGUgaW5mb3JtZXIgYWZ0ZXIgYGR1cmF0aW9uYCBtaWxsaXNlY29uZHNcbiAgICB0aGlzLmluZm9UaW1lb3V0SUQgPSBzZXRUaW1lb3V0KHRoaXMuaGlkZUluZm8sIGR1cmF0aW9uKVxuICB9XG5cbiAgaGlkZUluZm8gKCkge1xuICAgIGNvbnN0IG5ld0luZm8gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFN0YXRlKCkuaW5mbywge1xuICAgICAgaXNIaWRkZW46IHRydWVcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5mbzogbmV3SW5mb1xuICAgIH0pXG4gICAgdGhpcy5lbWl0KCdpbmZvLWhpZGRlbicpXG4gIH1cblxuICAvKipcbiAgICogTG9ncyBzdHVmZiB0byBjb25zb2xlLCBvbmx5IGlmIGBkZWJ1Z2AgaXMgc2V0IHRvIHRydWUuIFNpbGVudCBpbiBwcm9kdWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IG1zZyB0byBsb2dcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgb3B0aW9uYWwgYGVycm9yYCBvciBgd2FybmluZ2BcbiAgICovXG4gIGxvZyAobXNnLCB0eXBlKSB7XG4gICAgaWYgKCF0aGlzLm9wdHMuZGVidWcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxldCBtZXNzYWdlID0gYFtVcHB5XSBbJHtVdGlscy5nZXRUaW1lU3RhbXAoKX1dICR7bXNnfWBcblxuICAgIGdsb2JhbC51cHB5TG9nID0gZ2xvYmFsLnVwcHlMb2cgKyAnXFxuJyArICdERUJVRyBMT0c6ICcgKyBtc2dcblxuICAgIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gJ3dhcm5pbmcnKSB7XG4gICAgICBjb25zb2xlLndhcm4obWVzc2FnZSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChtc2cgPT09IGAke21zZ31gKSB7XG4gICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKVxuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlID0gYFtVcHB5XSBbJHtVdGlscy5nZXRUaW1lU3RhbXAoKX1dYFxuICAgICAgY29uc29sZS5sb2cobWVzc2FnZSlcbiAgICAgIGNvbnNvbGUuZGlyKG1zZylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgYWN0aW9ucy5cbiAgICpcbiAgICovXG4gIHJ1biAoKSB7XG4gICAgdGhpcy5sb2coJ0NvcmUgaXMgcnVuLCBpbml0aWFsaXppbmcgYWN0aW9ucy4uLicpXG4gICAgdGhpcy5hY3Rpb25zKClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogUmVzdG9yZSBhbiB1cGxvYWQgYnkgaXRzIElELlxuICAgKi9cbiAgcmVzdG9yZSAodXBsb2FkSUQpIHtcbiAgICB0aGlzLmxvZyhgQ29yZTogYXR0ZW1wdGluZyB0byByZXN0b3JlIHVwbG9hZCBcIiR7dXBsb2FkSUR9XCJgKVxuXG4gICAgaWYgKCF0aGlzLmdldFN0YXRlKCkuY3VycmVudFVwbG9hZHNbdXBsb2FkSURdKSB7XG4gICAgICB0aGlzLl9yZW1vdmVVcGxvYWQodXBsb2FkSUQpXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdOb25leGlzdGVudCB1cGxvYWQnKSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcnVuVXBsb2FkKHVwbG9hZElEKVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiB1cGxvYWQgZm9yIGEgYnVuY2ggb2YgZmlsZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gZmlsZUlEcyBGaWxlIElEcyB0byBpbmNsdWRlIGluIHRoaXMgdXBsb2FkLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IElEIG9mIHRoaXMgdXBsb2FkLlxuICAgKi9cbiAgX2NyZWF0ZVVwbG9hZCAoZmlsZUlEcykge1xuICAgIGNvbnN0IHVwbG9hZElEID0gY3VpZCgpXG5cbiAgICB0aGlzLmVtaXQoJ3VwbG9hZCcsIHtcbiAgICAgIGlkOiB1cGxvYWRJRCxcbiAgICAgIGZpbGVJRHM6IGZpbGVJRHNcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50VXBsb2FkczogT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRTdGF0ZSgpLmN1cnJlbnRVcGxvYWRzLCB7XG4gICAgICAgIFt1cGxvYWRJRF06IHtcbiAgICAgICAgICBmaWxlSURzOiBmaWxlSURzLFxuICAgICAgICAgIHN0ZXA6IDBcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIHVwbG9hZElEXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuIHVwbG9hZCwgZWcuIGlmIGl0IGhhcyBiZWVuIGNhbmNlbGVkIG9yIGNvbXBsZXRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZElEIFRoZSBJRCBvZiB0aGUgdXBsb2FkLlxuICAgKi9cbiAgX3JlbW92ZVVwbG9hZCAodXBsb2FkSUQpIHtcbiAgICBjb25zdCBjdXJyZW50VXBsb2FkcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0U3RhdGUoKS5jdXJyZW50VXBsb2FkcylcbiAgICBkZWxldGUgY3VycmVudFVwbG9hZHNbdXBsb2FkSURdXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRVcGxvYWRzOiBjdXJyZW50VXBsb2Fkc1xuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogUnVuIGFuIHVwbG9hZC4gVGhpcyBwaWNrcyB1cCB3aGVyZSBpdCBsZWZ0IG9mZiBpbiBjYXNlIHRoZSB1cGxvYWQgaXMgYmVpbmcgcmVzdG9yZWQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcnVuVXBsb2FkICh1cGxvYWRJRCkge1xuICAgIGNvbnN0IHVwbG9hZERhdGEgPSB0aGlzLmdldFN0YXRlKCkuY3VycmVudFVwbG9hZHNbdXBsb2FkSURdXG4gICAgY29uc3QgZmlsZUlEcyA9IHVwbG9hZERhdGEuZmlsZUlEc1xuICAgIGNvbnN0IHJlc3RvcmVTdGVwID0gdXBsb2FkRGF0YS5zdGVwXG5cbiAgICBjb25zdCBzdGVwcyA9IFtcbiAgICAgIC4uLnRoaXMucHJlUHJvY2Vzc29ycyxcbiAgICAgIC4uLnRoaXMudXBsb2FkZXJzLFxuICAgICAgLi4udGhpcy5wb3N0UHJvY2Vzc29yc1xuICAgIF1cbiAgICBsZXQgbGFzdFN0ZXAgPSBQcm9taXNlLnJlc29sdmUoKVxuICAgIHN0ZXBzLmZvckVhY2goKGZuLCBzdGVwKSA9PiB7XG4gICAgICAvLyBTa2lwIHRoaXMgc3RlcCBpZiB3ZSBhcmUgcmVzdG9yaW5nIGFuZCBoYXZlIGFscmVhZHkgY29tcGxldGVkIHRoaXMgc3RlcCBiZWZvcmUuXG4gICAgICBpZiAoc3RlcCA8IHJlc3RvcmVTdGVwKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsYXN0U3RlcCA9IGxhc3RTdGVwLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRVcGxvYWRzIH0gPSB0aGlzLmdldFN0YXRlKClcbiAgICAgICAgY29uc3QgY3VycmVudFVwbG9hZCA9IE9iamVjdC5hc3NpZ24oe30sIGN1cnJlbnRVcGxvYWRzW3VwbG9hZElEXSwge1xuICAgICAgICAgIHN0ZXA6IHN0ZXBcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY3VycmVudFVwbG9hZHM6IE9iamVjdC5hc3NpZ24oe30sIGN1cnJlbnRVcGxvYWRzLCB7XG4gICAgICAgICAgICBbdXBsb2FkSURdOiBjdXJyZW50VXBsb2FkXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgLy8gVE9ETyBnaXZlIHRoaXMgdGhlIGBjdXJyZW50VXBsb2FkYCBvYmplY3QgYXMgaXRzIG9ubHkgcGFyYW1ldGVyIG1heWJlP1xuICAgICAgICAvLyBPdGhlcndpc2Ugd2hlbiBtb3JlIG1ldGFkYXRhIG1heSBiZSBhZGRlZCB0byB0aGUgdXBsb2FkIHRoaXMgd291bGQga2VlcCBnZXR0aW5nIG1vcmUgcGFyYW1ldGVyc1xuICAgICAgICByZXR1cm4gZm4oZmlsZUlEcywgdXBsb2FkSUQpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyBOb3QgcmV0dXJuaW5nIHRoZSBgY2F0Y2hgZWQgcHJvbWlzZSwgYmVjYXVzZSB3ZSBzdGlsbCB3YW50IHRvIHJldHVybiBhIHJlamVjdGVkXG4gICAgLy8gcHJvbWlzZSBmcm9tIHRoaXMgbWV0aG9kIGlmIHRoZSB1cGxvYWQgZmFpbGVkLlxuICAgIGxhc3RTdGVwLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpXG5cbiAgICAgIHRoaXMuX3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcbiAgICB9KVxuXG4gICAgcmV0dXJuIGxhc3RTdGVwLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBmaWxlSURzLm1hcCgoZmlsZUlEKSA9PiB0aGlzLmdldEZpbGUoZmlsZUlEKSlcbiAgICAgIGNvbnN0IHN1Y2Nlc3NmdWwgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUgJiYgIWZpbGUuZXJyb3IpXG4gICAgICBjb25zdCBmYWlsZWQgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+IGZpbGUgJiYgZmlsZS5lcnJvcilcbiAgICAgIHRoaXMuZW1pdCgnY29tcGxldGUnLCB7IHN1Y2Nlc3NmdWwsIGZhaWxlZCB9KVxuXG4gICAgICAvLyBDb21wYXRpYmlsaXR5IHdpdGggcHJlLTAuMjFcbiAgICAgIHRoaXMuZW1pdCgnc3VjY2VzcycsIGZpbGVJRHMpXG5cbiAgICAgIHRoaXMuX3JlbW92ZVVwbG9hZCh1cGxvYWRJRClcblxuICAgICAgcmV0dXJuIHsgc3VjY2Vzc2Z1bCwgZmFpbGVkIH1cbiAgICB9KVxuICB9XG5cbiAgICAvKipcbiAgICogU3RhcnQgYW4gdXBsb2FkIGZvciBhbGwgdGhlIGZpbGVzIHRoYXQgYXJlIG5vdCBjdXJyZW50bHkgYmVpbmcgdXBsb2FkZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqL1xuICB1cGxvYWQgKCkge1xuICAgIGlmICghdGhpcy5wbHVnaW5zLnVwbG9hZGVyKSB7XG4gICAgICB0aGlzLmxvZygnTm8gdXBsb2FkZXIgdHlwZSBwbHVnaW5zIGFyZSB1c2VkJywgJ3dhcm5pbmcnKVxuICAgIH1cblxuICAgIGNvbnN0IGlzTWluTnVtYmVyT2ZGaWxlc1JlYWNoZWQgPSB0aGlzLl9jaGVja01pbk51bWJlck9mRmlsZXMoKVxuICAgIGlmICghaXNNaW5OdW1iZXJPZkZpbGVzUmVhY2hlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignTWluaW11bSBudW1iZXIgb2YgZmlsZXMgaGFzIG5vdCBiZWVuIHJlYWNoZWQnKSlcbiAgICB9XG5cbiAgICBjb25zdCBiZWZvcmVVcGxvYWQgPSBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgLnRoZW4oKCkgPT4gdGhpcy5vcHRzLm9uQmVmb3JlVXBsb2FkKHRoaXMuZ2V0U3RhdGUoKS5maWxlcykpXG5cbiAgICByZXR1cm4gYmVmb3JlVXBsb2FkLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0eXBlb2YgZXJyID09PSAnb2JqZWN0JyA/IGVyci5tZXNzYWdlIDogZXJyXG4gICAgICB0aGlzLmluZm8obWVzc2FnZSwgJ2Vycm9yJywgNTAwMClcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYG9uQmVmb3JlVXBsb2FkOiAke21lc3NhZ2V9YCkpXG4gICAgfSkudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCB3YWl0aW5nRmlsZUlEcyA9IFtdXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmdldFN0YXRlKCkuZmlsZXMpLmZvckVhY2goKGZpbGVJRCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5nZXRGaWxlKGZpbGVJRClcblxuICAgICAgICBpZiAoIWZpbGUucHJvZ3Jlc3MudXBsb2FkU3RhcnRlZCkge1xuICAgICAgICAgIHdhaXRpbmdGaWxlSURzLnB1c2goZmlsZS5pZClcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgY29uc3QgdXBsb2FkSUQgPSB0aGlzLl9jcmVhdGVVcGxvYWQod2FpdGluZ0ZpbGVJRHMpXG4gICAgICByZXR1cm4gdGhpcy5fcnVuVXBsb2FkKHVwbG9hZElEKVxuICAgIH0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0cykge1xuICByZXR1cm4gbmV3IFVwcHkob3B0cylcbn1cbi8vIEV4cG9zZSBjbGFzcyBjb25zdHJ1Y3Rvci5cbm1vZHVsZS5leHBvcnRzLlVwcHkgPSBVcHB5XG4iLCJjb25zdCBwcmVhY3QgPSByZXF1aXJlKCdwcmVhY3QnKVxuY29uc3QgeyBmaW5kRE9NRWxlbWVudCB9ID0gcmVxdWlyZSgnLi4vY29yZS9VdGlscycpXG5cbi8qKlxuICogQm9pbGVycGxhdGUgdGhhdCBhbGwgUGx1Z2lucyBzaGFyZSAtIGFuZCBzaG91bGQgbm90IGJlIHVzZWRcbiAqIGRpcmVjdGx5LiBJdCBhbHNvIHNob3dzIHdoaWNoIG1ldGhvZHMgZmluYWwgcGx1Z2lucyBzaG91bGQgaW1wbGVtZW50L292ZXJyaWRlLFxuICogdGhpcyBkZWNpZGluZyBvbiBzdHJ1Y3R1cmUuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG1haW4gVXBweSBjb3JlIG9iamVjdFxuICogQHBhcmFtIHtvYmplY3R9IG9iamVjdCB3aXRoIHBsdWdpbiBvcHRpb25zXG4gKiBAcmV0dXJuIHthcnJheSB8IHN0cmluZ30gZmlsZXMgb3Igc3VjY2Vzcy9mYWlsIG1lc3NhZ2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQbHVnaW4ge1xuICBjb25zdHJ1Y3RvciAodXBweSwgb3B0cykge1xuICAgIHRoaXMudXBweSA9IHVwcHlcbiAgICB0aGlzLm9wdHMgPSBvcHRzIHx8IHt9XG5cbiAgICB0aGlzLnVwZGF0ZSA9IHRoaXMudXBkYXRlLmJpbmQodGhpcylcbiAgICB0aGlzLm1vdW50ID0gdGhpcy5tb3VudC5iaW5kKHRoaXMpXG4gICAgdGhpcy5pbnN0YWxsID0gdGhpcy5pbnN0YWxsLmJpbmQodGhpcylcbiAgICB0aGlzLnVuaW5zdGFsbCA9IHRoaXMudW5pbnN0YWxsLmJpbmQodGhpcylcbiAgfVxuXG4gIGdldFBsdWdpblN0YXRlICgpIHtcbiAgICByZXR1cm4gdGhpcy51cHB5LnN0YXRlLnBsdWdpbnNbdGhpcy5pZF1cbiAgfVxuXG4gIHNldFBsdWdpblN0YXRlICh1cGRhdGUpIHtcbiAgICBjb25zdCBwbHVnaW5zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy51cHB5LnN0YXRlLnBsdWdpbnMpXG4gICAgcGx1Z2luc1t0aGlzLmlkXSA9IE9iamVjdC5hc3NpZ24oe30sIHBsdWdpbnNbdGhpcy5pZF0sIHVwZGF0ZSlcblxuICAgIHRoaXMudXBweS5zZXRTdGF0ZSh7XG4gICAgICBwbHVnaW5zOiBwbHVnaW5zXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZSAoc3RhdGUpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuZWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGhpcy51cGRhdGVVSSkge1xuICAgICAgdGhpcy51cGRhdGVVSShzdGF0ZSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgc3VwcGxpZWQgYHRhcmdldGAgaXMgYSBET00gZWxlbWVudCBvciBhbiBgb2JqZWN0YC5cbiAgICogSWYgaXTigJlzIGFuIG9iamVjdCDigJQgdGFyZ2V0IGlzIGEgcGx1Z2luLCBhbmQgd2Ugc2VhcmNoIGBwbHVnaW5zYFxuICAgKiBmb3IgYSBwbHVnaW4gd2l0aCBzYW1lIG5hbWUgYW5kIHJldHVybiBpdHMgdGFyZ2V0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IHRhcmdldFxuICAgKlxuICAgKi9cbiAgbW91bnQgKHRhcmdldCwgcGx1Z2luKSB7XG4gICAgY29uc3QgY2FsbGVyUGx1Z2luTmFtZSA9IHBsdWdpbi5pZFxuXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGZpbmRET01FbGVtZW50KHRhcmdldClcblxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICB0aGlzLnVwZGF0ZVVJID0gKHN0YXRlKSA9PiB7XG4gICAgICAgIHRoaXMuZWwgPSBwcmVhY3QucmVuZGVyKHRoaXMucmVuZGVyKHN0YXRlKSwgdGFyZ2V0RWxlbWVudCwgdGhpcy5lbClcbiAgICAgIH1cblxuICAgICAgdGhpcy51cHB5LmxvZyhgSW5zdGFsbGluZyAke2NhbGxlclBsdWdpbk5hbWV9IHRvIGEgRE9NIGVsZW1lbnRgKVxuXG4gICAgICAvLyBjbGVhciBldmVyeXRoaW5nIGluc2lkZSB0aGUgdGFyZ2V0IGNvbnRhaW5lclxuICAgICAgaWYgKHRoaXMub3B0cy5yZXBsYWNlVGFyZ2V0Q29udGVudCkge1xuICAgICAgICB0YXJnZXRFbGVtZW50LmlubmVySFRNTCA9ICcnXG4gICAgICB9XG5cbiAgICAgIHRoaXMuZWwgPSBwcmVhY3QucmVuZGVyKHRoaXMucmVuZGVyKHRoaXMudXBweS5zdGF0ZSksIHRhcmdldEVsZW1lbnQpXG5cbiAgICAgIHJldHVybiB0aGlzLmVsXG4gICAgfVxuXG4gICAgbGV0IHRhcmdldFBsdWdpblxuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0JyAmJiB0YXJnZXQgaW5zdGFuY2VvZiBQbHVnaW4pIHtcbiAgICAgIC8vIFRhcmdldGluZyBhIHBsdWdpbiAqaW5zdGFuY2UqXG4gICAgICB0YXJnZXRQbHVnaW4gPSB0YXJnZXRcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIFRhcmdldGluZyBhIHBsdWdpbiB0eXBlXG4gICAgICBjb25zdCBUYXJnZXQgPSB0YXJnZXRcbiAgICAgIC8vIEZpbmQgdGhlIHRhcmdldCBwbHVnaW4gaW5zdGFuY2UuXG4gICAgICB0aGlzLnVwcHkuaXRlcmF0ZVBsdWdpbnMoKHBsdWdpbikgPT4ge1xuICAgICAgICBpZiAocGx1Z2luIGluc3RhbmNlb2YgVGFyZ2V0KSB7XG4gICAgICAgICAgdGFyZ2V0UGx1Z2luID0gcGx1Z2luXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKHRhcmdldFBsdWdpbikge1xuICAgICAgY29uc3QgdGFyZ2V0UGx1Z2luTmFtZSA9IHRhcmdldFBsdWdpbi5pZFxuICAgICAgdGhpcy51cHB5LmxvZyhgSW5zdGFsbGluZyAke2NhbGxlclBsdWdpbk5hbWV9IHRvICR7dGFyZ2V0UGx1Z2luTmFtZX1gKVxuICAgICAgdGhpcy5lbCA9IHRhcmdldFBsdWdpbi5hZGRUYXJnZXQocGx1Z2luKVxuICAgICAgcmV0dXJuIHRoaXMuZWxcbiAgICB9XG5cbiAgICB0aGlzLnVwcHkubG9nKGBOb3QgaW5zdGFsbGluZyAke2NhbGxlclBsdWdpbk5hbWV9YClcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGFyZ2V0IG9wdGlvbiBnaXZlbiB0byAke2NhbGxlclBsdWdpbk5hbWV9YClcbiAgfVxuXG4gIHJlbmRlciAoc3RhdGUpIHtcbiAgICB0aHJvdyAobmV3IEVycm9yKCdFeHRlbmQgdGhlIHJlbmRlciBtZXRob2QgdG8gYWRkIHlvdXIgcGx1Z2luIHRvIGEgRE9NIGVsZW1lbnQnKSlcbiAgfVxuXG4gIGFkZFRhcmdldCAocGx1Z2luKSB7XG4gICAgdGhyb3cgKG5ldyBFcnJvcignRXh0ZW5kIHRoZSBhZGRUYXJnZXQgbWV0aG9kIHRvIGFkZCB5b3VyIHBsdWdpbiB0byBhbm90aGVyIHBsdWdpblxcJ3MgdGFyZ2V0JykpXG4gIH1cblxuICB1bm1vdW50ICgpIHtcbiAgICBpZiAodGhpcy5lbCAmJiB0aGlzLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMuZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsKVxuICAgIH1cbiAgICAvLyB0aGlzLnRhcmdldCA9IG51bGxcbiAgfVxuXG4gIGluc3RhbGwgKCkge1xuXG4gIH1cblxuICB1bmluc3RhbGwgKCkge1xuICAgIHRoaXMudW5tb3VudCgpXG4gIH1cbn1cbiIsIi8qKlxuICogVHJhbnNsYXRlcyBzdHJpbmdzIHdpdGggaW50ZXJwb2xhdGlvbiAmIHBsdXJhbGl6YXRpb24gc3VwcG9ydC5cbiAqIEV4dGVuc2libGUgd2l0aCBjdXN0b20gZGljdGlvbmFyaWVzIGFuZCBwbHVyYWxpemF0aW9uIGZ1bmN0aW9ucy5cbiAqXG4gKiBCb3Jyb3dzIGhlYXZpbHkgZnJvbSBhbmQgaW5zcGlyZWQgYnkgUG9seWdsb3QgaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcyxcbiAqIGJhc2ljYWxseSBhIHN0cmlwcGVkLWRvd24gdmVyc2lvbiBvZiBpdC4gRGlmZmVyZW5jZXM6IHBsdXJhbGl6YXRpb24gZnVuY3Rpb25zIGFyZSBub3QgaGFyZGNvZGVkXG4gKiBhbmQgY2FuIGJlIGVhc2lseSBhZGRlZCBhbW9uZyB3aXRoIGRpY3Rpb25hcmllcywgbmVzdGVkIG9iamVjdHMgYXJlIHVzZWQgZm9yIHBsdXJhbGl6YXRpb25cbiAqIGFzIG9wcG9zZWQgdG8gYHx8fHxgIGRlbGltZXRlclxuICpcbiAqIFVzYWdlIGV4YW1wbGU6IGB0cmFuc2xhdG9yLnRyYW5zbGF0ZSgnZmlsZXNfY2hvc2VuJywge3NtYXJ0X2NvdW50OiAzfSlgXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9wdHNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUcmFuc2xhdG9yIHtcbiAgY29uc3RydWN0b3IgKG9wdHMpIHtcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGxvY2FsZToge1xuICAgICAgICBzdHJpbmdzOiB7fSxcbiAgICAgICAgcGx1cmFsaXplOiBmdW5jdGlvbiAobikge1xuICAgICAgICAgIGlmIChuID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gMVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdHMpXG4gICAgdGhpcy5sb2NhbGUgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucy5sb2NhbGUsIG9wdHMubG9jYWxlKVxuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5vcHRzLmxvY2FsZSlcblxuICAgIC8vIHRoaXMubG9jYWxlLnBsdXJhbGl6ZSA9IHRoaXMubG9jYWxlID8gdGhpcy5sb2NhbGUucGx1cmFsaXplIDogZGVmYXVsdFBsdXJhbGl6ZVxuICAgIC8vIHRoaXMubG9jYWxlLnN0cmluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBlbl9VUy5zdHJpbmdzLCB0aGlzLm9wdHMubG9jYWxlLnN0cmluZ3MpXG4gIH1cblxuLyoqXG4gKiBUYWtlcyBhIHN0cmluZyB3aXRoIHBsYWNlaG9sZGVyIHZhcmlhYmxlcyBsaWtlIGAle3NtYXJ0X2NvdW50fSBmaWxlIHNlbGVjdGVkYFxuICogYW5kIHJlcGxhY2VzIGl0IHdpdGggdmFsdWVzIGZyb20gb3B0aW9ucyBge3NtYXJ0X2NvdW50OiA1fWBcbiAqXG4gKiBAbGljZW5zZSBodHRwczovL2dpdGh1Yi5jb20vYWlyYm5iL3BvbHlnbG90LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqIHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2FpcmJuYi9wb2x5Z2xvdC5qcy9ibG9iL21hc3Rlci9saWIvcG9seWdsb3QuanMjTDI5OVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwaHJhc2UgdGhhdCBuZWVkcyBpbnRlcnBvbGF0aW9uLCB3aXRoIHBsYWNlaG9sZGVyc1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgd2l0aCB2YWx1ZXMgdGhhdCB3aWxsIGJlIHVzZWQgdG8gcmVwbGFjZSBwbGFjZWhvbGRlcnNcbiAqIEByZXR1cm4ge3N0cmluZ30gaW50ZXJwb2xhdGVkXG4gKi9cbiAgaW50ZXJwb2xhdGUgKHBocmFzZSwgb3B0aW9ucykge1xuICAgIGNvbnN0IHJlcGxhY2UgPSBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VcbiAgICBjb25zdCBkb2xsYXJSZWdleCA9IC9cXCQvZ1xuICAgIGNvbnN0IGRvbGxhckJpbGxzWWFsbCA9ICckJCQkJ1xuXG4gICAgZm9yIChsZXQgYXJnIGluIG9wdGlvbnMpIHtcbiAgICAgIGlmIChhcmcgIT09ICdfJyAmJiBvcHRpb25zLmhhc093blByb3BlcnR5KGFyZykpIHtcbiAgICAgICAgLy8gRW5zdXJlIHJlcGxhY2VtZW50IHZhbHVlIGlzIGVzY2FwZWQgdG8gcHJldmVudCBzcGVjaWFsICQtcHJlZml4ZWRcbiAgICAgICAgLy8gcmVnZXggcmVwbGFjZSB0b2tlbnMuIHRoZSBcIiQkJCRcIiBpcyBuZWVkZWQgYmVjYXVzZSBlYWNoIFwiJFwiIG5lZWRzIHRvXG4gICAgICAgIC8vIGJlIGVzY2FwZWQgd2l0aCBcIiRcIiBpdHNlbGYsIGFuZCB3ZSBuZWVkIHR3byBpbiB0aGUgcmVzdWx0aW5nIG91dHB1dC5cbiAgICAgICAgdmFyIHJlcGxhY2VtZW50ID0gb3B0aW9uc1thcmddXG4gICAgICAgIGlmICh0eXBlb2YgcmVwbGFjZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcmVwbGFjZW1lbnQgPSByZXBsYWNlLmNhbGwob3B0aW9uc1thcmddLCBkb2xsYXJSZWdleCwgZG9sbGFyQmlsbHNZYWxsKVxuICAgICAgICB9XG4gICAgICAgIC8vIFdlIGNyZWF0ZSBhIG5ldyBgUmVnRXhwYCBlYWNoIHRpbWUgaW5zdGVhZCBvZiB1c2luZyBhIG1vcmUtZWZmaWNpZW50XG4gICAgICAgIC8vIHN0cmluZyByZXBsYWNlIHNvIHRoYXQgdGhlIHNhbWUgYXJndW1lbnQgY2FuIGJlIHJlcGxhY2VkIG11bHRpcGxlIHRpbWVzXG4gICAgICAgIC8vIGluIHRoZSBzYW1lIHBocmFzZS5cbiAgICAgICAgcGhyYXNlID0gcmVwbGFjZS5jYWxsKHBocmFzZSwgbmV3IFJlZ0V4cCgnJVxcXFx7JyArIGFyZyArICdcXFxcfScsICdnJyksIHJlcGxhY2VtZW50KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGhyYXNlXG4gIH1cblxuLyoqXG4gKiBQdWJsaWMgdHJhbnNsYXRlIG1ldGhvZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIHdpdGggdmFsdWVzIHRoYXQgd2lsbCBiZSB1c2VkIGxhdGVyIHRvIHJlcGxhY2UgcGxhY2Vob2xkZXJzIGluIHN0cmluZ1xuICogQHJldHVybiB7c3RyaW5nfSB0cmFuc2xhdGVkIChhbmQgaW50ZXJwb2xhdGVkKVxuICovXG4gIHRyYW5zbGF0ZSAoa2V5LCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5zbWFydF9jb3VudCkge1xuICAgICAgdmFyIHBsdXJhbCA9IHRoaXMubG9jYWxlLnBsdXJhbGl6ZShvcHRpb25zLnNtYXJ0X2NvdW50KVxuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJwb2xhdGUodGhpcy5vcHRzLmxvY2FsZS5zdHJpbmdzW2tleV1bcGx1cmFsXSwgb3B0aW9ucylcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbnRlcnBvbGF0ZSh0aGlzLm9wdHMubG9jYWxlLnN0cmluZ3Nba2V5XSwgb3B0aW9ucylcbiAgfVxufVxuIiwiY29uc3QgZWUgPSByZXF1aXJlKCduYW1lc3BhY2UtZW1pdHRlcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVXBweVNvY2tldCB7XG4gIGNvbnN0cnVjdG9yIChvcHRzKSB7XG4gICAgdGhpcy5xdWV1ZWQgPSBbXVxuICAgIHRoaXMuaXNPcGVuID0gZmFsc2VcbiAgICB0aGlzLnNvY2tldCA9IG5ldyBXZWJTb2NrZXQob3B0cy50YXJnZXQpXG4gICAgdGhpcy5lbWl0dGVyID0gZWUoKVxuXG4gICAgdGhpcy5zb2NrZXQub25vcGVuID0gKGUpID0+IHtcbiAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZVxuXG4gICAgICB3aGlsZSAodGhpcy5xdWV1ZWQubGVuZ3RoID4gMCAmJiB0aGlzLmlzT3Blbikge1xuICAgICAgICBjb25zdCBmaXJzdCA9IHRoaXMucXVldWVkWzBdXG4gICAgICAgIHRoaXMuc2VuZChmaXJzdC5hY3Rpb24sIGZpcnN0LnBheWxvYWQpXG4gICAgICAgIHRoaXMucXVldWVkID0gdGhpcy5xdWV1ZWQuc2xpY2UoMSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gKGUpID0+IHtcbiAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2VcbiAgICB9XG5cbiAgICB0aGlzLl9oYW5kbGVNZXNzYWdlID0gdGhpcy5faGFuZGxlTWVzc2FnZS5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLnNvY2tldC5vbm1lc3NhZ2UgPSB0aGlzLl9oYW5kbGVNZXNzYWdlXG5cbiAgICB0aGlzLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5lbWl0ID0gdGhpcy5lbWl0LmJpbmQodGhpcylcbiAgICB0aGlzLm9uID0gdGhpcy5vbi5iaW5kKHRoaXMpXG4gICAgdGhpcy5vbmNlID0gdGhpcy5vbmNlLmJpbmQodGhpcylcbiAgICB0aGlzLnNlbmQgPSB0aGlzLnNlbmQuYmluZCh0aGlzKVxuICB9XG5cbiAgY2xvc2UgKCkge1xuICAgIHJldHVybiB0aGlzLnNvY2tldC5jbG9zZSgpXG4gIH1cblxuICBzZW5kIChhY3Rpb24sIHBheWxvYWQpIHtcbiAgICAvLyBhdHRhY2ggdXVpZFxuXG4gICAgaWYgKCF0aGlzLmlzT3Blbikge1xuICAgICAgdGhpcy5xdWV1ZWQucHVzaCh7YWN0aW9uLCBwYXlsb2FkfSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYWN0aW9uLFxuICAgICAgcGF5bG9hZFxuICAgIH0pKVxuICB9XG5cbiAgb24gKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIGNvbnNvbGUubG9nKGFjdGlvbilcbiAgICB0aGlzLmVtaXR0ZXIub24oYWN0aW9uLCBoYW5kbGVyKVxuICB9XG5cbiAgZW1pdCAoYWN0aW9uLCBwYXlsb2FkKSB7XG4gICAgY29uc29sZS5sb2coYWN0aW9uKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KGFjdGlvbiwgcGF5bG9hZClcbiAgfVxuXG4gIG9uY2UgKGFjdGlvbiwgaGFuZGxlcikge1xuICAgIHRoaXMuZW1pdHRlci5vbmNlKGFjdGlvbiwgaGFuZGxlcilcbiAgfVxuXG4gIF9oYW5kbGVNZXNzYWdlIChlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnBhcnNlKGUuZGF0YSlcbiAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpXG4gICAgICB0aGlzLmVtaXQobWVzc2FnZS5hY3Rpb24sIG1lc3NhZ2UucGF5bG9hZClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICB9XG4gIH1cbn1cbiIsImNvbnN0IHRocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoLnRocm90dGxlJylcbi8vIHdlIGlubGluZSBmaWxlLXR5cGUgbW9kdWxlLCBhcyBvcHBvc2VkIHRvIHVzaW5nIHRoZSBOUE0gdmVyc2lvbixcbi8vIGJlY2F1c2Ugb2YgdGhpcyBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2ZpbGUtdHlwZS9pc3N1ZXMvNzhcbi8vIGFuZCBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2NvcHktdGV4dC10by1jbGlwYm9hcmQvaXNzdWVzLzVcbmNvbnN0IGZpbGVUeXBlID0gcmVxdWlyZSgnLi4vdmVuZG9yL2ZpbGUtdHlwZScpXG5cbi8qKlxuICogQSBjb2xsZWN0aW9uIG9mIHNtYWxsIHV0aWxpdHkgZnVuY3Rpb25zIHRoYXQgaGVscCB3aXRoIGRvbSBtYW5pcHVsYXRpb24sIGFkZGluZyBsaXN0ZW5lcnMsXG4gKiBwcm9taXNlcyBhbmQgb3RoZXIgZ29vZCB0aGluZ3MuXG4gKlxuICogQG1vZHVsZSBVdGlsc1xuICovXG5cbmZ1bmN0aW9uIGlzVG91Y2hEZXZpY2UgKCkge1xuICByZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8IC8vIHdvcmtzIG9uIG1vc3QgYnJvd3NlcnNcbiAgICAgICAgICBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgICAvLyB3b3JrcyBvbiBJRTEwLzExIGFuZCBTdXJmYWNlXG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlU3RyaW5nIChzdHIsIGxlbmd0aCkge1xuICBpZiAoc3RyLmxlbmd0aCA+IGxlbmd0aCkge1xuICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIGxlbmd0aCAvIDIpICsgJy4uLicgKyBzdHIuc3Vic3RyKHN0ci5sZW5ndGggLSBsZW5ndGggLyA0LCBzdHIubGVuZ3RoKVxuICB9XG4gIHJldHVybiBzdHJcblxuICAvLyBtb3JlIHByZWNpc2UgdmVyc2lvbiBpZiBuZWVkZWRcbiAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODMxNTgzXG59XG5cbmZ1bmN0aW9uIHNlY29uZHNUb1RpbWUgKHJhd1NlY29uZHMpIHtcbiAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKHJhd1NlY29uZHMgLyAzNjAwKSAlIDI0XG4gIGNvbnN0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKHJhd1NlY29uZHMgLyA2MCkgJSA2MFxuICBjb25zdCBzZWNvbmRzID0gTWF0aC5mbG9vcihyYXdTZWNvbmRzICUgNjApXG5cbiAgcmV0dXJuIHsgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMgfVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGxpc3QgaW50byBhcnJheVxuKi9cbmZ1bmN0aW9uIHRvQXJyYXkgKGxpc3QpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGxpc3QgfHwgW10sIDApXG59XG5cbi8qKlxuICogUmV0dXJucyBhIHRpbWVzdGFtcCBpbiB0aGUgZm9ybWF0IG9mIGBob3VyczptaW51dGVzOnNlY29uZHNgXG4qL1xuZnVuY3Rpb24gZ2V0VGltZVN0YW1wICgpIHtcbiAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpXG4gIHZhciBob3VycyA9IHBhZChkYXRlLmdldEhvdXJzKCkudG9TdHJpbmcoKSlcbiAgdmFyIG1pbnV0ZXMgPSBwYWQoZGF0ZS5nZXRNaW51dGVzKCkudG9TdHJpbmcoKSlcbiAgdmFyIHNlY29uZHMgPSBwYWQoZGF0ZS5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKSlcbiAgcmV0dXJuIGhvdXJzICsgJzonICsgbWludXRlcyArICc6JyArIHNlY29uZHNcbn1cblxuLyoqXG4gKiBBZGRzIHplcm8gdG8gc3RyaW5ncyBzaG9ydGVyIHRoYW4gdHdvIGNoYXJhY3RlcnNcbiovXG5mdW5jdGlvbiBwYWQgKHN0cikge1xuICByZXR1cm4gc3RyLmxlbmd0aCAhPT0gMiA/IDAgKyBzdHIgOiBzdHJcbn1cblxuLyoqXG4gKiBUYWtlcyBhIGZpbGUgb2JqZWN0IGFuZCB0dXJucyBpdCBpbnRvIGZpbGVJRCwgYnkgY29udmVydGluZyBmaWxlLm5hbWUgdG8gbG93ZXJjYXNlLFxuICogcmVtb3ZpbmcgZXh0cmEgY2hhcmFjdGVycyBhbmQgYWRkaW5nIHR5cGUsIHNpemUgYW5kIGxhc3RNb2RpZmllZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWxlXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBmaWxlSURcbiAqXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlRmlsZUlEIChmaWxlKSB7XG4gIC8vIGZpbHRlciBpcyBuZWVkZWQgdG8gbm90IGpvaW4gZW1wdHkgdmFsdWVzIHdpdGggYC1gXG4gIHJldHVybiBbXG4gICAgJ3VwcHknLFxuICAgIGZpbGUubmFtZSA/IGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1teQS1aMC05XS9pZywgJycpIDogJycsXG4gICAgZmlsZS50eXBlLFxuICAgIGZpbGUuZGF0YS5zaXplLFxuICAgIGZpbGUuZGF0YS5sYXN0TW9kaWZpZWRcbiAgXS5maWx0ZXIodmFsID0+IHZhbCkuam9pbignLScpXG59XG5cbi8qKlxuICogUnVucyBhbiBhcnJheSBvZiBwcm9taXNlLXJldHVybmluZyBmdW5jdGlvbnMgaW4gc2VxdWVuY2UuXG4gKi9cbmZ1bmN0aW9uIHJ1blByb21pc2VTZXF1ZW5jZSAoZnVuY3Rpb25zLCAuLi5hcmdzKSB7XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKClcbiAgZnVuY3Rpb25zLmZvckVhY2goKGZ1bmMpID0+IHtcbiAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKCgpID0+IGZ1bmMoLi4uYXJncykpXG4gIH0pXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIGlzUHJldmlld1N1cHBvcnRlZCAoZmlsZVR5cGUpIHtcbiAgaWYgKCFmaWxlVHlwZSkgcmV0dXJuIGZhbHNlXG4gIGNvbnN0IGZpbGVUeXBlU3BlY2lmaWMgPSBmaWxlVHlwZS5zcGxpdCgnLycpWzFdXG4gIC8vIGxpc3Qgb2YgaW1hZ2VzIHRoYXQgYnJvd3NlcnMgY2FuIHByZXZpZXdcbiAgaWYgKC9eKGpwZWd8Z2lmfHBuZ3xzdmd8c3ZnXFwreG1sfGJtcCkkLy50ZXN0KGZpbGVUeXBlU3BlY2lmaWMpKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuZnVuY3Rpb24gZ2V0QXJyYXlCdWZmZXIgKGNodW5rKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAvLyBlLnRhcmdldC5yZXN1bHQgaXMgYW4gQXJyYXlCdWZmZXJcbiAgICAgIHJlc29sdmUoZS50YXJnZXQucmVzdWx0KVxuICAgIH0pXG4gICAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcignRmlsZVJlYWRlciBlcnJvcicgKyBlcnIpXG4gICAgICByZWplY3QoZXJyKVxuICAgIH0pXG4gICAgLy8gZmlsZS10eXBlIG9ubHkgbmVlZHMgdGhlIGZpcnN0IDQxMDAgYnl0ZXNcbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoY2h1bmspXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGdldEZpbGVUeXBlIChmaWxlKSB7XG4gIGNvbnN0IGV4dGVuc2lvbnNUb01pbWUgPSB7XG4gICAgJ21kJzogJ3RleHQvbWFya2Rvd24nLFxuICAgICdtYXJrZG93bic6ICd0ZXh0L21hcmtkb3duJyxcbiAgICAnbXA0JzogJ3ZpZGVvL21wNCcsXG4gICAgJ21wMyc6ICdhdWRpby9tcDMnLFxuICAgICdzdmcnOiAnaW1hZ2Uvc3ZnK3htbCcsXG4gICAgJ2pwZyc6ICdpbWFnZS9qcGVnJyxcbiAgICAncG5nJzogJ2ltYWdlL3BuZycsXG4gICAgJ2dpZic6ICdpbWFnZS9naWYnXG4gIH1cblxuICBjb25zdCBmaWxlRXh0ZW5zaW9uID0gZmlsZS5uYW1lID8gZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24oZmlsZS5uYW1lKS5leHRlbnNpb24gOiBudWxsXG5cbiAgaWYgKGZpbGUuaXNSZW1vdGUpIHtcbiAgICAvLyBzb21lIHJlbW90ZSBwcm92aWRlcnMgZG8gbm90IHN1cHBvcnQgZmlsZSB0eXBlc1xuICAgIGNvbnN0IG1pbWUgPSBmaWxlLnR5cGUgPyBmaWxlLnR5cGUgOiBleHRlbnNpb25zVG9NaW1lW2ZpbGVFeHRlbnNpb25dXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShtaW1lKVxuICB9XG5cbiAgLy8gMS4gdHJ5IHRvIGRldGVybWluZSBmaWxlIHR5cGUgZnJvbSBtYWdpYyBieXRlcyB3aXRoIGZpbGUtdHlwZSBtb2R1bGVcbiAgLy8gdGhpcyBzaG91bGQgYmUgdGhlIG1vc3QgdHJ1c3R3b3J0aHkgd2F5XG4gIGNvbnN0IGNodW5rID0gZmlsZS5kYXRhLnNsaWNlKDAsIDQxMDApXG4gIHJldHVybiBnZXRBcnJheUJ1ZmZlcihjaHVuaylcbiAgICAudGhlbigoYnVmZmVyKSA9PiB7XG4gICAgICBjb25zdCB0eXBlID0gZmlsZVR5cGUoYnVmZmVyKVxuICAgICAgaWYgKHR5cGUgJiYgdHlwZS5taW1lKSB7XG4gICAgICAgIHJldHVybiB0eXBlLm1pbWVcbiAgICAgIH1cblxuICAgICAgLy8gMi4gaWYgdGhhdOKAmXMgbm8gZ29vZCwgY2hlY2sgaWYgbWltZSB0eXBlIGlzIHNldCBpbiB0aGUgZmlsZSBvYmplY3RcbiAgICAgIGlmIChmaWxlLnR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGZpbGUudHlwZVxuICAgICAgfVxuXG4gICAgICAvLyAzLiBpZiB0aGF04oCZcyBubyBnb29kLCBzZWUgaWYgd2UgY2FuIG1hcCBleHRlbnNpb24gdG8gYSBtaW1lIHR5cGVcbiAgICAgIGlmIChmaWxlRXh0ZW5zaW9uICYmIGV4dGVuc2lvbnNUb01pbWVbZmlsZUV4dGVuc2lvbl0pIHtcbiAgICAgICAgcmV0dXJuIGV4dGVuc2lvbnNUb01pbWVbZmlsZUV4dGVuc2lvbl1cbiAgICAgIH1cblxuICAgICAgLy8gaWYgYWxsIGZhaWxzLCB3ZWxsLCByZXR1cm4gZW1wdHlcbiAgICAgIHJldHVybiBudWxsXG4gICAgfSlcbiAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9KVxufVxuXG4vLyBUT0RPIENoZWNrIHdoaWNoIHR5cGVzIGFyZSBhY3R1YWxseSBzdXBwb3J0ZWQgaW4gYnJvd3NlcnMuIENocm9tZSBsaWtlcyB3ZWJtXG4vLyBmcm9tIG15IHRlc3RpbmcsIGJ1dCB3ZSBtYXkgbmVlZCBtb3JlLlxuLy8gV2UgY291bGQgdXNlIGEgbGlicmFyeSBidXQgdGhleSB0ZW5kIHRvIGNvbnRhaW4gZG96ZW5zIG9mIEtCcyBvZiBtYXBwaW5ncyxcbi8vIG1vc3Qgb2Ygd2hpY2ggd2lsbCBnbyB1bnVzZWQsIHNvIG5vdCBzdXJlIGlmIHRoYXQncyB3b3J0aCBpdC5cbmNvbnN0IG1pbWVUb0V4dGVuc2lvbnMgPSB7XG4gICd2aWRlby9vZ2cnOiAnb2d2JyxcbiAgJ2F1ZGlvL29nZyc6ICdvZ2cnLFxuICAndmlkZW8vd2VibSc6ICd3ZWJtJyxcbiAgJ2F1ZGlvL3dlYm0nOiAnd2VibScsXG4gICd2aWRlby9tcDQnOiAnbXA0JyxcbiAgJ2F1ZGlvL21wMyc6ICdtcDMnXG59XG5cbmZ1bmN0aW9uIGdldEZpbGVUeXBlRXh0ZW5zaW9uIChtaW1lVHlwZSkge1xuICByZXR1cm4gbWltZVRvRXh0ZW5zaW9uc1ttaW1lVHlwZV0gfHwgbnVsbFxufVxuXG4vKipcbiogVGFrZXMgYSBmdWxsIGZpbGVuYW1lIHN0cmluZyBhbmQgcmV0dXJucyBhbiBvYmplY3Qge25hbWUsIGV4dGVuc2lvbn1cbipcbiogQHBhcmFtIHtzdHJpbmd9IGZ1bGxGaWxlTmFtZVxuKiBAcmV0dXJuIHtvYmplY3R9IHtuYW1lLCBleHRlbnNpb259XG4qL1xuZnVuY3Rpb24gZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24gKGZ1bGxGaWxlTmFtZSkge1xuICB2YXIgcmUgPSAvKD86XFwuKFteLl0rKSk/JC9cbiAgdmFyIGZpbGVFeHQgPSByZS5leGVjKGZ1bGxGaWxlTmFtZSlbMV1cbiAgdmFyIGZpbGVOYW1lID0gZnVsbEZpbGVOYW1lLnJlcGxhY2UoJy4nICsgZmlsZUV4dCwgJycpXG4gIHJldHVybiB7XG4gICAgbmFtZTogZmlsZU5hbWUsXG4gICAgZXh0ZW5zaW9uOiBmaWxlRXh0XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhIFVSTCBzdHJpbmcgaXMgYW4gb2JqZWN0IFVSTCBmcm9tIGBVUkwuY3JlYXRlT2JqZWN0VVJMYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc09iamVjdFVSTCAodXJsKSB7XG4gIHJldHVybiB1cmwuaW5kZXhPZignYmxvYjonKSA9PT0gMFxufVxuXG5mdW5jdGlvbiBnZXRQcm9wb3J0aW9uYWxIZWlnaHQgKGltZywgd2lkdGgpIHtcbiAgY29uc3QgYXNwZWN0ID0gaW1nLndpZHRoIC8gaW1nLmhlaWdodFxuICByZXR1cm4gTWF0aC5yb3VuZCh3aWR0aCAvIGFzcGVjdClcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSB0aHVtYm5haWwgZm9yIHRoZSBnaXZlbiBVcHB5IGZpbGUgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7e2RhdGE6IEJsb2J9fSBmaWxlXG4gKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVRodW1ibmFpbCAoZmlsZSwgdGFyZ2V0V2lkdGgpIHtcbiAgY29uc3Qgb3JpZ2luYWxVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUuZGF0YSlcbiAgY29uc3Qgb25sb2FkID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKClcbiAgICBpbWFnZS5zcmMgPSBvcmlnaW5hbFVybFxuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwob3JpZ2luYWxVcmwpXG4gICAgICByZXNvbHZlKGltYWdlKVxuICAgIH1cbiAgICBpbWFnZS5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgLy8gVGhlIG9uZXJyb3IgZXZlbnQgaXMgdG90YWxseSB1c2VsZXNzIHVuZm9ydHVuYXRlbHksIGFzIGZhciBhcyBJIGtub3dcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwob3JpZ2luYWxVcmwpXG4gICAgICByZWplY3QobmV3IEVycm9yKCdDb3VsZCBub3QgY3JlYXRlIHRodW1ibmFpbCcpKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gb25sb2FkLnRoZW4oKGltYWdlKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0SGVpZ2h0ID0gZ2V0UHJvcG9ydGlvbmFsSGVpZ2h0KGltYWdlLCB0YXJnZXRXaWR0aClcbiAgICBjb25zdCBjYW52YXMgPSByZXNpemVJbWFnZShpbWFnZSwgdGFyZ2V0V2lkdGgsIHRhcmdldEhlaWdodClcbiAgICByZXR1cm4gY2FudmFzVG9CbG9iKGNhbnZhcywgJ2ltYWdlL3BuZycpXG4gIH0pLnRoZW4oKGJsb2IpID0+IHtcbiAgICByZXR1cm4gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKVxuICB9KVxufVxuXG4vKipcbiAqIFJlc2l6ZSBhbiBpbWFnZSB0byB0aGUgdGFyZ2V0IGB3aWR0aGAgYW5kIGBoZWlnaHRgLlxuICpcbiAqIFJldHVybnMgYSBDYW52YXMgd2l0aCB0aGUgcmVzaXplZCBpbWFnZSBvbiBpdC5cbiAqL1xuZnVuY3Rpb24gcmVzaXplSW1hZ2UgKGltYWdlLCB0YXJnZXRXaWR0aCwgdGFyZ2V0SGVpZ2h0KSB7XG4gIGxldCBzb3VyY2VXaWR0aCA9IGltYWdlLndpZHRoXG4gIGxldCBzb3VyY2VIZWlnaHQgPSBpbWFnZS5oZWlnaHRcblxuICBpZiAodGFyZ2V0SGVpZ2h0IDwgaW1hZ2UuaGVpZ2h0IC8gMikge1xuICAgIGNvbnN0IHN0ZXBzID0gTWF0aC5mbG9vcihNYXRoLmxvZyhpbWFnZS53aWR0aCAvIHRhcmdldFdpZHRoKSAvIE1hdGgubG9nKDIpKVxuICAgIGNvbnN0IHN0ZXBTY2FsZWQgPSBkb3duU2NhbGVJblN0ZXBzKGltYWdlLCBzdGVwcylcbiAgICBpbWFnZSA9IHN0ZXBTY2FsZWQuaW1hZ2VcbiAgICBzb3VyY2VXaWR0aCA9IHN0ZXBTY2FsZWQuc291cmNlV2lkdGhcbiAgICBzb3VyY2VIZWlnaHQgPSBzdGVwU2NhbGVkLnNvdXJjZUhlaWdodFxuICB9XG5cbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgY2FudmFzLndpZHRoID0gdGFyZ2V0V2lkdGhcbiAgY2FudmFzLmhlaWdodCA9IHRhcmdldEhlaWdodFxuXG4gIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICBjb250ZXh0LmRyYXdJbWFnZShpbWFnZSxcbiAgICAwLCAwLCBzb3VyY2VXaWR0aCwgc291cmNlSGVpZ2h0LFxuICAgIDAsIDAsIHRhcmdldFdpZHRoLCB0YXJnZXRIZWlnaHQpXG5cbiAgcmV0dXJuIGNhbnZhc1xufVxuXG4vKipcbiAqIERvd25zY2FsZSBhbiBpbWFnZSBieSA1MCUgYHN0ZXBzYCB0aW1lcy5cbiAqL1xuZnVuY3Rpb24gZG93blNjYWxlSW5TdGVwcyAoaW1hZ2UsIHN0ZXBzKSB7XG4gIGxldCBzb3VyY2UgPSBpbWFnZVxuICBsZXQgY3VycmVudFdpZHRoID0gc291cmNlLndpZHRoXG4gIGxldCBjdXJyZW50SGVpZ2h0ID0gc291cmNlLmhlaWdodFxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcHM7IGkgKz0gMSkge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgY2FudmFzLndpZHRoID0gY3VycmVudFdpZHRoIC8gMlxuICAgIGNhbnZhcy5oZWlnaHQgPSBjdXJyZW50SGVpZ2h0IC8gMlxuICAgIGNvbnRleHQuZHJhd0ltYWdlKHNvdXJjZSxcbiAgICAgIC8vIFRoZSBlbnRpcmUgc291cmNlIGltYWdlLiBXZSBwYXNzIHdpZHRoIGFuZCBoZWlnaHQgaGVyZSxcbiAgICAgIC8vIGJlY2F1c2Ugd2UgcmV1c2UgdGhpcyBjYW52YXMsIGFuZCBzaG91bGQgb25seSBzY2FsZSBkb3duXG4gICAgICAvLyB0aGUgcGFydCBvZiB0aGUgY2FudmFzIHRoYXQgY29udGFpbnMgdGhlIHByZXZpb3VzIHNjYWxlIHN0ZXAuXG4gICAgICAwLCAwLCBjdXJyZW50V2lkdGgsIGN1cnJlbnRIZWlnaHQsXG4gICAgICAvLyBEcmF3IHRvIDUwJSBzaXplXG4gICAgICAwLCAwLCBjdXJyZW50V2lkdGggLyAyLCBjdXJyZW50SGVpZ2h0IC8gMilcbiAgICBjdXJyZW50V2lkdGggLz0gMlxuICAgIGN1cnJlbnRIZWlnaHQgLz0gMlxuICAgIHNvdXJjZSA9IGNhbnZhc1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbWFnZTogc291cmNlLFxuICAgIHNvdXJjZVdpZHRoOiBjdXJyZW50V2lkdGgsXG4gICAgc291cmNlSGVpZ2h0OiBjdXJyZW50SGVpZ2h0XG4gIH1cbn1cblxuLyoqXG4gKiBTYXZlIGEgPGNhbnZhcz4gZWxlbWVudCdzIGNvbnRlbnQgdG8gYSBCbG9iIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxDYW52YXNFbGVtZW50fSBjYW52YXNcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cbmZ1bmN0aW9uIGNhbnZhc1RvQmxvYiAoY2FudmFzLCB0eXBlLCBxdWFsaXR5KSB7XG4gIGlmIChjYW52YXMudG9CbG9iKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBjYW52YXMudG9CbG9iKHJlc29sdmUsIHR5cGUsIHF1YWxpdHkpXG4gICAgfSlcbiAgfVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgcmV0dXJuIGRhdGFVUkl0b0Jsb2IoY2FudmFzLnRvRGF0YVVSTCh0eXBlLCBxdWFsaXR5KSwge30pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGRhdGFVUkl0b0Jsb2IgKGRhdGFVUkksIG9wdHMsIHRvRmlsZSkge1xuICAvLyBnZXQgdGhlIGJhc2U2NCBkYXRhXG4gIHZhciBkYXRhID0gZGF0YVVSSS5zcGxpdCgnLCcpWzFdXG5cbiAgLy8gdXNlciBtYXkgcHJvdmlkZSBtaW1lIHR5cGUsIGlmIG5vdCBnZXQgaXQgZnJvbSBkYXRhIFVSSVxuICB2YXIgbWltZVR5cGUgPSBvcHRzLm1pbWVUeXBlIHx8IGRhdGFVUkkuc3BsaXQoJywnKVswXS5zcGxpdCgnOicpWzFdLnNwbGl0KCc7JylbMF1cblxuICAvLyBkZWZhdWx0IHRvIHBsYWluL3RleHQgaWYgZGF0YSBVUkkgaGFzIG5vIG1pbWVUeXBlXG4gIGlmIChtaW1lVHlwZSA9PSBudWxsKSB7XG4gICAgbWltZVR5cGUgPSAncGxhaW4vdGV4dCdcbiAgfVxuXG4gIHZhciBiaW5hcnkgPSBhdG9iKGRhdGEpXG4gIHZhciBhcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XG4gICAgYXJyYXkucHVzaChiaW5hcnkuY2hhckNvZGVBdChpKSlcbiAgfVxuXG4gIC8vIENvbnZlcnQgdG8gYSBGaWxlP1xuICBpZiAodG9GaWxlKSB7XG4gICAgcmV0dXJuIG5ldyBGaWxlKFtuZXcgVWludDhBcnJheShhcnJheSldLCBvcHRzLm5hbWUgfHwgJycsIHt0eXBlOiBtaW1lVHlwZX0pXG4gIH1cblxuICByZXR1cm4gbmV3IEJsb2IoW25ldyBVaW50OEFycmF5KGFycmF5KV0sIHt0eXBlOiBtaW1lVHlwZX0pXG59XG5cbmZ1bmN0aW9uIGRhdGFVUkl0b0ZpbGUgKGRhdGFVUkksIG9wdHMpIHtcbiAgcmV0dXJuIGRhdGFVUkl0b0Jsb2IoZGF0YVVSSSwgb3B0cywgdHJ1ZSlcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGV4dCB0byBjbGlwYm9hcmQgYnkgY3JlYXRpbmcgYW4gYWxtb3N0IGludmlzaWJsZSB0ZXh0YXJlYSxcbiAqIGFkZGluZyB0ZXh0IHRoZXJlLCB0aGVuIHJ1bm5pbmcgZXhlY0NvbW1hbmQoJ2NvcHknKS5cbiAqIEZhbGxzIGJhY2sgdG8gcHJvbXB0KCkgd2hlbiB0aGUgZWFzeSB3YXkgZmFpbHMgKGhlbGxvLCBTYWZhcmkhKVxuICogRnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMDgxMDMyMlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0VG9Db3B5XG4gKiBAcGFyYW0ge1N0cmluZ30gZmFsbGJhY2tTdHJpbmdcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cbmZ1bmN0aW9uIGNvcHlUb0NsaXBib2FyZCAodGV4dFRvQ29weSwgZmFsbGJhY2tTdHJpbmcpIHtcbiAgZmFsbGJhY2tTdHJpbmcgPSBmYWxsYmFja1N0cmluZyB8fCAnQ29weSB0aGUgVVJMIGJlbG93J1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNvbnN0IHRleHRBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRBcmVhLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgIHRvcDogMCxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICB3aWR0aDogJzJlbScsXG4gICAgICBoZWlnaHQ6ICcyZW0nLFxuICAgICAgcGFkZGluZzogMCxcbiAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgb3V0bGluZTogJ25vbmUnLFxuICAgICAgYm94U2hhZG93OiAnbm9uZScsXG4gICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnXG4gICAgfSlcblxuICAgIHRleHRBcmVhLnZhbHVlID0gdGV4dFRvQ29weVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGV4dEFyZWEpXG4gICAgdGV4dEFyZWEuc2VsZWN0KClcblxuICAgIGNvbnN0IG1hZ2ljQ29weUZhaWxlZCA9ICgpID0+IHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGV4dEFyZWEpXG4gICAgICB3aW5kb3cucHJvbXB0KGZhbGxiYWNrU3RyaW5nLCB0ZXh0VG9Db3B5KVxuICAgICAgcmVzb2x2ZSgpXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN1Y2Nlc3NmdWwgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpXG4gICAgICBpZiAoIXN1Y2Nlc3NmdWwpIHtcbiAgICAgICAgcmV0dXJuIG1hZ2ljQ29weUZhaWxlZCgnY29weSBjb21tYW5kIHVuYXZhaWxhYmxlJylcbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGV4dEFyZWEpXG4gICAgICByZXR1cm4gcmVzb2x2ZSgpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRleHRBcmVhKVxuICAgICAgcmV0dXJuIG1hZ2ljQ29weUZhaWxlZChlcnIpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBnZXRTcGVlZCAoZmlsZVByb2dyZXNzKSB7XG4gIGlmICghZmlsZVByb2dyZXNzLmJ5dGVzVXBsb2FkZWQpIHJldHVybiAwXG5cbiAgY29uc3QgdGltZUVsYXBzZWQgPSAobmV3IERhdGUoKSkgLSBmaWxlUHJvZ3Jlc3MudXBsb2FkU3RhcnRlZFxuICBjb25zdCB1cGxvYWRTcGVlZCA9IGZpbGVQcm9ncmVzcy5ieXRlc1VwbG9hZGVkIC8gKHRpbWVFbGFwc2VkIC8gMTAwMClcbiAgcmV0dXJuIHVwbG9hZFNwZWVkXG59XG5cbmZ1bmN0aW9uIGdldEJ5dGVzUmVtYWluaW5nIChmaWxlUHJvZ3Jlc3MpIHtcbiAgcmV0dXJuIGZpbGVQcm9ncmVzcy5ieXRlc1RvdGFsIC0gZmlsZVByb2dyZXNzLmJ5dGVzVXBsb2FkZWRcbn1cblxuZnVuY3Rpb24gZ2V0RVRBIChmaWxlUHJvZ3Jlc3MpIHtcbiAgaWYgKCFmaWxlUHJvZ3Jlc3MuYnl0ZXNVcGxvYWRlZCkgcmV0dXJuIDBcblxuICBjb25zdCB1cGxvYWRTcGVlZCA9IGdldFNwZWVkKGZpbGVQcm9ncmVzcylcbiAgY29uc3QgYnl0ZXNSZW1haW5pbmcgPSBnZXRCeXRlc1JlbWFpbmluZyhmaWxlUHJvZ3Jlc3MpXG4gIGNvbnN0IHNlY29uZHNSZW1haW5pbmcgPSBNYXRoLnJvdW5kKGJ5dGVzUmVtYWluaW5nIC8gdXBsb2FkU3BlZWQgKiAxMCkgLyAxMFxuXG4gIHJldHVybiBzZWNvbmRzUmVtYWluaW5nXG59XG5cbmZ1bmN0aW9uIHByZXR0eUVUQSAoc2Vjb25kcykge1xuICBjb25zdCB0aW1lID0gc2Vjb25kc1RvVGltZShzZWNvbmRzKVxuXG4gIC8vIE9ubHkgZGlzcGxheSBob3VycyBhbmQgbWludXRlcyBpZiB0aGV5IGFyZSBncmVhdGVyIHRoYW4gMCBidXQgYWx3YXlzXG4gIC8vIGRpc3BsYXkgbWludXRlcyBpZiBob3VycyBpcyBiZWluZyBkaXNwbGF5ZWRcbiAgLy8gRGlzcGxheSBhIGxlYWRpbmcgemVybyBpZiB0aGUgdGhlcmUgaXMgYSBwcmVjZWRpbmcgdW5pdDogMW0gMDVzLCBidXQgNXNcbiAgY29uc3QgaG91cnNTdHIgPSB0aW1lLmhvdXJzID8gdGltZS5ob3VycyArICdoICcgOiAnJ1xuICBjb25zdCBtaW51dGVzVmFsID0gdGltZS5ob3VycyA/ICgnMCcgKyB0aW1lLm1pbnV0ZXMpLnN1YnN0cigtMikgOiB0aW1lLm1pbnV0ZXNcbiAgY29uc3QgbWludXRlc1N0ciA9IG1pbnV0ZXNWYWwgPyBtaW51dGVzVmFsICsgJ20gJyA6ICcnXG4gIGNvbnN0IHNlY29uZHNWYWwgPSBtaW51dGVzVmFsID8gKCcwJyArIHRpbWUuc2Vjb25kcykuc3Vic3RyKC0yKSA6IHRpbWUuc2Vjb25kc1xuICBjb25zdCBzZWNvbmRzU3RyID0gc2Vjb25kc1ZhbCArICdzJ1xuXG4gIHJldHVybiBgJHtob3Vyc1N0cn0ke21pbnV0ZXNTdHJ9JHtzZWNvbmRzU3RyfWBcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhbiBvYmplY3QgaXMgYSBET00gZWxlbWVudC4gRHVjay10eXBpbmcgYmFzZWQgb24gYG5vZGVUeXBlYC5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICovXG5mdW5jdGlvbiBpc0RPTUVsZW1lbnQgKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREVcbn1cblxuLyoqXG4gKiBGaW5kIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtOb2RlfHN0cmluZ30gZWxlbWVudFxuICogQHJldHVybiB7Tm9kZXxudWxsfVxuICovXG5mdW5jdGlvbiBmaW5kRE9NRWxlbWVudCAoZWxlbWVudCkge1xuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudClcbiAgfVxuXG4gIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ29iamVjdCcgJiYgaXNET01FbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIGVsZW1lbnRcbiAgfVxufVxuXG4vKipcbiAqIEZpbmQgb25lIG9yIG1vcmUgRE9NIGVsZW1lbnRzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbGVtZW50XG4gKiBAcmV0dXJuIHtBcnJheXxudWxsfVxuICovXG5mdW5jdGlvbiBmaW5kQWxsRE9NRWxlbWVudHMgKGVsZW1lbnQpIHtcbiAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnQpKVxuICAgIHJldHVybiBlbGVtZW50cy5sZW5ndGggPiAwID8gZWxlbWVudHMgOiBudWxsXG4gIH1cblxuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdvYmplY3QnICYmIGlzRE9NRWxlbWVudChlbGVtZW50KSkge1xuICAgIHJldHVybiBbZWxlbWVudF1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRTb2NrZXRIb3N0ICh1cmwpIHtcbiAgLy8gZ2V0IHRoZSBob3N0IGRvbWFpblxuICB2YXIgcmVnZXggPSAvXig/Omh0dHBzPzpcXC9cXC98XFwvXFwvKT8oPzpbXkBcXG5dK0ApPyg/Ond3d1xcLik/KFteXFxuXSspL1xuICB2YXIgaG9zdCA9IHJlZ2V4LmV4ZWModXJsKVsxXVxuICB2YXIgc29ja2V0UHJvdG9jb2wgPSBsb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyAnd3NzJyA6ICd3cydcblxuICByZXR1cm4gYCR7c29ja2V0UHJvdG9jb2x9Oi8vJHtob3N0fWBcbn1cblxuZnVuY3Rpb24gX2VtaXRTb2NrZXRQcm9ncmVzcyAodXBsb2FkZXIsIHByb2dyZXNzRGF0YSwgZmlsZSkge1xuICBjb25zdCB7IHByb2dyZXNzLCBieXRlc1VwbG9hZGVkLCBieXRlc1RvdGFsIH0gPSBwcm9ncmVzc0RhdGFcbiAgaWYgKHByb2dyZXNzKSB7XG4gICAgdXBsb2FkZXIudXBweS5sb2coYFVwbG9hZCBwcm9ncmVzczogJHtwcm9ncmVzc31gKVxuICAgIHVwbG9hZGVyLnVwcHkuZW1pdCgndXBsb2FkLXByb2dyZXNzJywge1xuICAgICAgdXBsb2FkZXIsXG4gICAgICBpZDogZmlsZS5pZCxcbiAgICAgIGJ5dGVzVXBsb2FkZWQ6IGJ5dGVzVXBsb2FkZWQsXG4gICAgICBieXRlc1RvdGFsOiBieXRlc1RvdGFsXG4gICAgfSlcbiAgfVxufVxuXG5jb25zdCBlbWl0U29ja2V0UHJvZ3Jlc3MgPSB0aHJvdHRsZShfZW1pdFNvY2tldFByb2dyZXNzLCAzMDAsIHtsZWFkaW5nOiB0cnVlLCB0cmFpbGluZzogdHJ1ZX0pXG5cbmZ1bmN0aW9uIHNldHRsZSAocHJvbWlzZXMpIHtcbiAgY29uc3QgcmVzb2x1dGlvbnMgPSBbXVxuICBjb25zdCByZWplY3Rpb25zID0gW11cbiAgZnVuY3Rpb24gcmVzb2x2ZWQgKHZhbHVlKSB7XG4gICAgcmVzb2x1dGlvbnMucHVzaCh2YWx1ZSlcbiAgfVxuICBmdW5jdGlvbiByZWplY3RlZCAoZXJyb3IpIHtcbiAgICByZWplY3Rpb25zLnB1c2goZXJyb3IpXG4gIH1cblxuICBjb25zdCB3YWl0ID0gUHJvbWlzZS5hbGwoXG4gICAgcHJvbWlzZXMubWFwKChwcm9taXNlKSA9PiBwcm9taXNlLnRoZW4ocmVzb2x2ZWQsIHJlamVjdGVkKSlcbiAgKVxuXG4gIHJldHVybiB3YWl0LnRoZW4oKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzZnVsOiByZXNvbHV0aW9ucyxcbiAgICAgIGZhaWxlZDogcmVqZWN0aW9uc1xuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBMaW1pdCB0aGUgYW1vdW50IG9mIHNpbXVsdGFuZW91c2x5IHBlbmRpbmcgUHJvbWlzZXMuXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBwYXNzZWQgYSBmdW5jdGlvbiBgZm5gLFxuICogd2lsbCBtYWtlIHN1cmUgdGhhdCBhdCBtb3N0IGBsaW1pdGAgY2FsbHMgdG8gYGZuYCBhcmUgcGVuZGluZy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbGltaXRcbiAqIEByZXR1cm4ge2Z1bmN0aW9uKCl9XG4gKi9cbmZ1bmN0aW9uIGxpbWl0UHJvbWlzZXMgKGxpbWl0KSB7XG4gIGxldCBwZW5kaW5nID0gMFxuICBjb25zdCBxdWV1ZSA9IFtdXG4gIHJldHVybiAoZm4pID0+IHtcbiAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgIGNvbnN0IGNhbGwgPSAoKSA9PiB7XG4gICAgICAgIHBlbmRpbmcrK1xuICAgICAgICBjb25zdCBwcm9taXNlID0gZm4oLi4uYXJncylcbiAgICAgICAgcHJvbWlzZS50aGVuKG9uZmluaXNoLCBvbmZpbmlzaClcbiAgICAgICAgcmV0dXJuIHByb21pc2VcbiAgICAgIH1cblxuICAgICAgaWYgKHBlbmRpbmcgPj0gbGltaXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBxdWV1ZS5wdXNoKCgpID0+IHtcbiAgICAgICAgICAgIGNhbGwoKS50aGVuKHJlc29sdmUsIHJlamVjdClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNhbGwoKVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBvbmZpbmlzaCAoKSB7XG4gICAgcGVuZGluZy0tXG4gICAgY29uc3QgbmV4dCA9IHF1ZXVlLnNoaWZ0KClcbiAgICBpZiAobmV4dCkgbmV4dCgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdlbmVyYXRlRmlsZUlELFxuICB0b0FycmF5LFxuICBnZXRUaW1lU3RhbXAsXG4gIHJ1blByb21pc2VTZXF1ZW5jZSxcbiAgaXNUb3VjaERldmljZSxcbiAgZ2V0RmlsZU5hbWVBbmRFeHRlbnNpb24sXG4gIHRydW5jYXRlU3RyaW5nLFxuICBnZXRGaWxlVHlwZUV4dGVuc2lvbixcbiAgZ2V0RmlsZVR5cGUsXG4gIGdldEFycmF5QnVmZmVyLFxuICBpc1ByZXZpZXdTdXBwb3J0ZWQsXG4gIGlzT2JqZWN0VVJMLFxuICBjcmVhdGVUaHVtYm5haWwsXG4gIHNlY29uZHNUb1RpbWUsXG4gIGRhdGFVUkl0b0Jsb2IsXG4gIGRhdGFVUkl0b0ZpbGUsXG4gIGNhbnZhc1RvQmxvYixcbiAgZ2V0U3BlZWQsXG4gIGdldEJ5dGVzUmVtYWluaW5nLFxuICBnZXRFVEEsXG4gIGNvcHlUb0NsaXBib2FyZCxcbiAgcHJldHR5RVRBLFxuICBmaW5kRE9NRWxlbWVudCxcbiAgZmluZEFsbERPTUVsZW1lbnRzLFxuICBnZXRTb2NrZXRIb3N0LFxuICBlbWl0U29ja2V0UHJvZ3Jlc3MsXG4gIHNldHRsZSxcbiAgbGltaXRQcm9taXNlc1xufVxuIiwiY29uc3QgUGx1Z2luID0gcmVxdWlyZSgnLi4vY29yZS9QbHVnaW4nKVxuY29uc3QgeyB0b0FycmF5IH0gPSByZXF1aXJlKCcuLi9jb3JlL1V0aWxzJylcbmNvbnN0IFRyYW5zbGF0b3IgPSByZXF1aXJlKCcuLi9jb3JlL1RyYW5zbGF0b3InKVxuY29uc3QgeyBoIH0gPSByZXF1aXJlKCdwcmVhY3QnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEZpbGVJbnB1dCBleHRlbmRzIFBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzKSB7XG4gICAgc3VwZXIodXBweSwgb3B0cylcbiAgICB0aGlzLmlkID0gdGhpcy5vcHRzLmlkIHx8ICdGaWxlSW5wdXQnXG4gICAgdGhpcy50aXRsZSA9ICdGaWxlIElucHV0J1xuICAgIHRoaXMudHlwZSA9ICdhY3F1aXJlcidcblxuICAgIGNvbnN0IGRlZmF1bHRMb2NhbGUgPSB7XG4gICAgICBzdHJpbmdzOiB7XG4gICAgICAgIGNob29zZUZpbGVzOiAnQ2hvb3NlIGZpbGVzJ1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIERlZmF1bHQgb3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgdGFyZ2V0OiBudWxsLFxuICAgICAgYWxsb3dNdWx0aXBsZUZpbGVzOiB0cnVlLFxuICAgICAgcHJldHR5OiB0cnVlLFxuICAgICAgaW5wdXROYW1lOiAnZmlsZXNbXScsXG4gICAgICBsb2NhbGU6IGRlZmF1bHRMb2NhbGVcbiAgICB9XG5cbiAgICAvLyBNZXJnZSBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgb25lcyBzZXQgYnkgdXNlclxuICAgIHRoaXMub3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRzKVxuXG4gICAgdGhpcy5sb2NhbGUgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0TG9jYWxlLCB0aGlzLm9wdHMubG9jYWxlKVxuICAgIHRoaXMubG9jYWxlLnN0cmluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0TG9jYWxlLnN0cmluZ3MsIHRoaXMub3B0cy5sb2NhbGUuc3RyaW5ncylcblxuICAgIC8vIGkxOG5cbiAgICB0aGlzLnRyYW5zbGF0b3IgPSBuZXcgVHJhbnNsYXRvcih7bG9jYWxlOiB0aGlzLmxvY2FsZX0pXG4gICAgdGhpcy5pMThuID0gdGhpcy50cmFuc2xhdG9yLnRyYW5zbGF0ZS5iaW5kKHRoaXMudHJhbnNsYXRvcilcblxuICAgIHRoaXMucmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlSW5wdXRDaGFuZ2UgPSB0aGlzLmhhbmRsZUlucHV0Q2hhbmdlLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpXG4gIH1cblxuICBoYW5kbGVJbnB1dENoYW5nZSAoZXYpIHtcbiAgICB0aGlzLnVwcHkubG9nKCdbRmlsZUlucHV0XSBTb21ldGhpbmcgc2VsZWN0ZWQgdGhyb3VnaCBpbnB1dC4uLicpXG5cbiAgICBjb25zdCBmaWxlcyA9IHRvQXJyYXkoZXYudGFyZ2V0LmZpbGVzKVxuXG4gICAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgdGhpcy51cHB5LmFkZEZpbGUoe1xuICAgICAgICBzb3VyY2U6IHRoaXMuaWQsXG4gICAgICAgIG5hbWU6IGZpbGUubmFtZSxcbiAgICAgICAgdHlwZTogZmlsZS50eXBlLFxuICAgICAgICBkYXRhOiBmaWxlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVDbGljayAoZXYpIHtcbiAgICB0aGlzLmlucHV0LmNsaWNrKClcbiAgfVxuXG4gIHJlbmRlciAoc3RhdGUpIHtcbiAgICBjb25zdCBoaWRkZW5JbnB1dFN0eWxlID0ge1xuICAgICAgd2lkdGg6ICcwLjFweCcsXG4gICAgICBoZWlnaHQ6ICcwLjFweCcsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB6SW5kZXg6IC0xXG4gICAgfVxuXG4gICAgcmV0dXJuIDxkaXYgY2xhc3M9XCJ1cHB5IHVwcHktRmlsZUlucHV0LWNvbnRhaW5lclwiPlxuICAgICAgPGlucHV0IGNsYXNzPVwidXBweS1GaWxlSW5wdXQtaW5wdXRcIlxuICAgICAgICBzdHlsZT17dGhpcy5vcHRzLnByZXR0eSAmJiBoaWRkZW5JbnB1dFN0eWxlfVxuICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgIG5hbWU9e3RoaXMub3B0cy5pbnB1dE5hbWV9XG4gICAgICAgIG9uY2hhbmdlPXt0aGlzLmhhbmRsZUlucHV0Q2hhbmdlfVxuICAgICAgICBtdWx0aXBsZT17dGhpcy5vcHRzLmFsbG93TXVsdGlwbGVGaWxlc31cbiAgICAgICAgcmVmPXsoaW5wdXQpID0+IHsgdGhpcy5pbnB1dCA9IGlucHV0IH19IC8+XG4gICAgICB7dGhpcy5vcHRzLnByZXR0eSAmJlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwidXBweS1GaWxlSW5wdXQtYnRuXCIgdHlwZT1cImJ1dHRvblwiIG9uY2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIHt0aGlzLmkxOG4oJ2Nob29zZUZpbGVzJyl9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgfVxuICAgIDwvZGl2PlxuICB9XG5cbiAgaW5zdGFsbCAoKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5vcHRzLnRhcmdldFxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHRoaXMubW91bnQodGFyZ2V0LCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIHVuaW5zdGFsbCAoKSB7XG4gICAgdGhpcy51bm1vdW50KClcbiAgfVxufVxuIiwiY29uc3QgUGx1Z2luID0gcmVxdWlyZSgnLi4vY29yZS9QbHVnaW4nKVxuY29uc3QgeyBoIH0gPSByZXF1aXJlKCdwcmVhY3QnKVxuXG4vKipcbiAqIFByb2dyZXNzIGJhclxuICpcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQcm9ncmVzc0JhciBleHRlbmRzIFBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzKSB7XG4gICAgc3VwZXIodXBweSwgb3B0cylcbiAgICB0aGlzLmlkID0gdGhpcy5vcHRzLmlkIHx8ICdQcm9ncmVzc0JhcidcbiAgICB0aGlzLnRpdGxlID0gJ1Byb2dyZXNzIEJhcidcbiAgICB0aGlzLnR5cGUgPSAncHJvZ3Jlc3NpbmRpY2F0b3InXG5cbiAgICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gICAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICAgIHJlcGxhY2VUYXJnZXRDb250ZW50OiBmYWxzZSxcbiAgICAgIGZpeGVkOiBmYWxzZSxcbiAgICAgIGhpZGVBZnRlckZpbmlzaDogdHJ1ZVxuICAgIH1cblxuICAgIC8vIG1lcmdlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSBvbmVzIHNldCBieSB1c2VyXG4gICAgdGhpcy5vcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdHMpXG5cbiAgICB0aGlzLnJlbmRlciA9IHRoaXMucmVuZGVyLmJpbmQodGhpcylcbiAgfVxuXG4gIHJlbmRlciAoc3RhdGUpIHtcbiAgICBjb25zdCBwcm9ncmVzcyA9IHN0YXRlLnRvdGFsUHJvZ3Jlc3MgfHwgMFxuICAgIGNvbnN0IGlzSGlkZGVuID0gcHJvZ3Jlc3MgPT09IDEwMCAmJiB0aGlzLm9wdHMuaGlkZUFmdGVyRmluaXNoXG4gICAgcmV0dXJuIDxkaXYgY2xhc3M9XCJ1cHB5IHVwcHktUHJvZ3Jlc3NCYXJcIiBzdHlsZT17eyBwb3NpdGlvbjogdGhpcy5vcHRzLmZpeGVkID8gJ2ZpeGVkJyA6ICdpbml0aWFsJyB9fSBhcmlhLWhpZGRlbj17aXNIaWRkZW59PlxuICAgICAgPGRpdiBjbGFzcz1cInVwcHktUHJvZ3Jlc3NCYXItaW5uZXJcIiBzdHlsZT17eyB3aWR0aDogcHJvZ3Jlc3MgKyAnJScgfX0gLz5cbiAgICAgIDxkaXYgY2xhc3M9XCJ1cHB5LVByb2dyZXNzQmFyLXBlcmNlbnRhZ2VcIj57cHJvZ3Jlc3N9PC9kaXY+XG4gICAgPC9kaXY+XG4gIH1cblxuICBpbnN0YWxsICgpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLm9wdHMudGFyZ2V0XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgdGhpcy5tb3VudCh0YXJnZXQsIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgdW5pbnN0YWxsICgpIHtcbiAgICB0aGlzLnVubW91bnQoKVxuICB9XG59XG4iLCJjb25zdCBQbHVnaW4gPSByZXF1aXJlKCcuLi9jb3JlL1BsdWdpbicpXG5jb25zdCBjdWlkID0gcmVxdWlyZSgnY3VpZCcpXG5jb25zdCBUcmFuc2xhdG9yID0gcmVxdWlyZSgnLi4vY29yZS9UcmFuc2xhdG9yJylcbmNvbnN0IFVwcHlTb2NrZXQgPSByZXF1aXJlKCcuLi9jb3JlL1VwcHlTb2NrZXQnKVxuY29uc3Qge1xuICBlbWl0U29ja2V0UHJvZ3Jlc3MsXG4gIGdldFNvY2tldEhvc3QsXG4gIHNldHRsZSxcbiAgbGltaXRQcm9taXNlc1xufSA9IHJlcXVpcmUoJy4uL2NvcmUvVXRpbHMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFhIUlVwbG9hZCBleHRlbmRzIFBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yICh1cHB5LCBvcHRzKSB7XG4gICAgc3VwZXIodXBweSwgb3B0cylcbiAgICB0aGlzLnR5cGUgPSAndXBsb2FkZXInXG4gICAgdGhpcy5pZCA9ICdYSFJVcGxvYWQnXG4gICAgdGhpcy50aXRsZSA9ICdYSFJVcGxvYWQnXG5cbiAgICBjb25zdCBkZWZhdWx0TG9jYWxlID0ge1xuICAgICAgc3RyaW5nczoge1xuICAgICAgICB0aW1lZE91dDogJ1VwbG9hZCBzdGFsbGVkIGZvciAle3NlY29uZHN9IHNlY29uZHMsIGFib3J0aW5nLidcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IG9wdGlvbnNcbiAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGZvcm1EYXRhOiB0cnVlLFxuICAgICAgZmllbGROYW1lOiAnZmlsZXNbXScsXG4gICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgIG1ldGFGaWVsZHM6IG51bGwsXG4gICAgICByZXNwb25zZVVybEZpZWxkTmFtZTogJ3VybCcsXG4gICAgICBidW5kbGU6IHRydWUsXG4gICAgICBoZWFkZXJzOiB7fSxcbiAgICAgIGxvY2FsZTogZGVmYXVsdExvY2FsZSxcbiAgICAgIHRpbWVvdXQ6IDMwICogMTAwMCxcbiAgICAgIGxpbWl0OiAwLFxuICAgICAgZ2V0UmVzcG9uc2VEYXRhICh4aHIpIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKVxuICAgICAgfSxcbiAgICAgIGdldFJlc3BvbnNlRXJyb3IgKHhocikge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdVcGxvYWQgZXJyb3InKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1lcmdlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSBvbmVzIHNldCBieSB1c2VyXG4gICAgdGhpcy5vcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdHMpXG4gICAgdGhpcy5sb2NhbGUgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0TG9jYWxlLCB0aGlzLm9wdHMubG9jYWxlKVxuICAgIHRoaXMubG9jYWxlLnN0cmluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0TG9jYWxlLnN0cmluZ3MsIHRoaXMub3B0cy5sb2NhbGUuc3RyaW5ncylcblxuICAgIC8vIGkxOG5cbiAgICB0aGlzLnRyYW5zbGF0b3IgPSBuZXcgVHJhbnNsYXRvcih7IGxvY2FsZTogdGhpcy5sb2NhbGUgfSlcbiAgICB0aGlzLmkxOG4gPSB0aGlzLnRyYW5zbGF0b3IudHJhbnNsYXRlLmJpbmQodGhpcy50cmFuc2xhdG9yKVxuXG4gICAgdGhpcy5oYW5kbGVVcGxvYWQgPSB0aGlzLmhhbmRsZVVwbG9hZC5iaW5kKHRoaXMpXG5cbiAgICAvLyBTaW11bHRhbmVvdXMgdXBsb2FkIGxpbWl0aW5nIGlzIHNoYXJlZCBhY3Jvc3MgYWxsIHVwbG9hZHMgd2l0aCB0aGlzIHBsdWdpbi5cbiAgICBpZiAodHlwZW9mIHRoaXMub3B0cy5saW1pdCA9PT0gJ251bWJlcicgJiYgdGhpcy5vcHRzLmxpbWl0ICE9PSAwKSB7XG4gICAgICB0aGlzLmxpbWl0VXBsb2FkcyA9IGxpbWl0UHJvbWlzZXModGhpcy5vcHRzLmxpbWl0KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxpbWl0VXBsb2FkcyA9IChmbikgPT4gZm5cbiAgICB9XG4gIH1cblxuICBnZXRPcHRpb25zIChmaWxlKSB7XG4gICAgY29uc3Qgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sXG4gICAgICB0aGlzLm9wdHMsXG4gICAgICB0aGlzLnVwcHkuc3RhdGUueGhyVXBsb2FkIHx8IHt9LFxuICAgICAgZmlsZS54aHJVcGxvYWQgfHwge31cbiAgICApXG4gICAgb3B0cy5oZWFkZXJzID0ge31cbiAgICBPYmplY3QuYXNzaWduKG9wdHMuaGVhZGVycywgdGhpcy5vcHRzLmhlYWRlcnMpXG4gICAgaWYgKHRoaXMudXBweS5zdGF0ZS54aHJVcGxvYWQpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ob3B0cy5oZWFkZXJzLCB0aGlzLnVwcHkuc3RhdGUueGhyVXBsb2FkLmhlYWRlcnMpXG4gICAgfVxuICAgIGlmIChmaWxlLnhoclVwbG9hZCkge1xuICAgICAgT2JqZWN0LmFzc2lnbihvcHRzLmhlYWRlcnMsIGZpbGUueGhyVXBsb2FkLmhlYWRlcnMpXG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdHNcbiAgfVxuXG4gIGNyZWF0ZUZvcm1EYXRhVXBsb2FkIChmaWxlLCBvcHRzKSB7XG4gICAgY29uc3QgZm9ybVBvc3QgPSBuZXcgRm9ybURhdGEoKVxuXG4gICAgY29uc3QgbWV0YUZpZWxkcyA9IEFycmF5LmlzQXJyYXkob3B0cy5tZXRhRmllbGRzKVxuICAgICAgPyBvcHRzLm1ldGFGaWVsZHNcbiAgICAgIC8vIFNlbmQgYWxvbmcgYWxsIGZpZWxkcyBieSBkZWZhdWx0LlxuICAgICAgOiBPYmplY3Qua2V5cyhmaWxlLm1ldGEpXG4gICAgbWV0YUZpZWxkcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBmb3JtUG9zdC5hcHBlbmQoaXRlbSwgZmlsZS5tZXRhW2l0ZW1dKVxuICAgIH0pXG5cbiAgICBmb3JtUG9zdC5hcHBlbmQob3B0cy5maWVsZE5hbWUsIGZpbGUuZGF0YSlcblxuICAgIHJldHVybiBmb3JtUG9zdFxuICB9XG5cbiAgY3JlYXRlQmFyZVVwbG9hZCAoZmlsZSwgb3B0cykge1xuICAgIHJldHVybiBmaWxlLmRhdGFcbiAgfVxuXG4gIHVwbG9hZCAoZmlsZSwgY3VycmVudCwgdG90YWwpIHtcbiAgICBjb25zdCBvcHRzID0gdGhpcy5nZXRPcHRpb25zKGZpbGUpXG5cbiAgICB0aGlzLnVwcHkubG9nKGB1cGxvYWRpbmcgJHtjdXJyZW50fSBvZiAke3RvdGFsfWApXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBvcHRzLmZvcm1EYXRhXG4gICAgICAgID8gdGhpcy5jcmVhdGVGb3JtRGF0YVVwbG9hZChmaWxlLCBvcHRzKVxuICAgICAgICA6IHRoaXMuY3JlYXRlQmFyZVVwbG9hZChmaWxlLCBvcHRzKVxuXG4gICAgICBjb25zdCBvblRpbWVkT3V0ID0gKCkgPT4ge1xuICAgICAgICB4aHIuYWJvcnQoKVxuICAgICAgICB0aGlzLnVwcHkubG9nKGBbWEhSVXBsb2FkXSAke2lkfSB0aW1lZCBvdXRgKVxuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcih0aGlzLmkxOG4oJ3RpbWVkT3V0JywgeyBzZWNvbmRzOiBNYXRoLmNlaWwob3B0cy50aW1lb3V0IC8gMTAwMCkgfSkpXG4gICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtZXJyb3InLCBmaWxlLmlkLCBlcnJvcilcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfVxuICAgICAgbGV0IGFsaXZlVGltZXJcbiAgICAgIGNvbnN0IGlzQWxpdmUgPSAoKSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dChhbGl2ZVRpbWVyKVxuICAgICAgICBhbGl2ZVRpbWVyID0gc2V0VGltZW91dChvblRpbWVkT3V0LCBvcHRzLnRpbWVvdXQpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICBjb25zdCBpZCA9IGN1aWQoKVxuXG4gICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRzdGFydCcsIChldikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkubG9nKGBbWEhSVXBsb2FkXSAke2lkfSBzdGFydGVkYClcbiAgICAgICAgaWYgKG9wdHMudGltZW91dCA+IDApIHtcbiAgICAgICAgICAvLyBCZWdpbiBjaGVja2luZyBmb3IgdGltZW91dHMgd2hlbiBsb2FkaW5nIHN0YXJ0cy5cbiAgICAgICAgICBpc0FsaXZlKClcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChldikgPT4ge1xuICAgICAgICB0aGlzLnVwcHkubG9nKGBbWEhSVXBsb2FkXSAke2lkfSBwcm9ncmVzczogJHtldi5sb2FkZWR9IC8gJHtldi50b3RhbH1gKVxuICAgICAgICBpZiAob3B0cy50aW1lb3V0ID4gMCkge1xuICAgICAgICAgIGlzQWxpdmUoKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLXByb2dyZXNzJywge1xuICAgICAgICAgICAgdXBsb2FkZXI6IHRoaXMsXG4gICAgICAgICAgICBpZDogZmlsZS5pZCxcbiAgICAgICAgICAgIGJ5dGVzVXBsb2FkZWQ6IGV2LmxvYWRlZCxcbiAgICAgICAgICAgIGJ5dGVzVG90YWw6IGV2LnRvdGFsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXYpID0+IHtcbiAgICAgICAgdGhpcy51cHB5LmxvZyhgW1hIUlVwbG9hZF0gJHtpZH0gZmluaXNoZWRgKVxuICAgICAgICBjbGVhclRpbWVvdXQoYWxpdmVUaW1lcilcblxuICAgICAgICBpZiAoZXYudGFyZ2V0LnN0YXR1cyA+PSAyMDAgJiYgZXYudGFyZ2V0LnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgIGNvbnN0IHJlc3AgPSBvcHRzLmdldFJlc3BvbnNlRGF0YSh4aHIpXG4gICAgICAgICAgY29uc3QgdXBsb2FkVVJMID0gcmVzcFtvcHRzLnJlc3BvbnNlVXJsRmllbGROYW1lXVxuXG4gICAgICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdWNjZXNzJywgZmlsZS5pZCwgcmVzcCwgdXBsb2FkVVJMKVxuXG4gICAgICAgICAgaWYgKHVwbG9hZFVSTCkge1xuICAgICAgICAgICAgdGhpcy51cHB5LmxvZyhgRG93bmxvYWQgJHtmaWxlLm5hbWV9IGZyb20gJHtmaWxlLnVwbG9hZFVSTH1gKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiByZXNvbHZlKGZpbGUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgZXJyb3IgPSBvcHRzLmdldFJlc3BvbnNlRXJyb3IoeGhyKSB8fCBuZXcgRXJyb3IoJ1VwbG9hZCBlcnJvcicpXG4gICAgICAgICAgZXJyb3IucmVxdWVzdCA9IHhoclxuICAgICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtZXJyb3InLCBmaWxlLmlkLCBlcnJvcilcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZXYpID0+IHtcbiAgICAgICAgdGhpcy51cHB5LmxvZyhgW1hIUlVwbG9hZF0gJHtpZH0gZXJyb3JlZGApXG4gICAgICAgIGNsZWFyVGltZW91dChhbGl2ZVRpbWVyKVxuXG4gICAgICAgIGNvbnN0IGVycm9yID0gb3B0cy5nZXRSZXNwb25zZUVycm9yKHhocikgfHwgbmV3IEVycm9yKCdVcGxvYWQgZXJyb3InKVxuICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZS5pZCwgZXJyb3IpXG4gICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpXG4gICAgICB9KVxuXG4gICAgICB4aHIub3BlbihvcHRzLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBvcHRzLmVuZHBvaW50LCB0cnVlKVxuXG4gICAgICBPYmplY3Qua2V5cyhvcHRzLmhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIG9wdHMuaGVhZGVyc1toZWFkZXJdKVxuICAgICAgfSlcblxuICAgICAgeGhyLnNlbmQoZGF0YSlcblxuICAgICAgdGhpcy51cHB5Lm9uKCd1cGxvYWQtY2FuY2VsJywgKGZpbGVJRCkgPT4ge1xuICAgICAgICBpZiAoZmlsZUlEID09PSBmaWxlLmlkKSB7XG4gICAgICAgICAgeGhyLmFib3J0KClcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy51cHB5Lm9uKCdjYW5jZWwtYWxsJywgKCkgPT4ge1xuICAgICAgICAvLyBjb25zdCBmaWxlcyA9IHRoaXMudXBweS5nZXRTdGF0ZSgpLmZpbGVzXG4gICAgICAgIC8vIGlmICghZmlsZXNbZmlsZS5pZF0pIHJldHVyblxuICAgICAgICB4aHIuYWJvcnQoKVxuICAgICAgfSlcblxuICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZS5pZClcbiAgICB9KVxuICB9XG5cbiAgdXBsb2FkUmVtb3RlIChmaWxlLCBjdXJyZW50LCB0b3RhbCkge1xuICAgIGNvbnN0IG9wdHMgPSB0aGlzLmdldE9wdGlvbnMoZmlsZSlcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy51cHB5LmVtaXQoJ3VwbG9hZC1zdGFydGVkJywgZmlsZS5pZClcblxuICAgICAgY29uc3QgZmllbGRzID0ge31cbiAgICAgIGNvbnN0IG1ldGFGaWVsZHMgPSBBcnJheS5pc0FycmF5KG9wdHMubWV0YUZpZWxkcylcbiAgICAgICAgPyBvcHRzLm1ldGFGaWVsZHNcbiAgICAgICAgLy8gU2VuZCBhbG9uZyBhbGwgZmllbGRzIGJ5IGRlZmF1bHQuXG4gICAgICAgIDogT2JqZWN0LmtleXMoZmlsZS5tZXRhKVxuXG4gICAgICBtZXRhRmllbGRzLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgZmllbGRzW25hbWVdID0gZmlsZS5tZXRhW25hbWVdXG4gICAgICB9KVxuXG4gICAgICBmZXRjaChmaWxlLnJlbW90ZS51cmwsIHtcbiAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmFzc2lnbih7fSwgZmlsZS5yZW1vdGUuYm9keSwge1xuICAgICAgICAgIGVuZHBvaW50OiBvcHRzLmVuZHBvaW50LFxuICAgICAgICAgIHNpemU6IGZpbGUuZGF0YS5zaXplLFxuICAgICAgICAgIGZpZWxkbmFtZTogb3B0cy5maWVsZE5hbWUsXG4gICAgICAgICAgZmllbGRzLFxuICAgICAgICAgIGhlYWRlcnM6IG9wdHMuaGVhZGVyc1xuICAgICAgICB9KSlcbiAgICAgIH0pXG4gICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgIGlmIChyZXMuc3RhdHVzIDwgMjAwICYmIHJlcy5zdGF0dXMgPiAzMDApIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KHJlcy5zdGF0dXNUZXh0KVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzLmpzb24oKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgY29uc3QgdG9rZW4gPSBkYXRhLnRva2VuXG4gICAgICAgICAgY29uc3QgaG9zdCA9IGdldFNvY2tldEhvc3QoZmlsZS5yZW1vdGUuaG9zdClcbiAgICAgICAgICBjb25zdCBzb2NrZXQgPSBuZXcgVXBweVNvY2tldCh7IHRhcmdldDogYCR7aG9zdH0vYXBpLyR7dG9rZW59YCB9KVxuXG4gICAgICAgICAgc29ja2V0Lm9uKCdwcm9ncmVzcycsIChwcm9ncmVzc0RhdGEpID0+IGVtaXRTb2NrZXRQcm9ncmVzcyh0aGlzLCBwcm9ncmVzc0RhdGEsIGZpbGUpKVxuXG4gICAgICAgICAgc29ja2V0Lm9uKCdzdWNjZXNzJywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBweS5lbWl0KCd1cGxvYWQtc3VjY2VzcycsIGZpbGUuaWQsIGRhdGEsIGRhdGEudXJsKVxuICAgICAgICAgICAgc29ja2V0LmNsb3NlKClcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKClcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgc29ja2V0Lm9uKCdlcnJvcicsIChlcnJEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwcHkuZW1pdCgndXBsb2FkLWVycm9yJywgZmlsZS5pZCwgbmV3IEVycm9yKGVyckRhdGEuZXJyb3IpKVxuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihlcnJEYXRhLmVycm9yKSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgdXBsb2FkRmlsZXMgKGZpbGVzKSB7XG4gICAgY29uc3QgYWN0aW9ucyA9IGZpbGVzLm1hcCgoZmlsZSwgaSkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudCA9IHBhcnNlSW50KGksIDEwKSArIDFcbiAgICAgIGNvbnN0IHRvdGFsID0gZmlsZXMubGVuZ3RoXG5cbiAgICAgIGlmIChmaWxlLmVycm9yKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZmlsZS5lcnJvcikpXG4gICAgICB9IGVsc2UgaWYgKGZpbGUuaXNSZW1vdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXBsb2FkUmVtb3RlLmJpbmQodGhpcywgZmlsZSwgY3VycmVudCwgdG90YWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy51cGxvYWQuYmluZCh0aGlzLCBmaWxlLCBjdXJyZW50LCB0b3RhbClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBhY3Rpb25zLm1hcCgoYWN0aW9uKSA9PiB7XG4gICAgICBjb25zdCBsaW1pdGVkQWN0aW9uID0gdGhpcy5saW1pdFVwbG9hZHMoYWN0aW9uKVxuICAgICAgcmV0dXJuIGxpbWl0ZWRBY3Rpb24oKVxuICAgIH0pXG5cbiAgICByZXR1cm4gc2V0dGxlKHByb21pc2VzKVxuICB9XG5cbiAgaGFuZGxlVXBsb2FkIChmaWxlSURzKSB7XG4gICAgaWYgKGZpbGVJRHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnVwcHkubG9nKCdbWEhSVXBsb2FkXSBObyBmaWxlcyB0byB1cGxvYWQhJylcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIH1cblxuICAgIHRoaXMudXBweS5sb2coJ1tYSFJVcGxvYWRdIFVwbG9hZGluZy4uLicpXG4gICAgY29uc3QgZmlsZXMgPSBmaWxlSURzLm1hcChnZXRGaWxlLCB0aGlzKVxuICAgIGZ1bmN0aW9uIGdldEZpbGUgKGZpbGVJRCkge1xuICAgICAgcmV0dXJuIHRoaXMudXBweS5zdGF0ZS5maWxlc1tmaWxlSURdXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudXBsb2FkRmlsZXMoZmlsZXMpLnRoZW4oKCkgPT4gbnVsbClcbiAgfVxuXG4gIGluc3RhbGwgKCkge1xuICAgIHRoaXMudXBweS5hZGRVcGxvYWRlcih0aGlzLmhhbmRsZVVwbG9hZClcbiAgfVxuXG4gIHVuaW5zdGFsbCAoKSB7XG4gICAgdGhpcy51cHB5LnJlbW92ZVVwbG9hZGVyKHRoaXMuaGFuZGxlVXBsb2FkKVxuICB9XG59XG4iLCIvKipcbiAqIERlZmF1bHQgc3RvcmUgdGhhdCBrZWVwcyBzdGF0ZSBpbiBhIHNpbXBsZSBvYmplY3QuXG4gKi9cbmNsYXNzIERlZmF1bHRTdG9yZSB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnN0YXRlID0ge31cbiAgICB0aGlzLmNhbGxiYWNrcyA9IFtdXG4gIH1cblxuICBnZXRTdGF0ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGVcbiAgfVxuXG4gIHNldFN0YXRlIChwYXRjaCkge1xuICAgIGNvbnN0IHByZXZTdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUpXG4gICAgY29uc3QgbmV4dFN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZSwgcGF0Y2gpXG5cbiAgICB0aGlzLnN0YXRlID0gbmV4dFN0YXRlXG4gICAgdGhpcy5fcHVibGlzaChwcmV2U3RhdGUsIG5leHRTdGF0ZSwgcGF0Y2gpXG4gIH1cblxuICBzdWJzY3JpYmUgKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5jYWxsYmFja3MucHVzaChsaXN0ZW5lcilcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBsaXN0ZW5lci5cbiAgICAgIHRoaXMuY2FsbGJhY2tzLnNwbGljZShcbiAgICAgICAgdGhpcy5jYWxsYmFja3MuaW5kZXhPZihsaXN0ZW5lciksXG4gICAgICAgIDFcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBfcHVibGlzaCAoLi4uYXJncykge1xuICAgIHRoaXMuY2FsbGJhY2tzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG4gICAgICBsaXN0ZW5lciguLi5hcmdzKVxuICAgIH0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZhdWx0U3RvcmUgKCkge1xuICByZXR1cm4gbmV3IERlZmF1bHRTdG9yZSgpXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gaW5wdXQgPT4ge1xuXHRjb25zdCBidWYgPSBuZXcgVWludDhBcnJheShpbnB1dCk7XG5cblx0aWYgKCEoYnVmICYmIGJ1Zi5sZW5ndGggPiAxKSkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Y29uc3QgY2hlY2sgPSAoaGVhZGVyLCBvcHRzKSA9PiB7XG5cdFx0b3B0cyA9IE9iamVjdC5hc3NpZ24oe1xuXHRcdFx0b2Zmc2V0OiAwXG5cdFx0fSwgb3B0cyk7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGhlYWRlci5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGhlYWRlcltpXSAhPT0gYnVmW2kgKyBvcHRzLm9mZnNldF0pIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xuXG5cdGlmIChjaGVjayhbMHhGRiwgMHhEOCwgMHhGRl0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2pwZycsXG5cdFx0XHRtaW1lOiAnaW1hZ2UvanBlZydcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDg5LCAweDUwLCAweDRFLCAweDQ3LCAweDBELCAweDBBLCAweDFBLCAweDBBXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAncG5nJyxcblx0XHRcdG1pbWU6ICdpbWFnZS9wbmcnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0NywgMHg0OSwgMHg0Nl0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2dpZicsXG5cdFx0XHRtaW1lOiAnaW1hZ2UvZ2lmJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NTcsIDB4NDUsIDB4NDIsIDB4NTBdLCB7b2Zmc2V0OiA4fSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnd2VicCcsXG5cdFx0XHRtaW1lOiAnaW1hZ2Uvd2VicCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQ2LCAweDRDLCAweDQ5LCAweDQ2XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZmxpZicsXG5cdFx0XHRtaW1lOiAnaW1hZ2UvZmxpZidcblx0XHR9O1xuXHR9XG5cblx0Ly8gTmVlZHMgdG8gYmUgYmVmb3JlIGB0aWZgIGNoZWNrXG5cdGlmIChcblx0XHQoY2hlY2soWzB4NDksIDB4NDksIDB4MkEsIDB4MF0pIHx8IGNoZWNrKFsweDRELCAweDRELCAweDAsIDB4MkFdKSkgJiZcblx0XHRjaGVjayhbMHg0MywgMHg1Ml0sIHtvZmZzZXQ6IDh9KVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnY3IyJyxcblx0XHRcdG1pbWU6ICdpbWFnZS94LWNhbm9uLWNyMidcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDQ5LCAweDQ5LCAweDJBLCAweDBdKSB8fFxuXHRcdGNoZWNrKFsweDRELCAweDRELCAweDAsIDB4MkFdKVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAndGlmJyxcblx0XHRcdG1pbWU6ICdpbWFnZS90aWZmJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDIsIDB4NERdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdibXAnLFxuXHRcdFx0bWltZTogJ2ltYWdlL2JtcCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQ5LCAweDQ5LCAweEJDXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnanhyJyxcblx0XHRcdG1pbWU6ICdpbWFnZS92bmQubXMtcGhvdG8nXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgzOCwgMHg0MiwgMHg1MCwgMHg1M10pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3BzZCcsXG5cdFx0XHRtaW1lOiAnaW1hZ2Uvdm5kLmFkb2JlLnBob3Rvc2hvcCdcblx0XHR9O1xuXHR9XG5cblx0Ly8gTmVlZHMgdG8gYmUgYmVmb3JlIHRoZSBgemlwYCBjaGVja1xuXHRpZiAoXG5cdFx0Y2hlY2soWzB4NTAsIDB4NEIsIDB4MywgMHg0XSkgJiZcblx0XHRjaGVjayhbMHg2RCwgMHg2OSwgMHg2RCwgMHg2NSwgMHg3NCwgMHg3OSwgMHg3MCwgMHg2NSwgMHg2MSwgMHg3MCwgMHg3MCwgMHg2QywgMHg2OSwgMHg2MywgMHg2MSwgMHg3NCwgMHg2OSwgMHg2RiwgMHg2RSwgMHgyRiwgMHg2NSwgMHg3MCwgMHg3NSwgMHg2MiwgMHgyQiwgMHg3QSwgMHg2OSwgMHg3MF0sIHtvZmZzZXQ6IDMwfSlcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2VwdWInLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL2VwdWIremlwJ1xuXHRcdH07XG5cdH1cblxuXHQvLyBOZWVkcyB0byBiZSBiZWZvcmUgYHppcGAgY2hlY2tcblx0Ly8gQXNzdW1lcyBzaWduZWQgYC54cGlgIGZyb20gYWRkb25zLm1vemlsbGEub3JnXG5cdGlmIChcblx0XHRjaGVjayhbMHg1MCwgMHg0QiwgMHgzLCAweDRdKSAmJlxuXHRcdGNoZWNrKFsweDRELCAweDQ1LCAweDU0LCAweDQxLCAweDJELCAweDQ5LCAweDRFLCAweDQ2LCAweDJGLCAweDZELCAweDZGLCAweDdBLCAweDY5LCAweDZDLCAweDZDLCAweDYxLCAweDJFLCAweDcyLCAweDczLCAweDYxXSwge29mZnNldDogMzB9KVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAneHBpJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LXhwaW5zdGFsbCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDUwLCAweDRCXSkgJiZcblx0XHQoYnVmWzJdID09PSAweDMgfHwgYnVmWzJdID09PSAweDUgfHwgYnVmWzJdID09PSAweDcpICYmXG5cdFx0KGJ1ZlszXSA9PT0gMHg0IHx8IGJ1ZlszXSA9PT0gMHg2IHx8IGJ1ZlszXSA9PT0gMHg4KVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnemlwJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi96aXAnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg3NSwgMHg3MywgMHg3NCwgMHg2MSwgMHg3Ml0sIHtvZmZzZXQ6IDI1N30pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3RhcicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC10YXInXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHRjaGVjayhbMHg1MiwgMHg2MSwgMHg3MiwgMHgyMSwgMHgxQSwgMHg3XSkgJiZcblx0XHQoYnVmWzZdID09PSAweDAgfHwgYnVmWzZdID09PSAweDEpXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdyYXInLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtcmFyLWNvbXByZXNzZWQnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgxRiwgMHg4QiwgMHg4XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZ3onLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL2d6aXAnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0MiwgMHg1QSwgMHg2OF0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2J6MicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1iemlwMidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDM3LCAweDdBLCAweEJDLCAweEFGLCAweDI3LCAweDFDXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnN3onLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtN3otY29tcHJlc3NlZCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDc4LCAweDAxXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZG1nJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LWFwcGxlLWRpc2tpbWFnZSdcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdChcblx0XHRcdGNoZWNrKFsweDAsIDB4MCwgMHgwXSkgJiZcblx0XHRcdChidWZbM10gPT09IDB4MTggfHwgYnVmWzNdID09PSAweDIwKSAmJlxuXHRcdFx0Y2hlY2soWzB4NjYsIDB4NzQsIDB4NzksIDB4NzBdLCB7b2Zmc2V0OiA0fSlcblx0XHQpIHx8XG5cdFx0Y2hlY2soWzB4MzMsIDB4NjcsIDB4NzAsIDB4MzVdKSB8fFxuXHRcdChcblx0XHRcdGNoZWNrKFsweDAsIDB4MCwgMHgwLCAweDFDLCAweDY2LCAweDc0LCAweDc5LCAweDcwLCAweDZELCAweDcwLCAweDM0LCAweDMyXSkgJiZcblx0XHRcdGNoZWNrKFsweDZELCAweDcwLCAweDM0LCAweDMxLCAweDZELCAweDcwLCAweDM0LCAweDMyLCAweDY5LCAweDczLCAweDZGLCAweDZEXSwge29mZnNldDogMTZ9KVxuXHRcdCkgfHxcblx0XHRjaGVjayhbMHgwLCAweDAsIDB4MCwgMHgxQywgMHg2NiwgMHg3NCwgMHg3OSwgMHg3MCwgMHg2OSwgMHg3MywgMHg2RiwgMHg2RF0pIHx8XG5cdFx0Y2hlY2soWzB4MCwgMHgwLCAweDAsIDB4MUMsIDB4NjYsIDB4NzQsIDB4NzksIDB4NzAsIDB4NkQsIDB4NzAsIDB4MzQsIDB4MzIsIDB4MCwgMHgwLCAweDAsIDB4MF0pXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdtcDQnLFxuXHRcdFx0bWltZTogJ3ZpZGVvL21wNCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDAsIDB4MCwgMHgwLCAweDFDLCAweDY2LCAweDc0LCAweDc5LCAweDcwLCAweDRELCAweDM0LCAweDU2XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbTR2Jyxcblx0XHRcdG1pbWU6ICd2aWRlby94LW00didcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDRELCAweDU0LCAweDY4LCAweDY0XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnbWlkJyxcblx0XHRcdG1pbWU6ICdhdWRpby9taWRpJ1xuXHRcdH07XG5cdH1cblxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vdGhyZWF0c3RhY2svbGlibWFnaWMvYmxvYi9tYXN0ZXIvbWFnaWMvTWFnZGlyL21hdHJvc2thXG5cdGlmIChjaGVjayhbMHgxQSwgMHg0NSwgMHhERiwgMHhBM10pKSB7XG5cdFx0Y29uc3Qgc2xpY2VkID0gYnVmLnN1YmFycmF5KDQsIDQgKyA0MDk2KTtcblx0XHRjb25zdCBpZFBvcyA9IHNsaWNlZC5maW5kSW5kZXgoKGVsLCBpLCBhcnIpID0+IGFycltpXSA9PT0gMHg0MiAmJiBhcnJbaSArIDFdID09PSAweDgyKTtcblxuXHRcdGlmIChpZFBvcyA+PSAwKSB7XG5cdFx0XHRjb25zdCBkb2NUeXBlUG9zID0gaWRQb3MgKyAzO1xuXHRcdFx0Y29uc3QgZmluZERvY1R5cGUgPSB0eXBlID0+IEFycmF5LmZyb20odHlwZSkuZXZlcnkoKGMsIGkpID0+IHNsaWNlZFtkb2NUeXBlUG9zICsgaV0gPT09IGMuY2hhckNvZGVBdCgwKSk7XG5cblx0XHRcdGlmIChmaW5kRG9jVHlwZSgnbWF0cm9za2EnKSkge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGV4dDogJ21rdicsXG5cdFx0XHRcdFx0bWltZTogJ3ZpZGVvL3gtbWF0cm9za2EnXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdGlmIChmaW5kRG9jVHlwZSgnd2VibScpKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0ZXh0OiAnd2VibScsXG5cdFx0XHRcdFx0bWltZTogJ3ZpZGVvL3dlYm0nXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aWYgKGNoZWNrKFsweDAsIDB4MCwgMHgwLCAweDE0LCAweDY2LCAweDc0LCAweDc5LCAweDcwLCAweDcxLCAweDc0LCAweDIwLCAweDIwXSkgfHxcblx0XHRjaGVjayhbMHg2NiwgMHg3MiwgMHg2NSwgMHg2NV0sIHtvZmZzZXQ6IDR9KSB8fFxuXHRcdGNoZWNrKFsweDY2LCAweDc0LCAweDc5LCAweDcwLCAweDcxLCAweDc0LCAweDIwLCAweDIwXSwge29mZnNldDogNH0pIHx8XG5cdFx0Y2hlY2soWzB4NkQsIDB4NjQsIDB4NjEsIDB4NzRdLCB7b2Zmc2V0OiA0fSkgfHwgLy8gTUpQRUdcblx0XHRjaGVjayhbMHg3NywgMHg2OSwgMHg2NCwgMHg2NV0sIHtvZmZzZXQ6IDR9KSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdtb3YnLFxuXHRcdFx0bWltZTogJ3ZpZGVvL3F1aWNrdGltZSdcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDUyLCAweDQ5LCAweDQ2LCAweDQ2XSkgJiZcblx0XHRjaGVjayhbMHg0MSwgMHg1NiwgMHg0OV0sIHtvZmZzZXQ6IDh9KVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYXZpJyxcblx0XHRcdG1pbWU6ICd2aWRlby94LW1zdmlkZW8nXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgzMCwgMHgyNiwgMHhCMiwgMHg3NSwgMHg4RSwgMHg2NiwgMHhDRiwgMHgxMSwgMHhBNiwgMHhEOV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3dtdicsXG5cdFx0XHRtaW1lOiAndmlkZW8veC1tcy13bXYnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgwLCAweDAsIDB4MSwgMHhCQV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ21wZycsXG5cdFx0XHRtaW1lOiAndmlkZW8vbXBlZydcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDQ5LCAweDQ0LCAweDMzXSkgfHxcblx0XHRjaGVjayhbMHhGRiwgMHhGQl0pXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdtcDMnLFxuXHRcdFx0bWltZTogJ2F1ZGlvL21wZWcnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHRjaGVjayhbMHg2NiwgMHg3NCwgMHg3OSwgMHg3MCwgMHg0RCwgMHgzNCwgMHg0MV0sIHtvZmZzZXQ6IDR9KSB8fFxuXHRcdGNoZWNrKFsweDRELCAweDM0LCAweDQxLCAweDIwXSlcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ200YScsXG5cdFx0XHRtaW1lOiAnYXVkaW8vbTRhJ1xuXHRcdH07XG5cdH1cblxuXHQvLyBOZWVkcyB0byBiZSBiZWZvcmUgYG9nZ2AgY2hlY2tcblx0aWYgKGNoZWNrKFsweDRGLCAweDcwLCAweDc1LCAweDczLCAweDQ4LCAweDY1LCAweDYxLCAweDY0XSwge29mZnNldDogMjh9KSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdvcHVzJyxcblx0XHRcdG1pbWU6ICdhdWRpby9vcHVzJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NEYsIDB4NjcsIDB4NjcsIDB4NTNdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdvZ2cnLFxuXHRcdFx0bWltZTogJ2F1ZGlvL29nZydcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDY2LCAweDRDLCAweDYxLCAweDQzXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnZmxhYycsXG5cdFx0XHRtaW1lOiAnYXVkaW8veC1mbGFjJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoXG5cdFx0Y2hlY2soWzB4NTIsIDB4NDksIDB4NDYsIDB4NDZdKSAmJlxuXHRcdGNoZWNrKFsweDU3LCAweDQxLCAweDU2LCAweDQ1XSwge29mZnNldDogOH0pXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICd3YXYnLFxuXHRcdFx0bWltZTogJ2F1ZGlvL3gtd2F2J1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4MjMsIDB4MjEsIDB4NDEsIDB4NEQsIDB4NTIsIDB4MEFdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdhbXInLFxuXHRcdFx0bWltZTogJ2F1ZGlvL2Ftcidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDI1LCAweDUwLCAweDQ0LCAweDQ2XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAncGRmJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi9wZGYnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0RCwgMHg1QV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2V4ZScsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1tc2Rvd25sb2FkJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoXG5cdFx0KGJ1ZlswXSA9PT0gMHg0MyB8fCBidWZbMF0gPT09IDB4NDYpICYmXG5cdFx0Y2hlY2soWzB4NTcsIDB4NTNdLCB7b2Zmc2V0OiAxfSlcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3N3ZicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg3QiwgMHg1QywgMHg3MiwgMHg3NCwgMHg2Nl0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3J0ZicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24vcnRmJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4MDAsIDB4NjEsIDB4NzMsIDB4NkRdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICd3YXNtJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi93YXNtJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoXG5cdFx0Y2hlY2soWzB4NzcsIDB4NEYsIDB4NDYsIDB4NDZdKSAmJlxuXHRcdChcblx0XHRcdGNoZWNrKFsweDAwLCAweDAxLCAweDAwLCAweDAwXSwge29mZnNldDogNH0pIHx8XG5cdFx0XHRjaGVjayhbMHg0RiwgMHg1NCwgMHg1NCwgMHg0Rl0sIHtvZmZzZXQ6IDR9KVxuXHRcdClcblx0KSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3dvZmYnLFxuXHRcdFx0bWltZTogJ2ZvbnQvd29mZidcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDc3LCAweDRGLCAweDQ2LCAweDMyXSkgJiZcblx0XHQoXG5cdFx0XHRjaGVjayhbMHgwMCwgMHgwMSwgMHgwMCwgMHgwMF0sIHtvZmZzZXQ6IDR9KSB8fFxuXHRcdFx0Y2hlY2soWzB4NEYsIDB4NTQsIDB4NTQsIDB4NEZdLCB7b2Zmc2V0OiA0fSlcblx0XHQpXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICd3b2ZmMicsXG5cdFx0XHRtaW1lOiAnZm9udC93b2ZmMidcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDRDLCAweDUwXSwge29mZnNldDogMzR9KSAmJlxuXHRcdChcblx0XHRcdGNoZWNrKFsweDAwLCAweDAwLCAweDAxXSwge29mZnNldDogOH0pIHx8XG5cdFx0XHRjaGVjayhbMHgwMSwgMHgwMCwgMHgwMl0sIHtvZmZzZXQ6IDh9KSB8fFxuXHRcdFx0Y2hlY2soWzB4MDIsIDB4MDAsIDB4MDJdLCB7b2Zmc2V0OiA4fSlcblx0XHQpXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdlb3QnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDAwLCAweDAxLCAweDAwLCAweDAwLCAweDAwXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAndHRmJyxcblx0XHRcdG1pbWU6ICdmb250L3R0Zidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDRGLCAweDU0LCAweDU0LCAweDRGLCAweDAwXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnb3RmJyxcblx0XHRcdG1pbWU6ICdmb250L290Zidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDAwLCAweDAwLCAweDAxLCAweDAwXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnaWNvJyxcblx0XHRcdG1pbWU6ICdpbWFnZS94LWljb24nXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0NiwgMHg0QywgMHg1NiwgMHgwMV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2ZsdicsXG5cdFx0XHRtaW1lOiAndmlkZW8veC1mbHYnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgyNSwgMHgyMV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ3BzJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi9wb3N0c2NyaXB0J1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4RkQsIDB4MzcsIDB4N0EsIDB4NTgsIDB4NUEsIDB4MDBdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICd4eicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC14eidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDUzLCAweDUxLCAweDRDLCAweDY5XSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnc3FsaXRlJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LXNxbGl0ZTMnXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHg0RSwgMHg0NSwgMHg1MywgMHgxQV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ25lcycsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1uaW50ZW5kby1uZXMtcm9tJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NDMsIDB4NzIsIDB4MzIsIDB4MzRdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdjcngnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtZ29vZ2xlLWNocm9tZS1leHRlbnNpb24nXG5cdFx0fTtcblx0fVxuXG5cdGlmIChcblx0XHRjaGVjayhbMHg0RCwgMHg1MywgMHg0MywgMHg0Nl0pIHx8XG5cdFx0Y2hlY2soWzB4NDksIDB4NTMsIDB4NjMsIDB4MjhdKVxuXHQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnY2FiJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi92bmQubXMtY2FiLWNvbXByZXNzZWQnXG5cdFx0fTtcblx0fVxuXG5cdC8vIE5lZWRzIHRvIGJlIGJlZm9yZSBgYXJgIGNoZWNrXG5cdGlmIChjaGVjayhbMHgyMSwgMHgzQywgMHg2MSwgMHg3MiwgMHg2MywgMHg2OCwgMHgzRSwgMHgwQSwgMHg2NCwgMHg2NSwgMHg2MiwgMHg2OSwgMHg2MSwgMHg2RSwgMHgyRCwgMHg2MiwgMHg2OSwgMHg2RSwgMHg2MSwgMHg3MiwgMHg3OV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2RlYicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1kZWInXG5cdFx0fTtcblx0fVxuXG5cdGlmIChjaGVjayhbMHgyMSwgMHgzQywgMHg2MSwgMHg3MiwgMHg2MywgMHg2OCwgMHgzRV0pKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ2FyJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LXVuaXgtYXJjaGl2ZSdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweEVELCAweEFCLCAweEVFLCAweERCXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAncnBtJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LXJwbSdcblx0XHR9O1xuXHR9XG5cblx0aWYgKFxuXHRcdGNoZWNrKFsweDFGLCAweEEwXSkgfHxcblx0XHRjaGVjayhbMHgxRiwgMHg5RF0pXG5cdCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdaJyxcblx0XHRcdG1pbWU6ICdhcHBsaWNhdGlvbi94LWNvbXByZXNzJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4NEMsIDB4NUEsIDB4NDksIDB4NTBdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdseicsXG5cdFx0XHRtaW1lOiAnYXBwbGljYXRpb24veC1semlwJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4RDAsIDB4Q0YsIDB4MTEsIDB4RTAsIDB4QTEsIDB4QjEsIDB4MUEsIDB4RTFdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdtc2knLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtbXNpJ1xuXHRcdH07XG5cdH1cblxuXHRpZiAoY2hlY2soWzB4MDYsIDB4MEUsIDB4MkIsIDB4MzQsIDB4MDIsIDB4MDUsIDB4MDEsIDB4MDEsIDB4MEQsIDB4MDEsIDB4MDIsIDB4MDEsIDB4MDEsIDB4MDJdKSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRleHQ6ICdteGYnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL214Zidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQ3XSwge29mZnNldDogNH0pICYmIChjaGVjayhbMHg0N10sIHtvZmZzZXQ6IDE5Mn0pIHx8IGNoZWNrKFsweDQ3XSwge29mZnNldDogMTk2fSkpKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGV4dDogJ210cycsXG5cdFx0XHRtaW1lOiAndmlkZW8vbXAydCdcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQyLCAweDRDLCAweDQ1LCAweDRFLCAweDQ0LCAweDQ1LCAweDUyXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYmxlbmQnLFxuXHRcdFx0bWltZTogJ2FwcGxpY2F0aW9uL3gtYmxlbmRlcidcblx0XHR9O1xuXHR9XG5cblx0aWYgKGNoZWNrKFsweDQyLCAweDUwLCAweDQ3LCAweEZCXSkpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXh0OiAnYnBnJyxcblx0XHRcdG1pbWU6ICdpbWFnZS9icGcnXG5cdFx0fTtcblx0fVxuXG5cdHJldHVybiBudWxsO1xufTsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiY29uc3QgVXBweSA9IHJlcXVpcmUoJ3VwcHkvbGliL2NvcmUvQ29yZScpXG5jb25zdCBGaWxlSW5wdXQgPSByZXF1aXJlKCd1cHB5L2xpYi9wbHVnaW5zL0ZpbGVJbnB1dCcpXG5jb25zdCBYSFJVcGxvYWQgPSByZXF1aXJlKCd1cHB5L2xpYi9wbHVnaW5zL1hIUlVwbG9hZCcpXG5jb25zdCBQcm9ncmVzc0JhciA9IHJlcXVpcmUoJ3VwcHkvbGliL3BsdWdpbnMvUHJvZ3Jlc3NCYXInKVxuXG5jb25zdCB1cHB5ID0gbmV3IFVwcHkoeyBkZWJ1ZzogdHJ1ZSwgYXV0b1Byb2NlZWQ6IHRydWUgfSlcbnVwcHkudXNlKEZpbGVJbnB1dCwgeyB0YXJnZXQ6ICcuVXBweUZvcm0nLCByZXBsYWNlVGFyZ2V0Q29udGVudDogdHJ1ZSB9KVxudXBweS51c2UoWEhSVXBsb2FkLCB7XG4gIGVuZHBvaW50OiAnLy9hcGkyLnRyYW5zbG9hZGl0LmNvbScsXG4gIGZvcm1EYXRhOiB0cnVlLFxuICBmaWVsZE5hbWU6ICdmaWxlc1tdJ1xufSlcbnVwcHkudXNlKFByb2dyZXNzQmFyLCB7XG4gIHRhcmdldDogJ2JvZHknLFxuICBmaXhlZDogdHJ1ZVxufSlcbnVwcHkucnVuKClcblxuY29uc29sZS5sb2coJ1VwcHkgd2l0aCBGb3JtdGFnIGFuZCBYSFJVcGxvYWQgaXMgbG9hZGVkJylcbiJdfQ==
