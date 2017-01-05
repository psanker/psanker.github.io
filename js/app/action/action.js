define(['require'], function (require) {

  const _ = require('lodash');

  /**
   *
   * @constructor
   * @this {Action}
   *
   */
  function Action(id, props = [], options = {}) {

    Object.defineProperties(this, {
      'ident' : {
        get: function () {
          return !this._ident ? 'undef-action' : this._ident; // Shouldn't happen, but hey
        },

        set: function (id) {
          if (!_.isString(id)) {
            throw new Error('Undefined physical behavior name');
          } else {
            this._ident = id;
          }
        }
      },

      'requiredProperties' : {
        get: function () {
          return !this._requiredProperties ? [] : this._requiredProperties; // Again, shouldn't happen, but hey
        },

        set: function (arr) {
          let a = this._requiredProperties || [];

          if (_.isArray(arr)) {
            a = arr;
          }

          this._requiredProperties = a;
        }
      },

      'priority' : {
        get: function () {
          return !this._priority ? -1 : this.priority;
        },

        set: function (n) {

          if (!_.isNumber(n)) {
            throw new Error('Priority of action must be a number');
          }

        }
      }
    });

    this.ident              = id;

    this.requiredProperties = props;
    this.options            = options;
  }

  Action.prototype = Object.create(Object.prototype);
  Action.prototype.constructor = Action;

  /**
   * Action#checkProperties( obj )
   *
   * Check if an object has the properties necessary for the {Action} to take effect
   * The properties should be stored in '[obj].physicalProperties'
   *
   * @this {Action}
   * @param {object} An object (probably an {Actor}) to test
   * @return {boolean}
   */
  Action.prototype.checkProperties = function (obj) {

    for (let i in this.requiredProperties) {
      if (_.isUndefined(_.find(obj.physicalProperties, i))) {
        return false;
      }
    }

    return true;
  };

  /**
   * Action#run( data )
   *
   * Interface method -- must be implemented
   *
   * Performs the {Action} depending on a set of data
   *
   */
  Action.prototype.run = function (data) {
    throw new Error('Action not implemented');
  };

  /**
   * @static @enum
   *
   * Action.Priority
   *
   * The different types of action priorities. MUST be assigned in the action implementation; else will be -1.
   *
   */
  Action.Priority = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2
  };

  /**
   * @static
   *
   * Action.Registry
   *
   */
  Action.Registry = {
    registered: {},

    register: function (Type) {

      // Verify to make sure Type is, indeed, a function
      if (_.isFunction(Type)) {
        let t = new Type();

        // Check if what the Type makes is indeed an Action
        if (t instanceof Action) {
          let id = t.ident;

          if (_.isNil(Action.Registry.registered[id])) {
            Action.Registry.registered[id] = Type;
          }
        }
      }
    },

    build: function (id) {
      if (!_.isNil(Action.Registry.registered[id])) {
        return new Action.Registry.registered[id]();
      } else {
        return undefined;
      }
    }
  };

  return Action;
});
