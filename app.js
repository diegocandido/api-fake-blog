const express = require('express')
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