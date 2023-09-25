'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Devices', 'vehicle_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Vehicles',
        key: 'id'
      },
      after: 'user_id'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Devices', 'vehicle_id');
  }
};
