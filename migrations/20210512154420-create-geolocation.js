"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Geolocations", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        unique: "compositeIndex",
      },
      name: {
        type: Sequelize.STRING,
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      latitude: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      longitude: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      coordinates: {
        type: Sequelize.GEOMETRY("POINT", 4326),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Geolocations");
  },
};
