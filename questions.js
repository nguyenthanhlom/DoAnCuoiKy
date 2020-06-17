
const Sequelize = require('sequelize');

const db=require('./db');

const Model=Sequelize.Model;
class Question extends Model { 
    static add(id,question1,question2){
        return Question.create({idUser: id,q1: question1,q2: question2});
    }
}

Question.init({
    idUser:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    q1:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    q2:{
        type: Sequelize.STRING,
        allowNull: false,
    },
 }, {
    sequelize : db,
    modelName: 'Question',
});



module.exports = Question;