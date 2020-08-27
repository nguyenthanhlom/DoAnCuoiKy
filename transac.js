const Sequelize = require("sequelize");
const database = require('./database');
const Op = Sequelize.Op;

class Transac extends Sequelize.Model {

    static async createTransac(idsend, idrecive, typetran, money, token) {
        return await Transac.create({
            idsend,
            idrecive,
            typetran,
            money,
            token
        });
    }

    static async createTransacInter(idsend, idrecive, typetran, money, token,bank) {
        return await Transac.create({
            idsend,
            idrecive,
            typetran,
            money,
            token,
            bank
        });
    }

    static async updateToken(id) {
        return await Transac.update({
            token: null,
            typetran: 1
        }, {
            where: {
                id
            }
        })
    }

    static async findTran(id, idus) {
        return await Transac.findOne({
            where: {
                id,
                [Op.or]: [
                    {
                        idsend: idus
                    },
                    {
                        idrecive: idus
                    }
                ],
                typetran: 1
            }
        })
    }

    static async getAllTran(idus) {
        return await Transac.findAll({
            where: {
                [Op.or]: [
                    {
                        idsend: idus
                    },
                    {
                        idrecive: idus
                    }
                ],
                typetran: 1
            }
        })
    }

};

Transac.init({
    idsend: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    idrecive: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    typetran: {
        type: Sequelize.DataTypes.INTEGER,
        alllowNul: false
    },
    money: {
        type: Sequelize.DataTypes.DECIMAL,
        alllowNul: false
    },
    token: {
        type: Sequelize.DataTypes.STRING
    },
    bank: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: "SIMPLE"
    }
}, {
    sequelize: database,
    modelName: "transac",
});


module.exports = Transac;