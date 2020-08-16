const mongoose = require("mongoose");
const Schema = mongoose.Schema
const CardapioSchema = new Schema({
    nome:{
        type: String,
        required: true
    },
    descricao:{
        type: String
    },
    preco:{
        type: Number,
        required:true
    },
    ativo:{
        type:Boolean,
        required:true,
        default: 1
    },
    restaurante:{
        type: Schema.Types.ObjectId,
        ref: "restaurantes",
        required:true
    }
})
mongoose.model("cardapios",CardapioSchema)