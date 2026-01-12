const express = require('express')
const router = express.Router();
const Category = require('../categories/Category')
const Article = require('./Articles')
const slugify = require('slugify')


router.get('/admin/articles', (req, res) => {
  Article.findAll({
    include: [{model: Category}]
  }).then((articles) => {
    res.render('admin/articles/index', {articles})
  })
})

router.get('/admin/articles/new', (req, res) => {
  Category.findAll().then((categories) => {
    res.render('admin/articles/new', {categories})
  })  
})

router.post('/articles/save', (req, res) => {
  const title = req.body.title;
  const bodyText = req.body.body;
  const category = req.body.category;

  Article.create({
    title,
    slug: slugify(title),
    body: bodyText,
    categoryId: category
  }).then(()=> {
    res.redirect('/admin/articles')
  })
})

module.exports = router;