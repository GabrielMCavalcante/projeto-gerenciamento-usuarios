module.exports = {

    user: (req, res, app)=>{
        req.assert('_name', 'O nome é obrigatório.').notEmpty();
        req.assert('_email', 'O email está inválido.').notEmpty().isEmail();
        req.assert('_password', 'A senha é obrigatória.').notEmpty();

        const errors = req.validationErrors();

        if(errors)
        {
            app.utils.error.send(errors, res);
            return false;
        }
        else return true;
    }

};