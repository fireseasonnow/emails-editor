class EmailsEditorApp {
    constructor(container) {
        this.container = container;
        this.innerBoxEl = {};
        this.emailAddEl = {};
        this.emailListProxy = [];
        this.isSubscribe = false;
        this.init();
    }

    init() {
        this.container.innerHTML = this.emailsEditorBody();
        this.setupEmailsEditor();
    }

    emailsEditorBody() {
        return `<div class="emailsEditor">
                    <div class="emailsEditor__body">
                        <h3 class="emailsEditor__heading">Share <span class="emailsEditor__headingBold">Board name</span> with others</h3>
                        <div class="emailsEditor__innerBox">
                            <span class="email email--add">
                                <input class="email__input" type="text" placeholder="add more people..." spellcheck="false">
                            </span>
                        </div>
                    </div>
                    <div class="emailsEditor__footer">
                        <div class="emailsEditor__footerButtonWrapper">
                            <button class="emailsEditor__footerButton emailsEditor__footerButton--add" type="button">Add email</button>
                            <button class="emailsEditor__footerButton emailsEditor__footerButton--count" type="button">Get emails count</button>
                        </div>
                    </div>
                </div>`;
    }

    setupEmailsEditor() {
        const addEmailButtonEl = this.container.querySelector('.emailsEditor__footerButton--add');
        const countButtonEl = this.container.querySelector('.emailsEditor__footerButton--count');
        const emailAddInputEl = this.container.querySelector('.email--add .email__input');
        this.innerBoxEl = this.container.querySelector('.emailsEditor__innerBox');
        this.emailAddEl = this.container.querySelector('.email--add');

        countButtonEl.addEventListener('click', () => alert(this.container.querySelectorAll('.email:not(.email--invalid)').length - 1));
        addEmailButtonEl.addEventListener('click', () => this.addRandomEmail());

        emailAddInputEl.addEventListener('keyup', e => {
            if (e.keyCode === 13) {
                this.addEmail(e);
                return;
            }

            if (e.keyCode === 188 || e.keyCode === 32) {
                this.addEmail(e, true);
            }
        });

        emailAddInputEl.addEventListener('focusout', e => {
            this.addEmail(e);
        });

        emailAddInputEl.addEventListener('paste', e => {
            e.preventDefault();
            const pastedText = e.clipboardData.getData('text');
            const splittedEmails = pastedText.split(/[ ,]+/);

            splittedEmails.forEach(element => {
                this.addEmail(e, false, element.trim())
            });
        });
    }

    getEmailList() {
        const emails = this.container.querySelectorAll('.email:not(.email--add):not(.email--invalid) .email__input');
        let emailList = [];
        Array.from(emails).forEach(el => emailList.push(el.value));

        return emailList;
    }

    setEmailList(list) {
        if (typeof list !== 'string') {
            console.error('Please provide a string of comma separated emails');
            return;
        }

        const splittedEmails = list.split(',');
        splittedEmails.forEach((element) => this.addEmail(null, false, element.trim()));
    }

    subscribe() {
        let emailList = [];
        this.emailListProxy = new Proxy(emailList, {
            set(target, key, value) {
                target[key] = value;
                console.log('Email list changed');

                return true;
            }
        });

        this.isSubscribe = true;
    }

    randomEmail() {
        return `${Math.floor(Math.random()*26)}${Math.random().toString(36).substring(2,11)}@random.com`;
    }

    emailElement(email) {
        const tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        const replaceTag = tag => tagsToReplace[tag] || tag;
        const safeTagsReplace = str => str.replace(/[&<>]/g, replaceTag);

        return `<span class="email__content">${safeTagsReplace(email)}</span>
                <span class="email__delete">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0.8L7.2 0L4 3.2L0.8 0L0 0.8L3.2 4L0 7.2L0.8 8L4 4.8L7.2 8L8 7.2L4.8 4L8 0.8Z" fill="#050038" />
                    </svg>
                </span>
                <input class="email__input" type="text" value="${safeTagsReplace(email)}" spellcheck="false">`;
    }

    removeEmail(e) {
        e.currentTarget.parentElement.remove();

        if (this.isSubscribe) {
            this.emailListProxy.splice(this.emailListProxy.indexOf(e.currentTarget.nextElementSibling.value), 1);
        }
    }

    editEmail(e) {
        const editEmailAction = e => {
            if (!e.target.value) {
                this.removeEmail(e);
                this.emailAddEl.querySelector('.email__input').focus();
                return;
            }

            e.target.parentElement.querySelector('.email__content').innerHTML = e.target.value;
            e.target.parentElement.classList.remove('email--edit');

            this.emailAddEl.querySelector('.email__input').focus();

            if (!this.checkEmailIsValid(e.target.value)) {
                e.target.parentElement.classList.add('email--invalid');
            } else {
                e.target.parentElement.classList.remove('email--invalid');
            }
        };

        e.target.parentElement.classList.add('email--edit');

        e.target.addEventListener('focusout', e => {
            editEmailAction(e);
        });

        e.target.addEventListener('keyup', e => {
            if (e.keyCode === 13) {
                editEmailAction(e);
            } else {
                e.target.parentElement.querySelector('.email__content').innerHTML = e.target.value;
            }
        });
    };

    getClickHandler(onClick, onDblClick) {
        let timeoutID = null;
        const delay = 250;

        return (event) => {
            if (!timeoutID) {
                timeoutID = setTimeout(() => {
                    onClick(event);
                    timeoutID = null;
                }, delay);
            } else {
                timeoutID = clearTimeout(timeoutID);
                onDblClick(event);
            }
        };
    }

    addRandomEmail() {
        const emailEl = document.createElement('span');
        emailEl.classList.add('email');
        const emailText = this.randomEmail();
        emailEl.innerHTML = this.emailElement(emailText);
        emailEl.querySelector('.email__input').addEventListener('click', this.getClickHandler(e => this.editEmail(e), () => null));
        emailEl.querySelector('.email__delete').addEventListener('click', e => this.removeEmail(e));
        this.innerBoxEl.insertBefore(emailEl, this.emailAddEl);

        if (this.isSubscribe) {
            this.emailListProxy.push(emailText);
        }
    }

    checkEmailIsValid(email) {
        const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        return re.test(email);
    }

    addEmail(e, comma = false, pastedEmail = '') {
        let emailText = pastedEmail ? pastedEmail : e ? e.target.value : '';

        if (!emailText || !emailText.replace(/\s/g, '').length) {
            return;
        }

        const emailEl = document.createElement('span');
        emailEl.classList.add('email');

        let inputValue = ''
        if (comma) {
            inputValue = emailText.slice(0, -1);

            if (!inputValue.replace(/\s/g, '').length) {
                e.target.value = '';
                return;
            }
        }

        if (!this.checkEmailIsValid(inputValue || emailText)) {
            emailEl.classList.add('email--invalid');
        }

        emailEl.innerHTML = this.emailElement(inputValue || emailText);
        emailEl.querySelector('.email__input').addEventListener('click', e => this.editEmail(e));
        emailEl.querySelector('.email__input').addEventListener('dblclick', e => e.preventDefault());
        emailEl.querySelector('.email__delete').addEventListener('click', e => this.removeEmail(e));
        this.innerBoxEl.insertBefore(emailEl, this.emailAddEl);

        if (this.isSubscribe) {
            this.emailListProxy.push(emailText);
        }

        if (e) {
            e.target.value = '';
        }
    }
}

const EmailsEditor = container => {
    if (container instanceof HTMLElement && container.nodeType === 1) {
        return new EmailsEditorApp(container);
    } else {
        console.error('Provide HTMLElement node to render EmailsEditor');
    }
}
