'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Company.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: DataTypes.STRING(50),
    created_at: DataTypes.DATE,
    created_by: DataTypes.STRING(50),
    updated_at: DataTypes.DATE,
    updated_by: DataTypes.STRING(50)
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Company',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "Companies_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return Company;
}