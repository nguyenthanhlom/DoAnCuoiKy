const Sequelize = require('sequelize');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:Playstation4@localhost:5432/doan';
const db = new Sequelize(connectionString);
module.exports = db;