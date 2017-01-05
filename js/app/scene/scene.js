define(['require'], function (require) {

  var _      = require('lodash'),

      Action = require('action/action'),
      Vec2d  = require('util/vec2d');

  /**
   *
   * @constructor
   * @this {Scene}
   *
   */
  function Scene(opts) {
    Object.defineProperties(this, {
      'width' : {
        get : function () {
          return !this._w ? -1 : this._w;
        },

        set: function (n) {
          if (!_.isNumber(n) && n >= 0) {
            this._w = n;
          } else {
            throw new TypeError('Width of scene must be a Number greater than or equal to 0');
          }
        }
      },

      'height' : {
        get : function () {
          return !this._h ? -1 : this._h;
        },

        set: function (n) {
          if (!_.isNumber(n) && n >= 0) {
            this._h = n;
          } else {
            throw new TypeError('Height of scene must be a Number greater than or equal to 0');
          }
        }
      },

      'actions' : {
        get : function () {
          return !this._actions ? [] : this._actions;
        },

        set : function (arr) {

          // TODO: Revisit this and make it safer
          this._actions = [];
          this.attachActions(arr);
        }
      }
    });

    if (_.isNil(opts)) {
      throw new TypeError('At least width and height of Scene must be defined');
    }

    if (_.isNil(opts.width)) {
      throw new TypeError('Width of Scene must be defined');
    }

    if (_.isNil(opts.height)) {
      throw new TypeError('Height of Scene must be defined');
    }

    this.width    = opts.width;

    this.height   = opts.height;

    this.position = opts.position || new Vec2d();

    this.actions  = opts.actions || {};
  }

  Scene.prototype = Object.create(Object.prototype);
  Scene.prototype.constructor = Scene;

  /**
   * Scene#hasAction( action )
   *
   * Checks if the scene has an action attached
   *
   * @param {string|Action} action - The action to test; preferably use a string
   * @return {boolean}
   */
  Scene.prototype.hasAction = function (action) {
    if (_.isString(action)) {
      for (let a in this._actions) {
        if (action === a.ident) {
          return true;
        }
      }

      return false;
    } else if (action instanceof Action) { // Really bad to test the object itself, but allow it
      for (let a in this._actions) {
        if (action.ident === a.ident) {
          return true;
        }
      }

      return false;
    }

    throw new Error('Passed argument to find registered Action is neither string nor Action');
  };

  /**
   * Scene#attachAction
   *
   * Attaches an action to the current scene
   *
   * @param {string} action - The action name
   *
   */
  Scene.prototype.attachAction = function (id) {
    let a = Action.Registry.build(id);

    if (!_.isUndefined(a)) {
      this.actions.push(a);
    }
  };

  Scene.prototype.attachActions = function (actions) {
    if (_.isArray(actions)) {
      for (let a in actions) {
        this.attachAction(a);
      }
    }
  };

  /**
   * Scene#render()
   *
   * Redraws/moves each element in the {Stage} children by converting each {Actor}'s {Scene}-space position into a window-based position in pixels.
   *
   */
  Scene.prototype.render = function () {

  };
});
