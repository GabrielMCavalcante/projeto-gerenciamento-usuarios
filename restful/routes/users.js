const NeDB = require('nedb');

const db = new NeDB({
    filename: 'users.db',
    autoload: true
});

module.exports = (app) => {
    const route = app.route('/users');
    const routeId = app.route('/users/:id');

    route.get((req, res) => {
        db.find({}).sort({ name: 1 }).exec((err, users)=>{
            if(err)
                app.utils.error.send(err, res);
            else
                res.status(200).json(users);
        });
    });

    route.post((req, res) => {

        if(!app.utils.validator.user(req, res, app)) return;

        db.insert(req.body, (err, user)=>{
            if(err)
                app.utils.error.send(err, res);
            else
                res.status(200).json(user);
            
        });
    });

    routeId.get((req, res)=>{

        db.findOne({ _id: req.params.id }).exec((err, user)=>{
            if(err)
                app.utils.error.send(err, res);
            else
                res.status(200).json(user);
        })
        
    });

    routeId.put((req, res)=>{

        if(!app.utils.validator.user(req, res, app)) return;

        db.update({ _id: req.params.id }, req.body, err=>{
            if(err)
                app.utils.error.send(err, res);
            else
                res.status(200).json(Object.assign(req.body, req.params));
        });
    });

    routeId.delete((req, res)=>{
        db.remove({ _id: req.params.id }, { multi: false },err=>{
            if(err)
                app.utils.error.send(err, res);
            else
                res.status(200).json(req.params.id);
        });
    });
};
