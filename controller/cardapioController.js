const qr= require("qrcode")

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
        res.render('mesas',{title:"Suas mesas", usuario, minhasMesas})
    },
    showQr: async(req,res)=>{
        let usuario =  req.session.restaurante._id;
        let minhasMesas = await Mesa.find({restaurante:usuario});
        res.render('qrMesas',{title:"meus qrs",usuario,minhasMesas})
    },
    adicionarMesa: async (req,res)=>{
        let usuario = req.session.restaurante._id;
        let {numero}= req.body;
        let nMesaAtt = 1
        const nMesas = await Mesa.find({restaurante:usuario});
        if(nMesas.length == 0){
            for (let i = nMesaAtt; i <= numero; i++) {
                let qrCode = "provisório"
                let novaMesa = {numero:i,qrCode,restaurante:usuario};
                new Mesa(novaMesa).save().then(async()=>{
                    let att = await Mesa.findOne({numero:i});
                    await Mesa.updateOne({_id:att._id},{qrCode:`https://radiant-coast-77254.herokuapp.com/homeMesa?id=${att._id}`})
                });
                
            }
        } else{
            for (const mesa of nMesas) { 
                nMesaAtt++; 
                console.log(nMesaAtt)   
            }
            numero = parseInt(nMesaAtt)+parseInt(numero);
            for (let i = nMesaAtt; i <= numero; i++) {
                let qrCode = "provisório"
                let novaMesa = {numero:i,qrCode,restaurante:usuario};
                new Mesa(novaMesa).save().then(async()=>{
                    let att = await Mesa.findOne({numero:i});
                    await Mesa.updateOne({_id:att._id},{qrCode:`https://radiant-coast-77254.herokuapp.com/homeMesa?id=${att._id}`})
                });
                
            }
        }
        let minhasMesas = await Mesa.find({restaurante:usuario});
        req.session.mesa = minhasMesas
        res.redirect('/mesas')
        
        
    },teste: async(req,res)=>{
        let usuario = req.session.restaurante._id;
        
        let minhasMesas = await Mesa.find({restaurante:usuario});
        let teste =await qr.toDataURL("texto qualquer",(err,url)=>{
            let data = url.replace(/.*,/,"");
            let imagem = new Buffer(data,"base64");
            res.render("teste",{title:"teste",usuario,minhasMesas,data})
            
            
        }) 
        

    },
    showHomeMesa: async(req,res)=>{
        let {id} = req.query;
        console.log(id)
        let mesa = await Mesa.findOne({_id:id})
        res.render('homeMesa',{title:"sua mesa",mesa})
    }

}
module.exports = cardapioController;