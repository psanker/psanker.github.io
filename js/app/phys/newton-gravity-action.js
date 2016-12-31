define(['lodash', './action', 'actors/actor', 'util/vec2d'], function (_, Action, Actor, Vec2d) {

  const PROPS = ['mass'],
        NAME  = 'newton-gravity',
        G     = 6.674e-11;

  /**
   *
   * @constructor
   * @this {NewtonianGravity}
   *
   */
  function NewtonianGravity(opts = {}) {
    Action.call(this, NAME, PROPS, opts);
  }

  NewtonianGravity.prototype = Object.create(Action.prototype);
  NewtonianGravity.prototype.constructor = NewtonianGravity;

  /**
   * NewtonianGravity#perform( data )
   *
   * Computes the forces on each actor in data.actors
   *
   * @param {object} data The data to pass; must have data.actors, an array of {Actor} elements
   * @return {object} An object with each key an actor and each value a {Vec2d} of the summed resulting forces
   */
  NewtonianGravity.prototype.perform = function (data) {

    // dpi/dt = (µj*mi)(r^-2) * rhat

    var _G  = this.opts.G || G,
        ret = {};

    if (_.isNil(data) || _.isNil(data.actors)) {
      console.log('Empty Actor set to compute; Ignoring...');
      return {};
    } else if (!_.isArray(data.actors)) {
      console.log('data.actors not an array of actors; Ignoring...');
      return {};
    }

    for (let a in data.actors) {
      let s  = new Vec2d(),
          mi = a.mass,
          ah = a.hashcode();

      for (let b in data.actors) {
        if (b.hashcode() === ah) {
          continue;
        }

        let muj = _G * b.mass,
            dis = b.pos.subtract(a.pos);

        let c    = (muj * mi) / (dis.normSquared()),
            rhat = dis.normalize();

        s.add(rhat.scale(c, true), true);
      }

      ret[ah] = s;
    }

    return ret;
  };

  return NewtonianGravity;
});
