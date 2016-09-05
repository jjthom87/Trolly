'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      companyName: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      dateApplied: {
        type: Sequelize.STRING
      },
      replied: {
        type: Sequelize.BOOLEAN
      },
      nextEvent: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      resume: {
        type: Sequelize.BOOLEAN
      },
      image: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Applications');
  }
};