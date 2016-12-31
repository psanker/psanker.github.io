define(['lodsah'], function (_) {

  function Integrator (options) {
    // Haven't figured out what options will be needed; maybe tolerance for the rk4
  }

  /*
   * y'' + p(x)y' - q(x) = 0
   * ------------------------
   *
   * y' = z(x)
   * z' = q(x) - p(x)z(x)
   *
   */

  Integrator.prototype = Object.create(Object.prototype);
  Integrator.prototype.constructor = Integrator;

  Integrator.prototype.step = function (dydt, yn, tn, dt) {
    throw new Exception('Undefined');
  };
});
