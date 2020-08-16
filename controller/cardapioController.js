require("../models/Restaurante")
require("../models/Cardapio")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const Restaurante = mongoose.model("restaurantes")
const Cardapio = mongoose.model("cardapios")
const cardapioController = {
    index: (req,res)=>{
        res.render("cadastro",{title:'Home'})
    },
    cadastro: (req,res)=>{
        
        const {nome,cpf_cnpj,senha} = req.body;
        const hash = bcrypt.hashSync(senha,10)
        const novoRestaurante = {nome,cpf_cnpj,senha:hash};
        new Restaurante(novoRestaurante).save().then(()=>{
            res.render("login",{title:'login',texto:"cadastro efetuado com sucesso!!"})
        }).catch((err)=>{
            res.redirect('/?error=1');
        })

    },
    showLogin:(req,res)=>{
        res.render('login',{title:'login', texto:0})
    },
    login: async (req,res)=>{
        const {cpf_cnpj,senha}=req.body;
        const restaurante = await Restaurante.findOne({cpf_cnpj:cpf_cnpj});
        if(!restaurante){
            res.redirect('/login?error=1');
        }
        if(!bcrypt.compareSync(senha,restaurante.senha)){
            res.redirect('/login?error=2')
        }
        
        req.session.restaurante = restaurante;
        res.redirect("/restaurante")
    },
    
    restaurante: async(req,res)=>{
        let restaurante =  req.session.restaurante._id;
        let cardapio = await Cardapio.find({restaurante})
        console.log(cardapio.length)
        res.render("restaurante",{title:'meu restaurante',cardapio})
    },
    cadastroProduto:(req,res)=>{
        let cardapio = req.session.cardapio
        let restaurante = req.session.restaurante
        res.render("cadastroProduto",{title:'cadastrar produto'})
        
    },
    novoProduto:(req,res)=>{
        async function decode_base64(base64str, filename) {
            let buff = Buffer.from(base64str, 'base64');
            let file = ('/images/produtos/' + Date.now().toString() + '-' + filename);
            fs.writeFile('./public' + file, buff, (error) => {
                if (error) {
                    throw error;
                } else {
                    return true;
                };
            });
            return file;
        };
        let restaurante = req.session.restaurante._id;
        const {nome,descricao,preco}=req.body;
        let novoProduto = {nome,descricao,preco,restaurante}
        new Cardapio(novoProduto).save().then(()=>{
            req.session.cardapio = novoProduto
            res.redirect("/restaurante")
        }).catch((err)=>{
                res.send('erro: '+err)
            })
            
            

    }
}
module.exports = cardapioController;