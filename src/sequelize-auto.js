const SequelizeAuto = require('sequelize-auto');
const db = require('./models');

// Your configuration file

const auto = new SequelizeAuto(db.sequelize, null, null, {
  directory: 'src/models', // Directory where models should be saved
  // Other sequelize-auto options
  additional: {
    timestamps: true,
    underscored: false
  },

});

auto.run((err) => {
  if (err) throw err;
  console.log('Models generated successfully!');
});
