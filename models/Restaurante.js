const mongoose = require("mongoose");
const Schema = mongoose.Schema
const RestauranteSchema = new Schema({
    nome:{
        type:String,
        require:true
    },
    cpf_cnpj:{
        type:Number,
        required:true
    },
    senha:{
        type:String,
        required:true
    }
})
mongoose.model("restaurantes", RestauranteSchema)