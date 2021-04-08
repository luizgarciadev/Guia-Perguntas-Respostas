const express = require('express'); // bilbioteca do express (framework para aplicações web para Node.js)
const app = express();
const bodyParser = require('body-parser'); //biblioteca para converter o body da requisição para json
const connection = require('./database/database');//importando conexão com o DB
const Pergunta = require('./database/Pergunta');//importando modelo pergunta do DB
const Resposta = require('./database/Resposta');//importando modelo resposta do RB

//Conexão com a database
connection
    .authenticate()
    .then(() => {
        console.log('conexão feita com o banco de dados');
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

app.set('view engine','ejs'); //Iniciando a biblioteca 'EJS' na aplicação express (motor de renderização HTML)
app.use(express.static('public')); // Biblioteca para trabalhar com arquivos estaticos (multimida, imagem, javafront e etc)

//Body Parser - biblioteca que permite importar formlários de HTML para JS
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get('/',(req,res) =>{ //rota principal que exibe as perguntas na página inicial
  Pergunta.findAll({ raw: true, order:[
      ['id','DESC']//ordenar as perguntas da maneira decrescente
  ]}).then(pergunta =>{ // = SELECT ALL from perguntas
    res.render("index",{
      pergunta:pergunta
    });
  });
});

app.get('/perguntar',(req,res) =>{//rota perguntar
    res.render('perguntar');
})

app.post('/salvarpergunta',(req, res) => {//rota salvar pergunta
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id",(req,res) => {//rota que exibe as perguntas
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){//pergunta encontrada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ["id", "DESC"]
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas:respostas
                });
            });           
        }else{//não encontrada
            res.redirect("/");
        }
    });
})


app.post("/responder",(req, res) => { //rota para responder as pergutas
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);
    });
});



app.listen(4000,() => {console.log('app rodando!');});