const Sequelize = require("sequelize");
const database = require('./database');
const bcrypt = require('bcrypt');

class Admin extends Sequelize.Model {
    static hassPassword(password) {
        return bcrypt.hashSync(password, 10)
    }

    static comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }

    static async findAdmin(username) {
        return await Admin.findOne({
            where: {
                username
            }
        });
    }
};

Admin.init({
    username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database,
    modelName: "admin",
});


module.exports = Admin;