if(process.env.NODE_ENV == "production"){
    module.exports = {mongouri:"mongodb+srv://dbAdmin:-B!*guy679Phcpp@cluster0.3jrtw.mongodb.net/test?retryWrites=true&w=majority"}
}else{
    module.exports = {mongouri:"mongodb://localhost/Ei_campeao"}
}