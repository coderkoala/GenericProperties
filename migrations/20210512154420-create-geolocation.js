"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Geolocation", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(40),
      },
      name: {
        type: Sequelize.STRING(80),
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING(160),
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING(160),
      },
      company: {
        allowNull: true,
        type: Sequelize.STRING(160),
      },
      phone: {
        allowNull: true,
        type: Sequelize.STRING(160),
      },
      latitude: {
        allowNull: true,
        type: Sequelize.STRING(32),
      },
      longitude: {
        allowNull: true,
        type: Sequelize.STRING(32),
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
    },
    {
      engine: 'InnoDB',
      charset: 'utf8',
      comment: 'Table for managing Agent Record Keeping',
      collate: 'utf8_general_ci'
    });
    await queryInterface.addIndex("Geolocation", ["coordinates"]);
    await queryInterface.addIndex("Geolocation", ["address"]);
    await queryInterface.addIndex("Geolocation", ["name"]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Geolocation");
  },
};
