class Model {
    constructor() {
        this.contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    addContact(contact) {
        contact.id = Date.now();
        this.contacts.push(contact);
        this._commit();
    }

    deleteContact(id) {
        this.contacts = this.contacts.filter(contact => contact.id !== id);
        this._commit();
    }

    editContact(id, updatedContact) {
        this.contacts = this.contacts.map(contact =>
            contact.id === id ? { ...contact, ...updatedContact } : contact
        );
        this._commit();
    }

    bindContactListChanged(callback) {
        this.onContactListChanged = callback;
    }

    registerUser(user) {
        user.id = Date.now();
        this.users.push(user);
        this._commitUsers();
    }

    loginUser(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        if (user) {
            this.currentUser = user;
            this._commitCurrentUser();
            return user;
        }
        return null;
    }

    logoutUser() {
        this.currentUser = null;
        this._commitCurrentUser();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    _commitUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    _commitCurrentUser() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    _commit() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
        this.onContactListChanged(this.contacts);
    }
}
