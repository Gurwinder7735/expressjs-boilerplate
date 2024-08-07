'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert Roles
    const roles = await queryInterface.bulkInsert('roles', [
      {
        roleName: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleName: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], { returning: true });

    // Get the ID of the ADMIN role
    const adminRole = roles.find(role => role.roleName === 'ADMIN');

    // Insert Admin User
    const users = await queryInterface.bulkInsert('users', [
      {
        email: 'admin@admin.com',
        password: '$2b$10$8uSdh3A6O7ONGUFNq0Svnuoddokn5H/H6MOFAP95sdvsy6t8S8doe', // Ensure this is a hashed password
        status: 1,
        firstName: 'Admin',
        lastName: '',
        name: 'Admin',
        nameVisibility: 1,
        image: '',
        imageVisibility: 1,
        otp: null,
        resetToken: '',
        notifications: 1,
        deviceType: 1,
        deviceToken: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ], { returning: true });

    // Get the ID of the created Admin user
    const adminUser = users[0];

    // Insert UserRoles
    await queryInterface.bulkInsert('userRoles', [
      {
        roleId: adminRole.id,
        userId: adminUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('userRoles', null, {});
    await queryInterface.bulkDelete('users', { email: 'admin@admin.com' }, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
