const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config();
const connection = require('./database/database')
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const Article = require('./articles/Articles')
const Category = require('./categories/Category')


// View engine
app.set('view engine', 'ejs')

// Static
app.use(express.static('public'))

// Body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Databse
connection.authenticate().then(() => {
  console.log('Conexão iniciada')
}).catch((error) => {
  console.log(error)
})

app.use('/', categoriesController)
app.use('/', articlesController)

app.get('/', (req, res) => {
  Article.findAll({
    order: [
      ['id', 'desc']
    ]
  }).then((articles) => {
    res.render('index', {articles})
  })
})

app.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  Article.findOne({
    where: {
      slug
    }
  }).then((article) => {
    if(article){
      res.render('article', {article})
    } else {
      res.redirect('/')
    }
  }).catch((err) => {
    res.redirect('/')
  })
})

app.listen(3000, (() => {
  console.log('App rodando!')
}))