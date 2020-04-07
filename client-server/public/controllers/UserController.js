class UserController {

    constructor(formId, updateId, tableId) {
        this.formEl = document.getElementById(formId);
        this.formUpdateEl = document.getElementById(updateId);
        this.tableEl = document.getElementById(tableId);

        this.boxCreateEl = document.getElementById('box-user-create');
        this.boxUpdateEl = document.getElementById('box-user-update');

        this.onSubmit(this.formEl);
        this.onEdit(this.formUpdateEl);
        this.selectAll();

    }//constructor

    updateTr(tr, obj) {
        tr.innerHTML = `
            <td><img src="${obj._photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${obj._name}</td>
            <td>${obj._email}</td>
            <td>${(obj._admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormatter(obj._register)}</td>
            <td>
                <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-delete btn-danger btn-xs btn-flat">Excluir</button>
            </td>`;

        tr.querySelector('button.btn-edit').addEventListener('click', () => {
            const json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (let prop in json) {
                let field = this.formUpdateEl.querySelector(`[name=${prop.replace('_', '')}]`);

                if (field) {
                    switch (field.type) {
                        case 'file':
                            {
                                continue;
                            }
                        case 'radio':
                            {
                                field = this.formUpdateEl.querySelector(`input[type=radio][value=${json[prop]}]`);
                                field.checked = true;
                                break;
                            }
                        case 'checkbox':
                            {
                                field.checked = json[prop];
                                break;
                            }
                        default:
                            {
                                field.value = json[prop];
                            }
                    }
                }
            }
            this.formUpdateEl.querySelector('img.photo').src = json._photo;
            this.shiftFormDisplay('none', 'block');
        });

        tr.querySelector('button.btn-delete').addEventListener('click', () => {
            if (confirm('Deseja realmente excluir este usuário?')) {
                const user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user));
                
                user.remove().then(()=>{
                    tr.remove();
                    this.updateCount();
                });
            }
        });
    }//updateTr

    addLine(dataUser) {
        const tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        this.updateTr(tr, dataUser);

        this.tableEl.appendChild(tr);

        this.updateCount();

    }//addLine

    updateCount() {
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {
            numberUsers++;
            const userObj = JSON.parse(tr.dataset.user);
            if (userObj._admin)
                numberAdmin++;
        })

        document.getElementById('newUsers').innerHTML = numberUsers;
        document.getElementById('newAdmin').innerHTML = numberAdmin;
    }//updateCount

    selectAll() {
        
        User.selectAll().then(data=>{
            data.forEach(data => {
                const user = new User();

                user.loadFromJSON(data);

                this.addLine(user);
            });

        });
        
    }//selectAll

    shiftFormDisplay(formCreateDisplay, formUpdateDisplay) {
        this.boxCreateEl.style.display = formCreateDisplay;
        this.boxUpdateEl.style.display = formUpdateDisplay;
    }//shiftFormDisplay

    onEdit(updateEl) {
        document.querySelector('button[type=button]').addEventListener('click', () => {
            updateEl.reset();
            this.shiftFormDisplay('block', 'none');
        });

        updateEl.addEventListener('submit', e => {
            e.preventDefault();

            const btnSubmit = updateEl.querySelector('button[type=submit]');

            btnSubmit.disabled = true;

            const values = this.getValues(updateEl);

            if (!values) {
                btnSubmit.disabled = false;
                return false;
            }

            const index = updateEl.dataset.trIndex;

            const editTr = this.tableEl.rows[index];

            const userOld = JSON.parse(editTr.dataset.user);

            const result = Object.assign({}, userOld, values);

            this.getPhoto(updateEl, values.gender).then(resolve => {

                if (!values.photo)
                    result._photo = userOld._photo;
                else
                    result._photo = resolve;

                editTr.dataset.user = JSON.stringify(result);

                const user = new User();
                user.loadFromJSON(result);

                user.save().then(usr => {

                    this.updateTr(editTr, usr);

                    this.updateCount();

                    updateEl.reset();

                    btnSubmit.disabled = false;

                    this.shiftFormDisplay('block', 'none');

                }, rjct => { console.error(rjct); });

            }, reject => { console.error(reject); });

        });
    }//onEdit

    onSubmit(formEl) {
        formEl.addEventListener('submit', e => {

            e.preventDefault();

            const btnSubmit = formEl.querySelector('button[type=submit]');

            btnSubmit.disabled = true;

            const values = this.getValues(formEl);

            if (!values) {
                btnSubmit.disabled = false;
                return false;
            }

            this.getPhoto(formEl, values.gender).then(resolve => {

                values.photo = resolve;

                values.save().then(user=>{
                    this.addLine(user);

                    formEl.reset();

                    btnSubmit.disabled = false;
                });
            }, reject => { console.error(reject); });

        });

    }//onSubmit

    getPhoto(formEl, gender) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            const photoEl = [...formEl.elements].filter(item => {
                if (item.name == 'photo')
                    return item;
            })

            const photoFile = photoEl[0].files[0];

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = err => {
                reject(err);
            }
            if (photoFile)
                fileReader.readAsDataURL(photoFile);
            else {
                (gender == 'M') ?
                    resolve('../dist/img/avatar5.png') :
                    resolve('../dist/img/avatar2.png');
            }
        });
    }//getPhoto

    isEmpty(field) {
        if (field.name != 'admin' && field.name != 'photo' && !field.classList.contains('btn')) {
            if (!field.value) {
                field.parentElement.classList.add('has-error');
                return true;
            }
            return false;
        }
        return false;
    }//isEmpty

    getValues(formEl) {
        let user = {};

        let isValid = true;

        [...formEl.elements].forEach(field => {

            field.addEventListener('change', () => {
                field.parentElement.classList.remove('has-error');
            });

            if (this.isEmpty(field)) isValid = false;

            switch (field.name) {
                case 'gender':
                    {
                        if (field.checked)
                            user.gender = field.value;
                        break;
                    }
                case 'admin':
                    {
                        user.admin = (field.checked) ? true : false;
                        break;
                    }
                default:
                    {
                        user[field.name] = field.value;
                    }
            }
        });

        if (!isValid)
            return false;

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );

    }//getValues
}