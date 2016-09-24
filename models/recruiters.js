'use strict';
module.exports = function(sequelize, DataTypes) {
  var Recruiters = sequelize.define('Recruiters', {
    company: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Recruiters;
};