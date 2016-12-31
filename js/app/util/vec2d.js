/* jshint esversion: 6 */

define(['lodash', 'jquery'], function (_, $) {
  function Vec2d(coords) {
    if (_.isArray(coords)) {
      this.x = coords[0];
      this.y = coords[1];
    } else if (_.isObject(coords)) {
      this.x = coords.x;
      this.y = coords.y;
    } else {
      this.x = 0;
      this.y = 0;
    }
  }

  Vec2d.prototype = Object.create(Object.prototype);
  Vec2d.prototype.constructor = Vec2d;

  Vec2d.prototype.add = function (vec, write = false) {
    if (write) {
      this.x += vec.x;
      this.y += vec.y;
      return this;
    } else {
      return new Vec2d({
        x: this.x + vec.x,
        y: this.y + vec.y
      });
    }
  };

  Vec2d.prototype.scale = function (c, write = false) {
    if (write) {
      this.x *= c;
      this.y *= c;
      return this;
    } else {
      return new Vec2d({
        x: this.x * c,
        y: this.y * c
      });
    }
  };

  Vec2d.prototype.subtract = function (vec, write = false) {
    if (write) {
      this.x -= vec.x;
      this.y -= vec.y;
      return this;
    } else {
      return this.add(vec.scale(-1));
    }
  };

  Vec2d.prototype.dot = function (vec) {
    return (this.x * vec.x) + (this.y * vec.y);
  };

  Vec2d.prototype.normSquared = function () {
    return this.dot(this);
  };

  Vec2d.prototype.norm = function () {
    return Math.sqrt(this.normSquared());
  };

  Vec2d.prototype.normalize = function (write = false) {
    let n = this.norm();

    if (write) {
      this.x /= n;
      this.y /= n;
      return this;
    } else {
      this.scale(Math.pow(n, -1));
    }
  };

  Vec2d.prototype.distanceSquared = function (vec) {
    return vec.subtract(this).normSquared();
  };

  Vec2d.prototype.distance = function (vec) {
    return Math.sqrt(this.distanceSquared(vec));
  };

  return Vec2d;
});
