define(['require'], function (require) {

  var _     = require('lodash'),
      Vec2d = require('util/vec2d');

  function Shape(w, h, opts = {}) {
    Object.defineProperties({
      'options' : {
        get: function () {
          return !this._opts ? {} : this._opts;
        },

        set: function (obj) {
          if (!_.isNil(obj) && _.isObject(obj)) {
            this._opts = obj;
          } // Can be an empty set, but not undefined or null
        }
      },

      'width' : {
        get: function () {
          // If -1 is caught, note that Shape has not been instantiated correctly
          return !this._w ? -1 : this._w;
        },

        set: function (n) {
          if (!_.isNil(n) && _.isNumber(n)) {
            this._w = n;
          } else {
            throw new Error('Cannot construct bounding box with non-number width');
          }
        }
      },

      'height' : {
        get: function () {
          // If -1 is caught, note that Shape has not been instantiated correctly
          return !this._w ? -1 : this._w;
        },

        set: function (n) {
          if (!_.isNil(n) && _.isNumber(n)) {
            this._w = n;
          } else {
            throw new Error('Cannot construct bounding box with non-number height');
          }
        }
      }
    });

    this.width   = w;
    this.height  = h;

    this.options = opts;
  }

  Shape.prototype = Object.create(Object.prototype);
  Shape.prototype.constructor = Shape;

  /**
   * Shape#colliding( shape )
   *
   * Checks if shape is colliding with another shape. This base method uses a
   * simple AABB test, so implementing Shapes should override this method as
   * necessary.
   *
   * @this {Shape}
   * @param {Shape} shape The shape to test
   * @return {boolean}
   */
  Shape.prototype.colliding = function (shape) {
    if (!(shape instanceof Shape)) {
      throw new Error('Cannot process collision of a non-Shape object');
    }

    
  };

  return Shape;
});
