'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  static: {
    enable: true,
  },
  view: true,
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  xtpl: {
    enable: true,
    package: 'egg-view-xtpl',
  },
};
