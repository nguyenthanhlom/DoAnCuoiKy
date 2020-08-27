const Sequelize = require("sequelize");
const database = require('./database');
const bcrypt = require('bcrypt');
const Op = Sequelize.Op;

class User extends Sequelize.Model {
    static async findUserbyEmail(email) {
        return await User.findOne({
            where: {
                email
            }

        });
    }

    static async findUserbyCMND(cmnd) {
        return await User.findOne({
            where: {
                cmnd
            }

        });
    }

    static hassPassword(password) {
        return bcrypt.hashSync(password, 10)
    }

    static comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }

    static async createUser(name, email, password, cmnd) {
        return await User.create({
            name,
            email,
            password: User.hassPassword(password),
            cmnd
        });
    }

    static async updateVerify(id, image1, image2) {
        return await User.update({
            image1,
            image2,
            status: -1
        }, {
            where: {
                id
            }
        });
    }

    static async findUserWaiting(status) {
        return await User.findAll({
            where: {
                status
            }
        });
    }

    static async updateUsernotPassword(id, name, email, cmnd, limit, status) {
        return await User.update({
            name,
            email,
            cmnd,
            limit,
            status
        }, {
            where: {
                id
            }
        });
    }

    static async updateUser(id, name, email, cmnd, limit, status, password) {
        return await User.update({
            name,
            email,
            cmnd,
            limit,
            status,
            password: User.hassPassword(password)
        }, {
            where: {
                id
            }
        });
    }

    static async updateMoney(id, acblan) {
        return await User.update({
            acblan
        }, {
            where: {
                id
            }
        });
    }

    static async findUserbyidorcmnd(value) {
        return await User.findOne({
            where: {
                [Op.or]: [
                    {
                        id: {
                            [Op.eq]: value
                        }
                    },
                    {
                        cmnd: {
                            [Op.eq]: value
                        }
                    }
                ]
            }
        })
    }

    static async findUserActive(id) {
        return await User.findOne({
            where: {
                id,
                status: 1
            }
        });
    }

};

User.init({
    name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    cmnd: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    acblan: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    limit: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 10000
    },
    status: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    image1: {
        type: Sequelize.DataTypes.TEXT,
    },
    image2: {
        type: Sequelize.DataTypes.TEXT,
    }
}, {
    sequelize: database,
    modelName: "user",
});


module.exports = User;