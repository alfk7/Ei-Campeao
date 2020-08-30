const qr= require("qr-image")

require("../models/Restaurante")
require("../models/Cardapio")
require("../models/Mesa")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const Restaurante = mongoose.model("restaurantes")
const Cardapio = mongoose.model("cardapios")
const Mesa = mongoose.model("mesas")


const cardapioController = {
    index: (req,res)=>{
        let usuario = undefined
        res.render("cadastro",{title:'Home',usuario})
        
    },
    cadastro: async (req,res)=>{
        let usuario = undefined
        const {nome,cpf_cnpj,senha} = req.body;
        const hash = bcrypt.hashSync(senha,10)
        const novoRestaurante = {nome,cpf_cnpj,senha:hash};
        const verificar = await Restaurante.findOne({cpf_cnpj:cpf_cnpj})
        if(verificar){
            res.redirect("/login?error=2");
        }
        new Restaurante(novoRestaurante).save().then(()=>{
            res.render("login",{title:'login',texto:"cadastro efetuado com sucesso!!", usuario})
        }).catch((err)=>{
            res.redirect('/?error=1');
        })

    },
    showLogin:(req,res)=>{
        let usuario = undefined
        res.render('login',{title:'login', texto:0, usuario})
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
        let usuario =  req.session.restaurante._id;
        let cardapio = await Cardapio.find({restaurante:usuario})

        console.log(usuario)
        res.render("restaurante",{title:'meu restaurante',cardapio,usuario})
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
        console.log(restaurante)
        const {nome,descricao,preco}=req.body;
        let novoProduto = {nome,descricao,preco,restaurante}
        new Cardapio(novoProduto).save().then(()=>{
            console.log(novoProduto)
            req.session.cardapio = novoProduto
            res.redirect("/restaurante")
        }).catch((err)=>{
                res.send('erro: '+err)
            })
    },
    showMesas: async (req,res)=>{
        let usuario =  req.session.restaurante._id;
        let minhasMesas = await Mesa.find({restaurante:usuario});
        console.log(minhasMesas.length)
        res.render('mesas',{title:"Suas mesas", usuario, minhasMesas})
    },
    adicionarMesa: async (req,res)=>{
        let usuario = req.session.restaurante._id;
        let {numero}= req.body;
        let nMesaAtt = 1
        console.log(numero);
        const nMesas = await Mesa.find({restaurante:usuario});
        console.log(nMesas.length)
        if(nMesas.length == 0){
            for (let i = nMesaAtt; i <= numero; i++) {
                let qrCode = "provisório"
                let novaMesa = {numero:i,qrCode,restaurante:usuario};
                new Mesa(novaMesa).save().then(async()=>{
                    let att = await Mesa.findOne({numero:i});
                    console.log(att);
                    await Mesa.updateOne({_id:att._id},{qrCode:`http://localhost:3000/homeMesas?id:${att._id}`})
                    console.log(att.numero);
                });
                
            }
        } else{
            for (const mesa of nMesas) {
                nMesaAtt++;    
            }
            numero = nMesaAtt+numero;
            for (let i = nMesaAtt; i <= numero; i++) {
                let qrCode = "provisório"
                let novaMesa = {numero:i,qrCode,restaurante:usuario};
                new Mesa(novaMesa).save().then(()=>{});
                let att = await Mesa.findOne({numero:i});
                await Mesa.updateOne({_id:att._id},{qrCode:`http://localhost:3000/homeMesas?id:${att._id}`})
                console.log(att.numero);
            }
        }
        let minhasMesas = await Mesa.find();
        req.session.mesa = minhasMesas
        res.redirect("/mesas")
        
        
    },
    showHomeMesa: async(req,res)=>{
        let id = req.query.id;
        let mesa = await Mesa.findOne({_id:id})
        res.redirect('/mesas')
    }

}
module.exports = cardapioController;