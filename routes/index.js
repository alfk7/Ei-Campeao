const cardapioController = require("../controller/cardapioController")
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', cardapioController.index);
router.post("/cadastro", cardapioController.cadastro)
router.get('/restaurante',cardapioController.restaurante)


module.exports = router;
