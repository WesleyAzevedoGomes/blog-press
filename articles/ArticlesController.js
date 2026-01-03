const express = require('express')
const router = express.Router();

router.get('/articles', (req, res) => {
  res.send("Rota de artigos")
})

router.get('/admin/articles/new', (req, res) => {
  res.send("ROTA PRA CRIAR UMA NOVA CATEGORIA")
})


module.exports = router;