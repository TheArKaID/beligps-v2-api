'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Vehicles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      user_id: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      plat_number: {
        allowNull: true,
        type: Sequelize.STRING(10),
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING(50),
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
    await queryInterface.dropTable('Vehicles');
  }
};
