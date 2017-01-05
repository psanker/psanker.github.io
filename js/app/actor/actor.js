// TODO: Clean up this object; it's too damn messy

define(['lodash', 'object-hash', 'util/vec2d'], function (_, hash, Vec2d) {
  function Actor(obj, params) {
    if (_.isNil(obj)) {
      throw new Exception('Nil object passed as Actor source');
    }

    this.obj = obj;

    // TODO: Rewrite this so that the stage does the coord transform, not the Actor
    this.pos = new Vec2d({
      x: j(obj).offset().left,
      y: j(obj).offset().top
    });

    if (_.isNil(params)) {
      // Initialize the essential physical properties
      this.vel     = Actor.defaults.vel;
      this.mass    = Actor.defaults.mass;
      this.bounded = Actor.defaults.bounded;
    } else {
      if ('vel' in params) {
        let v = params.vel;

        if ('x' in v && !lo.isNumber(v.x)) {
          v.x = 0;
        }

        if ('y' in v && !lo.isNumber(v.y)) {
          v.y = 0;
        }

        this.vel = new Vec2d(v);
      } else {
        this.vel = Actor.defaults.vel;
      }

      if ('mass' in params && _.isNumber(params.mass)) {
        this.mass = params.mass;
      } else {
        this.mass = Actor.defaults.mass;
      }
    }
  }

  Actor.defaults = {
    vel: new Vec2d(),
    mass: 1,
    bounded: false
  };

  Actor.prototype = Object.create(Object.prototype);
  Actor.prototype.constructor = Actor;

  Actor.prototype.aabb = function (actor) {
    // Generate bounding boxes based on outer width/height
    let w1 = j(this.obj).outerWidth(),
        h1 = j(this.obj).outerHeight(),
        w2 = j(actor.obj).outerWidth(),
        h2 = j(actor.obj).outerHeight();

    let box1 = {x1: this.pos.x - (0.5)*(w1),
                y1: this.pos.y - (0.5)*(h1),
                x2: this.pos.x + (0.5)*(w1),
                y2: this.pos.y + (0.5)*(h1)},
        box2 = {x1: actor.pos.x - (0.5)*(w1),
                y1: actor.pos.y - (0.5)*(h1),
                x2: actor.pos.x + (0.5)*(w1),
                y2: actor.pos.y + (0.5)*(h1)};
  };

  /**
   * Actor#move( vec, [additive] )
   *
   * Moves the actor to the input Vec2d 'vec'
   *
   * @param {Vec2d} vec A vector (in {Stage} space)
   * @param {boolean} additive Determines if 'vec' is added to the position or assigned
   */
  Actor.prototype.move = function (vec, additive = true) {
    if (_.isNil(vec)) {
      console.log('Attempted to assign undefined/null position; Ignoring...');
      return;
    }

    if (!(vec instanceof Vec2d)) {
      console.log('Attempted to move actor without a vector type; Ignoring...');
      return;
    }

    if (additive) {
      this.pos.add(vec, true);
    } else {
      this.pos = vec;
    }
  };

  /**
   * Actor#accelerate( vec, [additive] )
   *
   * Applies an acceleration vector to the actor, which will be picked up by the
   * next integration cycle.
   *
   * @param {Vec2d} vec A vector containing some acceleration value
   * @param {boolean} additive Determines if the vector is assigned or added
   */
  Actor.prototype.accelerate = function (vec, additive = true) {

    // Clears up null instantiation
    if (_.isNil(this.accel)) {
      this.accel = new Vec2d();
    }

    if (_.isNil(vec)) {
      console.log('Attempted to assign undefined/null acceleration; Ignoring...');
      return;
    }

    if (!(vec instanceof Vec2d)) {
      console.log('Attempted to accelerate without a vector type; Ignoring...');
      return;
    }

    if (additive) {
      this.accel.add(vec, true);
    } else {
      this.accel = vec;
    }
  };

  Actor.prototype.hashcode = function () {
    return hash(this);
  };

  return Actor;
});
