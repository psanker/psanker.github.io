define(['lodash'], function (_) {

  /**
   *
   * @constructor
   * @this {Action}
   *
   */
  function Action(name, props = [], options = {}) {

    if (!_.isString(name)) {
      throw new Exception('Undefined physical behavior name');
    } else {
      this.name   = name;
    }

    this._requiredprops = props;
    this._opts          = options;
  }

  Action.prototype = Object.create(Object.prototype);
  Action.prototype.constructor = Action;

  /**
   * Action#checkProperties( obj )
   *
   * Check if an object has the properties necessary for the {Action} to take effect
   *
   * @param {object} An object (probably an {Actor}) to test
   * @return {boolean}
   */
  Action.prototype.checkProperties = function (obj) {

    for (let i in this._requiredprops) {
      if (_.isUndefined(_.find(obj, i))) {
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
    throw new Exception('Action performance not implemented');
  };

  return Action;
});
