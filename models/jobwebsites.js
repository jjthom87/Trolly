'use strict';
module.exports = function(sequelize, DataTypes) {
  var JobWebsites = sequelize.define('JobWebsites', {
    website: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return JobWebsites;
};