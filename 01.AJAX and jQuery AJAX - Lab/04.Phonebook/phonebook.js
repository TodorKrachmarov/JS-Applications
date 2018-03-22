$(function () {
    $('#btnLoad').click(loadContacts);
    $('#btnCreate').click(createContact);
    let listPhones = $('#phonebook');
    let baseUrl ='https://phonebook-c8ce3.firebaseio.com/';

    function loadContacts() {
        let req = {
            method: 'GET',
            url: baseUrl + 'phonebook.json',
            success: displayContacts,
            error: displayError
        };
        $.ajax(req);
    }
    function displayContacts(contacts) {
        listPhones.empty();
        for (let key in contacts) {
            let person = contacts[key]['person'];
            let phone = contacts[key]['phone'];
            let li = $("<li>");
            li.text(person + ': ' + phone + ' ');
            listPhones.append(li);
            li.append($("<button>Delete</button>")
                .click(deleteContact.bind(this, key)));
        }

    }
    function displayError(err) {
        listPhones.append('<li>Error</li>');
    }
    function notify(err) {
        let div = $('#notification');
        $(div).text(err.statusText);
        $(div).css('display', 'block');
        let interval = setTimeout(function () {
            $(div).css('display', 'none');
        }, 2000);
    }
    function createContact() {
        let person = $('#person');
        let phone = $('#phone');
        if ($(person).val().trim() !== '' && $(phone).val().trim() !== ''){
            let req = {
                url: baseUrl + 'phonebook.json',
                method: 'POST',
                data: JSON.stringify({
                    person: $(person).val(),
                    phone: $(phone).val()
                }),
                success: loadContacts,
                error: notify
            };
            $.ajax(req);
        }
        $(person).val('');
        $(phone).val('');
    }
    function deleteContact(key) {
        let req = {
            url: baseUrl + 'phonebook/' + key + '.json',
            method: 'DELETE',
            success: loadContacts,
            error: notify
        };
        $.ajax(req);
    }
});
