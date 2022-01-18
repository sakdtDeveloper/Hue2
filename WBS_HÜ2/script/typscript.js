//Klassen
class User {
    constructor(name, ware, ort, datum, status) {
        this.id = ++User.id_max;
        this.name = name;
        this.ware = ware;
        this.ort = ort;
        this.datum = new Date(datum);
        this.status = status;
        User.stack.push(this);
    }
    getID() {
        // Ermittlung der id des rufenden Eintrags
        return this.id;
    }
    getStatus() {
        // Ermittlung des Status des rufenden Eintrags
        return this.status;
    }
    setStatus(status) {
        // Setzen des Status des rufenden Eintrags
        this.status = status;
        return this.status;
    }
    static getUsersStack() {
        // Rückgabe des vollständigen Stacks mit allen Einträgen
        return User.stack.sort((a, b) => b.id - a.id);
    }
}
User.id_max = 0;
User.stack = [];
// Globale Variablen ----------------------------------------------------------
let username;
let statusCreate = 0;
// Funktionen -----------------------------------------------------------------
function renderUser(users) {
    let html = "";
    for (let user of users) {
        if (user.getStatus() === 1) {
            let id = user.getID();
            let userName = user.name;
            let ware = user.ware;
            let ort = user.ort;
            let datum = user.datum.toISOString().slice(0, 10);
            html += "<tr class='b-dot-line' data-user-id=" + id + ">";
            html += "<td class='click-value' data-purpose='user' data-user-id=" + id + ">" + userName + "</td>";
            html += "<td class='click-value' data-purpose='ware'data-user-id=" + id + " >" + ware + "</td>";
            html += "<td class='click-value' data-purpose='ort' data-user-id=" + id + ">" + ort + "</td>";
            html += "<td class='click-value' data-purpose='datum' data-user-id=" + id + ">" + datum + "</td>";
            html += "<td >" + "<button data-purpose='edit' data-user-id=" + id + ">E</button>" + "</td>";
            html += "<td >" + "<button data-purpose='delete' data-user-id=" + id + ">X</button>" + "</td>";
            html += "</tr>";
        }
    }
    document.getElementById("create-save-user").classList.remove('unsichtbar');
    document.getElementById("shopping-tbody").innerHTML = html;
    statusCreate = 0;
}
function init(event) {
    /*
     * Aufbau der Tabelle nach der Eingabe des Usernames
     * */
    //verhindert dass die Seite immer wieder aufgebaut wird nach einer submit
    event.preventDefault();
    username = document.getElementById("user-name").value;
    //ausgabe div sichtbar machen
    document.getElementById("ausgabe").classList.remove('unsichtbar');
    new User("Steve", "Tee, kekse", "Kassel", new Date(), 1);
    new User("Sam", "Kaffee, kekse", "Lollar", new Date(), 1);
    renderUser(User.getUsersStack());
}
function aufgabe(event) {
    event.preventDefault();
    const command = event.submitter.value;
    if (command === "neu") {
        if (statusCreate === 0) {
            statusCreate = 1; // Der Status 1 sperrt die Bearbeitung anderer Events, die nicht zur
            // Eingabe des neuen Users gehören
            const html = "<tr class='b-dot-line' data-user-id=" + undefined + " > " +
                "<td data-purpose='user' data-user-id=" + undefined + ">" +
                "<input name='user' readonly data-user-id=" + undefined + " type='text' value=" + username + ">" +
                "</td>" +
                "<td data-purpose='ware' data-user-id=" + undefined + ">" +
                "<form >" +
                "<input  name='ware' class= 'as-width' type='text' placeholder='Was?'>" +
                "<br>" +
                "<input class='as-button-0' data-purpose='speichern' data-user-id=" + undefined + " type='submit' value='speichern' >" +
                "<input class='as-button-0' data-purpose='zurück' data-user-id=" + undefined + " type='submit' value='zurück' >" +
                "</form>" +
                "</td>" +
                "<td data-purpose='ort' data-user-id=" + undefined + ">" +
                "<input name='ort' type='text' placeholder='Wo?'>" +
                "</td>" +
                "<td data-purpose='datum' data-user-id=" + undefined + ">" +
                "<input name='datum' readonly type='text' value=" + (new Date().toISOString()).slice(0, 10) + ">" +
                "</td>" +
                "</tr>";
            const tbody = document.getElementById("shopping-tbody").innerHTML;
            document.getElementById("shopping-tbody").innerHTML = html + tbody;
        }
    }
    if (command === "sichern") {
        // Abbruch aller aktiven Eingaben und Ausgabe des aktuellen
        // Zustands der UsersStack
        renderUser(User.getUsersStack());
    }
}
function createUpdateDelete(event) {
    event.preventDefault();
    const command = event.target.getAttribute("data-purpose");
    const idSelect = event.target.getAttribute("data-user-id");
    if (command === "zurück") {
        renderUser(User.getUsersStack());
    }
    else if (command === "speichern") {
        // Der Status 1 sperrt die Bearbeitung anderer Events, die nicht zur
        // Eingabe des neuen Users gehören
        if (statusCreate === 1) {
            const currentWare = event.target.parentElement[0].value;
            const currentOrt = event.target.parentElement.parentElement.nextSibling.childNodes[0].value;
            if (currentWare === "" || currentOrt === "") {
                // Wenn keine Ware oder keinen Ort angegeben wurde, wird die Erzeugung des Eintrags abgebrochen.
                renderUser(User.getUsersStack());
            }
            else {
                const currentName = event.target.parentElement.parentElement.previousSibling.childNodes[0].value;
                const currentDatum = event.target.parentElement.parentElement.nextSibling.nextSibling.childNodes[0].value;
                new User(currentName, currentWare, currentOrt, new Date(currentDatum), 1);
                renderUser(User.getUsersStack());
            }
        }
    }
    else if (command === "user" || command === "ware" || command === "ort" || command === "datum" || command === "edit") {
        if (statusCreate === 0) {
            // Der Status 2 sperrt die Bearbeitung anderer Events, die nicht zur
            // Bearbeitung der Änderung des Users gehören
            statusCreate = 2;
            const currentId = Number(event.target.getAttribute('data-user-id'));
            let currentUser;
            for (let user of User.getUsersStack()) {
                if (user.getID() === currentId) {
                    currentUser = user;
                }
            }
            const html = "<td data-purpose='user' data-user-id=" + currentId + ">" +
                "<input name='user' data-user-id=" + currentId + " type='text' value=" + currentUser.name + ">" +
                "</td>" +
                "<td data-purpose='ware' data-user-id=" + currentId + ">" +
                "<form >" +
                "<input  name='ware' class= 'as-width' type='text' value=" + currentUser.ware + ">" +
                "<br>" +
                "<input class='as-button-0' data-purpose='ändern' data-user-id=" + currentId + " type='submit' value='ändern' >" +
                "<input class='as-button-0' data-purpose='zurück' data-user-id=" + currentId + " type='submit' value='zurück' >" +
                "<input class='as-button-0' data-purpose='löschen' data-user-id=" + currentId + " type='submit' value='löschen' >" +
                "</form>" +
                "</td>" +
                "<td data-purpose='ort' data-user-id=" + currentId + ">" +
                "<input name='ort' type='text' value=" + currentUser.ort + ">" +
                "</td>" +
                "<td data-purpose='datum' data-user-id=" + currentId + ">" +
                "<input name='datum' type='text' value=" + (new Date().toISOString()).slice(0, 10) + ">" +
                "</td>";
            if (command === "edit") {
                event.target.parentElement.parentElement.innerHTML = html;
            }
            else {
                event.target.parentElement.innerHTML = html;
            }
        }
    }
    else if (command === "löschen" || command == "delete") {
        const currentId = Number(event.target.getAttribute('data-user-id'));
        for (let user of User.getUsersStack()) {
            if (user.getID() === currentId) {
                user.setStatus(2);
            }
        }
        renderUser(User.getUsersStack());
    }
    else if (command === "ändern") {
        if (statusCreate === 2) {
            const currentWare = event.target.parentElement[0].value;
            const currentOrt = event.target.parentElement.parentElement.nextSibling.childNodes[0].value;
            const currentName = event.target.parentElement.parentElement.previousSibling.childNodes[0].value;
            const currentDatum = event.target.parentElement.parentElement.nextSibling.nextSibling.childNodes[0].value;
            if (currentWare === '' || currentName === '' || currentOrt === '' || currentDatum === '') {
                renderUser(User.getUsersStack());
            }
            else {
                const currentId = Number(event.target.getAttribute('data-user-id'));
                for (let user of User.getUsersStack()) {
                    if (user.getID() === currentId) {
                        user.name = currentName;
                        user.ware = currentWare;
                        user.ort = currentOrt;
                        user.datum = new Date(currentDatum);
                    }
                }
                renderUser(User.getUsersStack());
            }
        }
    }
}
// Callbacks - Eventlistener ---------------------------------------------------
document.addEventListener("DOMContentLoaded", event => {
    /* Warten bis der DOM des HTML-Dokuments aufgebaut ist. Danach werden
          die "Callbacks" initialisiert. */
    document.getElementById("eingabe-user").addEventListener("submit", event => {
        init(event);
    });
    document.getElementById("create-save-user").addEventListener("submit", event => {
        aufgabe(event);
    });
    document.getElementById("shopping-tbody").addEventListener("click", (event) => {
        createUpdateDelete(event);
    });
});
//# sourceMappingURL=typscript.js.map