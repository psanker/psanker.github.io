/* jshint esversion: 6 */

/**
 * A basic physics engine to handle moving HTML elements without using <canvas>
 *
 * License: MIT
 *
 */

;(function(win, doc, j, lo) {

  /**
   * Vec2d function
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

  Vec2d.prototype = Object.create(Object.prototype, {
    add: function(vec, write = false) {
      if (write) {
        this.x += vec.x;
        this.y += vec.y;
      } else {
        return new Vec2d({
          x: this.x + vec.x,
          y: this.y + vec.y
        });
      }
    },

    scale: function(c, write = false) {
      if (write) {
        this.x *= c;
        this.y *= c;
      } else {
        return new Vec2d({
          x: this.x * c,
          y: this.y * c
        });
      }
    },

    dot: function(vec) {
      return (this.x * vec.x) + (this.y * vec.y);
    },

    normSquared: function() {
      return this.dot(this);
    },

    norm: function() {
      return Math.sqrt(this.normSquared());
    },

    distance: function(vec) {
      return Math.sqrt(Math.pow(vec.x - this.x, 2) + Math.pow(vec.y - this.y, 2));
    }
  });

  /**
   * Actor function
   *
   */
  function Actor(obj, params) {
    if (lo.isNil(obj)) {
      throw new Exception('Nil object passed as particle source');
    }

    this.obj = obj;
    this.pos = new Vec2d({
      x: j(obj).offset().left,
      y: j(obj).offset().top
    });

    if (lo.isNil(params)) {
      // Initialize the essential physical properties
      this.vel  = new Vec2d();
      this.mass = 1;
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
        this.vel = new Vec2d();
      }
    }
  }

  Actor.prototype = Object.create(Object.prototype, {

    /**
     * Actor::move(vec, [additive])
     * Moves the actor to the input Vec2d 'vec'
     * - If 'additive', 'vec' will add to
     *
     */
    move: function(vec, additive = true) {
      if (additive) {
        this.pos.add(vec, true);
      } else {
        this.pos = vec;
      }
    }
  });

  /**
   * Particle function
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

  Particle.prototype = Object.create(Actor.prototype, {
    aabb: function(vec) {
      if (this.pos.distance(vec) <= this.radius) {
        return true;
      } else {
        return false;
      }
    },

    translate: function(dxdy) {
      this.pos.add(dxdy, true);
    }
  });

}(window, document, $, _));
