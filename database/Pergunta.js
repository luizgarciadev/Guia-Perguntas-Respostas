const Sequelize = require('sequelize');
const connection = require('./database');

const Pergunta = connection.define('pergunta',{// função para criar uma tabela de perguntas no DB
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({Force: false}).then(() => {
    console.log('Tabela criada');
});

module.exports = Pergunta;