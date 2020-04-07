class User {

    constructor(name, gender, birth, country, email, password, photo, admin) {
        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
    }

    loadFromJSON(json) {
        for (let prop in json) {
            switch (prop) {
                case '_register':
                    {
                        json[prop] = new Date(json[prop]);
                    }
                default:
                    {
                        if(prop.substr(0, 1) == '_') this[prop] = json[prop];
                    }
            }
        }
    }//loadFromJSON

    toJSON() {
        let json = {};

        Object.keys(this).forEach(key => {
            if (this[key] != undefined) json[key] = this[key];
        });

        return json;
    }

    save() {

        return new Promise((resolve, reject) => {
            let promise;

            if (this.id) {
                //edit
                promise = HttpRequest.put(`/users/${this.id}`, this.toJSON());
            }
            else {
                //register
                promise = HttpRequest.post(`/users/`, this.toJSON());
            }

            promise.then(data => {
                this.loadFromJSON(data);
                resolve(this);
            }).catch(err=>{
                reject(err);
            });
        });



    }//save

    remove() {
        return HttpRequest.delete(`/users/${this.id}`);
    }//remove

    static selectAll() {
        return HttpRequest.get('/users');
    }//getUsersFromStorage

    /* --------------Getters------------------- */
    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get gender() {
        return this._gender;
    }

    get birth() {
        return this._birth;
    }

    get register() {
        return this._register;
    }

    get country() {
        return this._country;
    }

    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }

    get photo() {
        return this._photo;
    }

    get admin() {
        return this._admin;
    }

    /* --------------Setters------------------- */
    set id(newId) {
        this._id = newId;
    }

    set name(newName) {
        this._name = newName;
    }

    set gender(newGender) {
        this._gender = newGender;
    }

    set birth(newBirth) {
        this._birth = newBirth;
    }

    set country(newCountry) {
        this._country = newCountry;
    }

    set email(newEmail) {
        this._email = newEmail;
    }

    set password(newPassword) {
        this._password = newPassword;
    }

    set photo(newPhoto) {
        this._photo = newPhoto;
    }

    set admin(newAdmin) {
        this._admin = newAdmin;
    }

}