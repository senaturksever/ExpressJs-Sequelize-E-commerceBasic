const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-app', 'root', 'senaturksever123.', {
    host: 'localhost',
    dialect: 'mysql'
  });

module.exports  = sequelize;


