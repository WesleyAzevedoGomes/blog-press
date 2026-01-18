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

router.post('/articles/delete', (req, res) => {
  const id = Number(req.body.id);
  console.log(id)
  if (id || typeof id === Number) {
    Article.destroy({
      where: {
        id,
      },
    }).then(() => {
      res.redirect('/admin/articles')
    })
  } else {
    res.redirect('/admin/articles');
  }
});

router.get('/admin/articles/edit/:id', (req, res) => {
  const id = req.params.id;
  Article.findByPk(id).then((article) => {
    if(article){
      Category.findAll().then((categories) => {
        res.render('admin/articles/edit', {article, categories})
      })
    } else {
      res.redirect('/')
    }
  }).catch((e) => {
    res.redirect('/')
  })

})

module.exports = router;