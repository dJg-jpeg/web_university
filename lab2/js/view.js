class View {
    constructor() {
        this.app = document.querySelector('#root');

        if (this.app && this.isAppPage()) {
            this.form = this.createElement('form', ['input-group', 'mb-3']);

            this.inputName = this.createElement('input', ['form-control']);
            this.inputName.type = 'text';
            this.inputName.placeholder = 'Ім’я абонента';
            this.inputName.name = 'name';

            this.inputPhone = this.createElement('input', ['form-control']);
            this.inputPhone.type = 'text';
            this.inputPhone.placeholder = 'Телефонний номер';
            this.inputPhone.name = 'phone';

            this.submitButton = this.createElement('button', ['btn', 'btn-primary']);
            this.submitButton.textContent = 'Додати контакт';
            this.submitButton.type = 'submit';

            this.form.append(this.inputName, this.inputPhone, this.submitButton);

            this.contactList = this.createElement('ul', ['list-group']);

            this.app.append(this.form, this.contactList);

            this._initLocalListeners();
        }

        this._temporaryContactText = { name: '', phone: '' };
    }

    isAppPage() {
        return window.location.pathname.includes('app.html');
    }


    get _contactText() {
        return {
            name: this.inputName.value,
            phone: this.inputPhone.value
        };
    }

    _resetInput() {
        this.inputName.value = '';
        this.inputPhone.value = '';
    }

    _initLocalListeners() {
        this.contactList.addEventListener('input', event => {
            if (event.target.classList.contains('editable-name')) {
                const id = parseInt(event.target.closest('li').id);
                this._temporaryContactText = {
                    ...this._temporaryContactText,
                    [id]: {
                        ...this._temporaryContactText[id],
                        name: event.target.value
                    }
                };
            }
            if (event.target.classList.contains('editable-phone')) {
                const id = parseInt(event.target.closest('li').id);
                this._temporaryContactText = {
                    ...this._temporaryContactText,
                    [id]: {
                        ...this._temporaryContactText[id],
                        phone: event.target.value
                    }
                };
            }
        });
    }

    bindAddContact(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault();

            if (this._contactText.name && this._contactText.phone) {
                handler(this._contactText);
                this._resetInput();
            }
        });
    }

    bindDeleteContact(handler) {
        this.contactList.addEventListener('click', event => {
            if (event.target.classList.contains('btn-danger')) {
                const id = parseInt(event.target.parentElement.id);
                handler(id);
            }
        });
    }

    bindEditContact(handler) {
        this.contactList.addEventListener('click', event => {
            if (event.target.classList.contains('btn-success')) {
                const id = parseInt(event.target.parentElement.id);
                handler(id, this._temporaryContactText[id]);
                delete this._temporaryContactText[id];
            }
        });
    }
    createElement(tag, classes) {
        const element = document.createElement(tag);
        if (Array.isArray(classes)) {
            classes.forEach(className => element.classList.add(className));
        } else if (classes) {
            element.classList.add(classes);
        }
        return element;
    }

    getElement(selector) {
        return document.querySelector(selector);
    }

    displayContacts(contacts) {
        if (!this.contactList) return;

        while (this.contactList.firstChild) {
            this.contactList.removeChild(this.contactList.firstChild);
        }

        contacts.forEach(contact => {
            const li = this.createElement('li', ['list-group-item']);
            li.id = contact.id;

            const name = this.createElement('input', ['form-control', 'editable-name']);
            name.type = 'text';
            name.value = contact.name;

            const phone = this.createElement('input', ['form-control', 'editable-phone']);
            phone.type = 'text';
            phone.value = contact.phone;

            const saveButton = this.createElement('button', ['btn', 'btn-success', 'ml-2']);
            saveButton.textContent = 'Зберегти';

            const deleteButton = this.createElement('button', ['btn', 'btn-danger', 'ml-2']);
            deleteButton.textContent = 'Видалити';

            li.append(name, phone, saveButton, deleteButton);

            this.contactList.append(li);
        });
    }

    bindRegisterUser(handler) {
        const form = document.querySelector('#registerForm');
        if (form) {
            form.addEventListener('submit', event => {
                event.preventDefault();
                const user = {
                    name: document.querySelector('#name').value,
                    email: document.querySelector('#email').value,
                    gender: document.querySelector('#gender').value,
                    dob: document.querySelector('#dob').value,
                    password: document.querySelector('#password').value
                };
                handler(user);
            });
        }
    }

    bindLoginUser(handler) {
        const form = document.querySelector('#loginForm');
        const errorContainer = document.querySelector('#loginError');
        if (form) {
            form.addEventListener('submit', event => {
                event.preventDefault();
                const email = document.querySelector('#email').value;
                const password = document.querySelector('#password').value;
                const user = handler(email, password);
                if (!user) {
                    if (errorContainer) {
                        errorContainer.textContent = 'Неправильний логін або пароль. Будь ласка, спробуйте ще раз.';
                    }
                } else {
                    window.location.href = 'profile.html';
                }
            });
        }
    }

    bindLogoutUser(handler) {
        const button = document.querySelector('#logoutButton');
        if (button) {
            button.addEventListener('click', () => {
                handler();
                window.location.href = 'login.html';
            });
        }
    }

    displayCurrentUser(user) {
        const profileInfo = document.querySelector('#profileInfo');
        if (profileInfo) {
            if (user) {
                profileInfo.innerHTML = `
                    <tr><th>Ім’я</th><td>${user.name}</td></tr>
                    <tr><th>Email</th><td>${user.email}</td></tr>
                    <tr><th>Стать</th><td>${user.gender}</td></tr>
                    <tr><th>Дата народження</th><td>${user.dob}</td></tr>
                    <button id="logoutButton" class="btn btn-primary">Вийти</button>
                `;
                this.bindLogoutUser(() => {});
            } else {
                profileInfo.innerHTML = '<p>Користувач не увійшов</p>';
            }
        }
    }
}
