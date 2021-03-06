define(['require'], function (require) {

  const _ = require('lodash');

  /**
   *
   * @constructor
   * @this {Action}
   *
   */
  function Action(id, props = [], options = {}) {

    Object.defineProperties(Action.prototype, {
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

      'options' : {
        get: function () {
          return !this._opts ? {} : this._opts; // Once again, precaution
        },

        set: function (obj) {
          let o = this._opts || {};

          if (_.isObject(obj) && !_.isEmpty(obj)) {
            o = obj;
          }

          this._opts = o;
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
   * Action#perform( data )
   *
   * Interface method -- must be implemented
   *
   * Performs the {Action} depending on a set of data
   *
   */
  Action.prototype.perform = function (data) {
    throw new Error('Action performance not implemented');
  };

  return Action;
});
