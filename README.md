# emails-editor


### A vanilla JavaScript Emails Editor

* Lightweight (2kb minified and gzipped)
* No dependencies
* Modular CSS classes for easy styling

![Emails-editor screenshot](https://i.ibb.co/Q9fZmJ8/Test-task-share-2.png)

## Installation
Download and add to your project:

```html
<script src="emails-editor.min.js"></script>
```

## Styles
You will also need to include CSS file:

```html
<link href="styles.css" rel="stylesheet">
```

## Usage

**Emails-editor** needs to be initiated with HTMLElement node passed as an argument:

```html
<div id="emails-editor"></div>
<script src="emails-editor.min.js"></script>
<script>
  const container = document.querySelector('#emails-editor');
  EmailsEditor(container);
</script>
```

You can have multiple instances on the page:

```html
<div id="emails-editor"></div>
<div id="emails-editor2"></div>
<div id="emails-editor3"></div>
<script src="emails-editor.min.js"></script>
<script>
    const container = document.querySelector('#emails-editor');
    const app1 = EmailsEditor(container);

    const container2 = document.querySelector('#emails-editor2');
    const app2 = EmailsEditor(container2);

    const container3 = document.querySelector('#emails-editor3');
    const app3 = EmailsEditor(container3);
</script>
```

In this editor you can add email addresses that will be validated and marked properly (valid or invalid). You can edit or delete rendered emails. When clicked 'Add email' button a random email address will be added to the list. To check number of valid emails in the list click 'Get emails count' button.

## Methods

You can pass email list (a string with coma separated emails) with ```setEmailList(list)``` that will be rendered in the app:

```javascript
const container = document.querySelector('#emails-editor');
const app1 = EmailsEditor(container);
app1.setEmailList('email@example.com,firstname.lastname@example.com,email@subdomain.example.com');
```

You can get a list of valid emails rendered in the app with ```getEmailList()```:

```javascript
const container = document.querySelector('#emails-editor');
const app1 = EmailsEditor(container);
app1.getEmailList();
```

You can subscribe to changes in the email list with ```subscribe()```. When emails are added or deleted you get notification in the console:

```javascript
const container = document.querySelector('#emails-editor');
const app1 = EmailsEditor(container);
app1.subscribe();
```

## Browser Compatibility

* All modern browsers + IE11
