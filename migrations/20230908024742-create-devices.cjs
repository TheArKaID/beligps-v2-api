'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Devices', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      owner_id: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      owned_by: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      imei: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(50)
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING(50),
        defaultValue: 'offline'
      },
      disabled: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      phone: {
        allowNull: true,
        type: Sequelize.STRING(50)
      },
      attributes: {
        allowNull: true,
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      created_by: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_by: {
        allowNull: false,
        type: Sequelize.STRING(50)
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Devices');
  }
};
