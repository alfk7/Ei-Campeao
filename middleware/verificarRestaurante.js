const VerificaUsuarioLogado = (req, res, next) => {

    if(!req.session.restaurante){
        res.redirect('/login');
    }

    next();
}

module.exports = VerificaUsuarioLogado