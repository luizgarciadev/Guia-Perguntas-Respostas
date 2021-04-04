const Sequelize = require('sequelize'); //biblioteca para conectar o JS ao banco de dados MySql

const connection = new Sequelize('guiaperguntas','root','123456789',{
    host: 'localhost',
    dialect:'mysql'
});

module.exports = connection; //exportar modulo database