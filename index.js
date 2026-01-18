const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config();
const connection = require('./database/database')
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const usersController = require('./user/UsersController')
const Article = require('./articles/Articles')
const Category = require('./categories/Category');
const User = require('./user/User')


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
app.use('/', usersController)

app.get('/', (req, res) => {
  Article.findAll({
    order: [
      ['id', 'DESC']
    ],
    limit: 4
  }).then((articles) => {
    Category.findAll().then(categories => {
        res.render('index', {articles, categories: categories})
      })
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
      Category.findAll().then(categories => {
        res.render('article', {article: article, categories: categories})
      })
    } else {
      res.redirect('/')
    }
  }).catch((err) => {
    res.redirect('/')
  })
})

app.get("/category/:slug", (req, res) => {
  const slug = req.params.slug;
  Category.findOne({
    where: { slug },
    include: [{ model: Article }],
  }).then((category) => {
      if (category) {
        Category.findAll().then((categories) => {
          res.render('index', {articles: category.articles, categories})
        })
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

app.listen(3000, (() => {
  console.log('App rodando!')
}))