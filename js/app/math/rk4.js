/* jshint esversion: 6 */

define(['lodash', './integrator'], function (_, Integrator) {

  function Rk4Integrator (options) {
    Integrator.call(this, options);
  }

  Rk4Integrator.prototype = Object.create(Integrator.prototype);
  Rk4Integrator.prototype.constructor = Rk4Integrator;

  Rk4Integrator.prototype.step = function (dydt, yn, tn, dt) {
    let hdt = 0.5*dt,

        k1 = dt * dydt(yn, tn),
        k2 = dt * dydt(yn + (0.5*k1), tn + hdt),
        k3 = dt * dydt(yn + (0.5*k2), tn + hdt),
        k4 = dt * dydt(yn + k3, tn + dt);

    return (yn + (k1 / 6) + (k2 / 3) + (k3 / 3) + (k4 / 6));
  };
});
