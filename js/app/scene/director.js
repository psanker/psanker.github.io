define(['require'], function(require) {

  var _      = require('lodash'),

      Actor  = require('actors/actor'),
      Action = require('phys/action'),
      Stage  = require('./stage'),
      Vec2d  = require('util/vec2d');

  function Director() {
    // TODO: Instantiation stuff here... will figure this out eventually
  }

  Director.prototype = Object.create(Object.prototype);
  Director.prototype.constructor = Director;

  /**
   * Director#makeStage( width, height, options )
   *
   * Builds a {Stage} for {Actor} entries in which they can move and interact
   *
   * @param {number} width Width of the stage in pixels
   * @param {number} height Height of the stage in pixels
   */
  Director.prototype.makeStage = function (width, height, options = {}) {

  };

  /**
   * Director#step( dt )
   *
   *
   */
  Director.prototype.step = function (dt) {

  };

  /**
   * Director#_stepVelocities( dt )
   * @private
   *
   *
   */
  Director.prototype._stepVelocities = function (dt) {

  };

  /**
   * Director#_stepPositions( dt )
   * @private
   *
   *
   */
  Director.prototype._stepPositions = function (dt) {

  };

  return Director;
});
