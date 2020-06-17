const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('./db');

const Model = Sequelize.Model;
class User extends Model {
    static async findUserById(id) {
        return User.findByPk(id);
    }
    static async findUserByEMAIL(email) {
        return User.findOne({
            where: {
                email,
            }
        });
    }
    async changeDisplayName(name) {
        this.displayName = name;
        return this.save();
    }
    async changePassword(pass) {


        this.password = pass;
        return this.save();
    }
    static hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }
    static verifyPassword(password, passwordHash) {
        return bcrypt.compareSync(password, passwordHash);
    }
}

User.init({
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    displayName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    token: {
        type: Sequelize.STRING,

    },
}, {
    sequelize: db,
    modelName: 'user',
});



module.exports = User;