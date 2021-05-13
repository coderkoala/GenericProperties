"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Geolocation extends Model {
    static associate(models) {
      // define association here
    }
  }
  Geolocation.init(
    {
      id: DataTypes.UUID,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      coordinates: DataTypes.GEOMETRY("POINT", 4326),
    },
    {
      sequelize,
      modelName: "Geolocation",
    }
  );
  return Geolocation;
};
