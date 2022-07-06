const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 8080

const { publicacoes } = require('./models/articles')
const { catgames } = require('./models/games')
const { catweb } = require('./models/web')


app.use(express.json())
app.use(express.urlencoded({
    extende: true
}))

app.use('/img', express.static(__dirname + '/public/images'));

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

//LISTAR TODAS AS POSTAGENS
app.get('/postagens', (req,res)=>{
    res.json(publicacoes)
})

//LISTAR UMA POSTAGEM
app.get('/postagem/:index', (req,res) =>{
    const { index } = req.params;
    return res.json(publicacoes[index])
})

//LISTAR CATEGORIA GAMES
app.get('/categoria/games', (req,res) =>{
    res.json(catgames)
})

//LISTAR CATEGORIA WEB
app.get('/categoria/web', (req,res) =>{
    res.json(catweb)
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))