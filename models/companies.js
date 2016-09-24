'use strict';
module.exports = function(sequelize, DataTypes) {
  var Companies = sequelize.define('Companies', {
    company: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Companies;
};