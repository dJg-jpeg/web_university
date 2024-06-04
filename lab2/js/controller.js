class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        if (this.isAppPage()) {
            this.checkAuthentication();
            this.model.bindContactListChanged(this.onContactListChanged);
            this.view.bindAddContact(this.handleAddContact);
            this.view.bindDeleteContact(this.handleDeleteContact);
            this.view.bindEditContact(this.handleEditContact);

            this.onContactListChanged(this.model.contacts);
        }

        if (this.isRegisterPage()) {
            this.view.bindRegisterUser(this.handleRegisterUser);
        }

        if (this.isLoginPage()) {
            this.view.bindLoginUser(this.handleLoginUser);
        }

        if (this.isProfilePage()) {
            this.view.displayCurrentUser(this.model.getCurrentUser());
            this.view.bindLogoutUser(this.handleLogoutUser);
        }
    }

    isAppPage() {
        return window.location.pathname.includes('app.html');
    }

    isRegisterPage() {
        return window.location.pathname.includes('register.html');
    }

    isLoginPage() {
        return window.location.pathname.includes('login.html');
    }

    isProfilePage() {
        return window.location.pathname.includes('profile.html');
    }

    checkAuthentication() {
        const currentUser = this.model.getCurrentUser();
        if (!currentUser) {
            window.location.href = 'login.html';
        }
    }

    onContactListChanged = contacts => {
        this.view.displayContacts(contacts);
    };

    handleAddContact = contact => {
        this.model.addContact(contact);
    };

    handleDeleteContact = id => {
        this.model.deleteContact(id);
    };

    handleEditContact = (id, contact) => {
        this.model.editContact(id, contact);
    };

    handleRegisterUser = user => {
        this.model.registerUser(user);
        window.location.href = 'login.html';
    };

    handleLoginUser = (email, password) => {
        const user = this.model.loginUser(email, password);
        return user;
    };

    handleLogoutUser = () => {
        this.model.logoutUser();
        this.view.displayCurrentUser(null);
    };
}
