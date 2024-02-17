const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('club22', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database.');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

module.exports = sequelize;
