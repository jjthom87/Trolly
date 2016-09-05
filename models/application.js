'use strict';
module.exports = function(sequelize, DataTypes) {
  var Application = sequelize.define('Application', {
    companyName: DataTypes.STRING,
    position: DataTypes.STRING,
    dateApplied: DataTypes.STRING,
    replied: DataTypes.BOOLEAN,
    nextEvent: DataTypes.STRING,
    notes: DataTypes.STRING,
    resume: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Application.belongsTo(models.User);
      }
    }
  });
  return Application;
};