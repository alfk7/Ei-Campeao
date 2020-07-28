require("../models/Restaurante")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const Restaurante = mongoose.model("restaurantes")
const cardapioController = {
    index: (req,res)=>{
        res.render("cadastro",{title:'Home'})
    },
    cadastro: (req,res)=>{
        const {nome,cpf_cnpj,senha} = req.body;
        const hash = bcrypt.hashSync(senha,10)
        const novoRestaurante = {nome,cpf_cnpj,senha:hash};
        new Restaurante(novoRestaurante).save().then(()=>{
            console.log("restaurante cadastrado com sucesso!!")
        }).catch((err)=>{
            console.log("não foi possivel cadastrar o restaurante..." + err)
        })
    },
    montarCardapio:(req,res)=>{
        const {nome, descricao,preco}= req.body
    },
    restaurante:(req,res)=>{
        res.render("restaurante",{title:'Restaurante'})
    }
}
module.exports = cardapioController;