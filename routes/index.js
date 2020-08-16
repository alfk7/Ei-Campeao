const cardapioController = require("../controller/cardapioController")
var express = require('express');
var router = express.Router();
const verificarRestauranteLogado = require("../middleware/verificarRestaurante")

/* GET home page. */
router.get('/', cardapioController.index);
router.post("/cadastro", cardapioController.cadastro)
router.get('/restaurante',verificarRestauranteLogado ,cardapioController.restaurante)
router.get('/login',cardapioController.showLogin)
router.post('/login',cardapioController.login)
router.get('/cadastroProduto',verificarRestauranteLogado,cardapioController.cadastroProduto)
router.post('/cadastroProduto',cardapioController.novoProduto)


module.exports = router;
