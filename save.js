const Sequelize = require("sequelize");
const database = require('./database');
const bcrypt = require('bcrypt');

class Save extends Sequelize.Model {
    static async createSave(idsend, moneysend, month, percent, dayend) {
        return await Save.create({
            idsend,
            moneysend,
            month,
            percent,
            dayend
        });
    }

    static async findSave(id) {
        return await Save.findOne({
            where: {
                id
            }
        });
    }

    static async getAllSave(idsend) {
        return await Save.findAll({
            where: {
                idsend
            }
        });
    }
};

Save.init({
    idsend: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    moneysend: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false
    },
    month: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    percent: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false
    },
    dayend: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize: database,
    modelName: "save",
});


module.exports = Save;