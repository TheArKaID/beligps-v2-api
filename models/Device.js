'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Device.belongsTo(models.User, {
        foreignKey: 'owner_id',
        as: 'user_owner',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Device.belongsTo(models.Company, {
        foreignKey: 'owner_id',
        as: 'company_owner',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Device.belongsTo(models.Vehicle, {
        foreignKey: 'vehicle_id',
        as: 'vehicle',
        onUpdate: 'CASCADE'
      });
    }
  }
  Device.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    owned_by: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    vehicle_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    imei: DataTypes.STRING(50),
    status: DataTypes.STRING(50),
    disabled: DataTypes.BOOLEAN,
    phone: DataTypes.STRING(50),
    attributes: DataTypes.JSONB,
    created_at: DataTypes.DATE,
    created_by: DataTypes.STRING(50),
    updated_at: DataTypes.DATE,
    updated_by: DataTypes.STRING(50)
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Device',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "Devices_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return Device;
}