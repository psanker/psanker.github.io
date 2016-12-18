/* jshint esversion: 6 */

/**
 * A basic physics engine to handle moving HTML elements without using <canvas>
 *
 * License: MIT
 *
 */

;(function(win, doc, j, lo) {

  /**
   * Vec2d object
   *
   */
  function Vec2d(coords) {
    if (lo.isArray(coords)) {
      this.x = coords[0];
      this.y = coords[1];
    } else if (lo.isObject(coords)) {
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

  Vec2d.prototype.distance = function (vec) {
    return vec.subtract(this).norm();
  };

  /**
   * Stage object
   *
   */
  function Stage(width, height, actors = []) {

    if (!lo.isNumber(width) || !lo.isNumber(height)) {
      throw new Exception('Width and height of Stage must be numbers');
    }

    this._width  = width;
    this._height = height;

    // Idiot check the defaults, too
    if (lo.isArray(actors)) {
      this._actors = actors;
    } else {
      this._actors = [];
    }
  }

  Stage.prototype = Object.create(Object.prototype);
  Stage.prototype.constructor = Stage;

  /**
   * Stage::_rasterizePosition(<actor>)
   *
   * PRIVATE
   *
   * Stage's real origin is top-left (because browsers),
   * so we need to translate the coords to bottom-left.
   *
   * The rasterization takes a float from 0 to 1 and maps it to the browser space.
   * Ergo, (0,0) in stage space maps to (0, HEIGHT) in browser space and
   * (1,1) maps to (WIDTH, 0).
   *
   * 'actor' may be an array of Actors or just an Actor
   */
  Stage.prototype._rasterizePosition = function (actor) {
    if (lo.isArray(actor)) {

      for (let a in actor) {
        this._rasterizePosition(a);
      }
    }

    if (actor instanceof Actor) {
      let p = actor.pos,
          o = actor.obj;

      // Coordinate transformation
      let _x = p.x * this._width,
          _y = this._height - (p.y * this._height);

      // Apply transformation
      j(o).offset({left: _x, top: _y});
    }
  };

  /**
   * Stage::_vectorize(actor)
   *
   * PRIVATE
   *
   * Same idea as Stage::_rasterizePosition() but converting browser space to
   * Stage space for each 'actor'.
   *
   * Should only be called after attaching Actor object to the HTML object
   *
   * 'actor' may be an array of Actors or just an Actor
   */
  Stage.prototype._vectorize = function (actor) {
    if (lo.isArray(actor)) {

      for (let a in actor) {
        this._vectorize(a);
      }
    }

    if (actor instanceof Actor) {
      let o  = actor.obj;

      let _x = j(o).offset().left,
          _y = j(o).offset().top;

      actor.pos = new Vec2d({
        x: _x / this._width,
        y: 1 - (_y / this._height)
      });
    }
  };

  /**
   * TODO: doc this
   *
   */
  Stage.prototype.addActor = function (actor) {

    if (lo.isArray(actor)) {
      for (let a in actor) {
        this.addActor(a);
      }
    }

    if (actor instanceof Actor) {
      if (!lo.isNil(lo.find(this._actors, actor))) {
        console.log('Tried to add a duplicate actor to the stage');
        return;
      } else {
        // Probably just generated, so vectorize the position of the actor
        this._vectorize(actor);

        this._actors.push(actor);
      }
    }
  };

  /**
   * TODO: doc this
   *
   */
  Stage.prototype.removeActor = function (actor) {

    if (lo.isArray(actor)) {
      for (let a in actor) {
        this.removeActor(actor);
      }
    }

    if (actor instanceof Actor) {
      lo.pull(this._actors, actor);
    }
  };

  /**
   * Stage::inBounds(actor)
   *
   * Checks if an Actor's position is inside the Stage's boundaries
   *
   * 'actor' may be an array of Actors or just an Actor
   *
   * returns boolean
   */
  Stage.prototype.inBounds = function (actor) {
    if (lo.isArray(actor)) {
      for (let a in actor) {
        return this.inBounds(a);
      }
    }

    if (actor instanceof Actor) {
      let p = actor.pos;

      if (p.x > 1 || p.x < 0) {
        return false;
      }

      if (p.y > 1 || p.y < 0) {
        return false;
      }

      return true;
    } else {
      throw new Exception('Passed argument to Stage::inBounds() not an Actor or Actor[]');
    }
  };

  /**
   * Stage::findCollisions()
   *
   * Iterate through the actors, find any potential collisions, and return an
   * array of all the collision pairs.
   *
   * returns array: [{first, second}, ...]
   */
  Stage.prototype.findCollisions = function () {
    var collisions = [];

    for (var a in this._actors) {

      for (let b in this._actors) {
        if (a.aabb(b)) {
          let foo = {first: a, second: b},
              bar = {first: b, second: a};

          if (lo.isUndefined(lo.find(collisions, foo)) && lo.isUndefined(lo.find(collisions, bar))) {
            collisions.push(foo);
          }
        }
      }
    }

    return collisions;
  };

  /**
   * Stage::tick(dt)
   *
   * This is the main animation function.
   *
   * Iterates through each actor:
   * If collisions are detected, do collision logic.
   * If bounded actors collide with bounds, spectral reflect.
   * Then, update positions based on updated velocities, if necessary.
   *
   */
  Stage.prototype.tick = function (dt) {

    let collisions = this.findCollisions();
  };

  /**
   * Actor object
   *
   */
  function Actor(obj, params) {
    if (lo.isNil(obj)) {
      throw new Exception('Nil object passed as Actor source');
    }

    this.obj = obj;

    // TODO: Rewrite this so that the stage does the coord transform, not the Actor
    this.pos = new Vec2d({
      x: j(obj).offset().left,
      y: j(obj).offset().top
    });

    if (lo.isNil(params)) {
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

      if ('mass' in params && lo.isNumber(params.mass)) {
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

  /**
   * Actor::move(vec, [additive])
   * Moves the actor to the input Vec2d 'vec'
   * - If 'additive', 'vec' will add to the actor's position
   *
   */
  Actor.prototype.move = function (vec, additive = true) {
    if (additive) {
      this.pos.add(vec, true);
    } else {
      this.pos = vec;
    }
  };

  Actor.prototype.aabb = function (actor) {
    throw new Exception('This Actor has not implemented Actor::aabb()');
  };

  /**
   * Particle object
   *
   */
  function Particle(obj, params) {
    Actor.call(this, obj, params);

    if (!lo.isNil(params) && 'r' in params && lo.isNumber(params.r)) {
      this.radius = params.r;
    } else {
      this.radius = 1;
    }
  }

  Particle.prototype = Object.create(Actor.prototype);
  Particle.prototype.constructor = Particle;

  Particle.prototype.aabb = function (vec) {
    if (this.pos.distance(vec) <= this.radius) {
      return true;
    } else {
      return false;
    }
  };

})(window, document, $, _);
