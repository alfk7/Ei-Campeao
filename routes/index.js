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
router.post('/cadastroProduto',cardapioController.novoProduto)
router.get('/mesas',verificarRestauranteLogado,cardapioController.showMesas)
router.post('/cadastroMesas',cardapioController.adicionarMesa)
router.get('/mesas/qr',verificarRestauranteLogado,cardapioController.showQr)
router.get('/teste',verificarRestauranteLogado,cardapioController.teste)

// visão do cliente
router.get('/homeMesa',cardapioController.showHomeMesa)


module.exports = router;
