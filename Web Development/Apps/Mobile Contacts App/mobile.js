let contacts = [];

$(document).ready(function() {

    $('.insert-link').on('click', function(e) {
        e.preventDefault();
        onInsertLinkClicked();
    });

    $('.search-link').on('click', function(e) {
        e.preventDefault();
        onSearchLinkClicked();
    });

    $('.showall-link').on('click', function(e) {
        e.preventDefault();
        onShowAllLinkClicked();
    });

    $('#btn').on('click', function() {
        insertContact({
            firstname: $('#firstname').val().trim(),
            lastname: $('#lastname').val().trim(),
            phoneNumber: $('#phoneNumber').val().trim()
        });
    });

    var debounceTimeout = null;

    $('#searchInput').on('input', function() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => getContactByPhoneNumber(this.value.trim()), 1500);
    });
});

function onInsertLinkClicked() {
    onBeforeSend();
    hideSearch();
    $('.insert-contact-form').removeClass('hidden');
}

function onSearchLinkClicked() {
    onBeforeSend();
    hideInsert();
    $('.search-wrapper').removeClass('hidden');
}

function onShowAllLinkClicked() {
    onBeforeSend();
    hideSearch();
    hideInsert();

    if (!contacts.length) {
        showError();
    } else {
        showAllContacts();
    }
}

function showAllContacts() {
    buildContacts(contacts);
}

function insertContact(contact) {
    hideAddContactError();
    resetFields();

    if ((!contact.firstname) || (!contact.lastname) || (!contact.phoneNumber)) {
        // show message
        return;
    }

    // Forward to CRUD Service
    if (addToContacts(contact)) {
        onAddContactSuccess();
    } else {
        onAddContactError();
    }
}

function hideAddContactError() {
    $('.outer').find('.found-identical').remove();
}

function resetFields() {
    $('#firstname').val('');
    $('#lastname').val('');
    $('#phoneNumber').val('');
}

function onAddContactSuccess() {
    buildContacts(contacts);
}

function onAddContactError() {
    $('body > .found-identical').clone().removeClass('hidden').appendTo('.outer');
}

function getContactByPhoneNumber(phoneNumber) {
    onBeforeSend();
    $('#searchInput').val('');

    if (!phoneNumber) {
        showError();
        return;
    }
    fetchContact(phoneNumber);
}

function onBeforeSend() {
    hideTable();
    hideError();
    hideAddContactError();
}

function fetchContact(phoneNumber) {
    let results = contacts.filter((contact) => contact.phoneNumber === phoneNumber);
    handleResults(results);
}

function handleResults(results) {
    if (!results.length) {
        showError();
    } else {
        buildContacts(results);
    }
}

function buildContacts(results) {
    hideTable();

    let outTable = `
    <tr>
        <th>Όνομα</th>
        <th>Επώνυμο</th>
        <th>Τηλέφωνο</th>
        <th>Delete</th>
    </tr>`;

    for (let contact of results) {
        outTable += '<tr>';
        for (let key of Object.keys(contact)) {
            outTable += `<td>${contact[key]}</td>`;
        }

        let $deleteLink = $('<a>')
            .html('Delete')
            .attr('onclick', `deleteContact(${JSON.stringify(contact)})`);
        outTable += `<td>${$deleteLink.prop('outerHTML')}</td>`;
        outTable += '</tr>';
    }

    showTable(outTable);
}

function deleteContact(contact) {
    if (!contact) {
        return;
    }

    if (confirm('Are you sure?')) {
        deleteFromContacts(contact);
    }

    buildContacts(contacts);
}

function showTable(tableString) {
    let $cloned = $('body > .contacts-table').clone();
    $cloned.html(tableString);
    $cloned.appendTo($('.outer'));
}

function hideTable() {
    $('.outer').find('.contacts-table').remove();
}

function hideSearch() {
    $('.search-wrapper').addClass('hidden');
}

function hideInsert() {
    $('.insert-contact-form').addClass('hidden');
}

function showError() {
    $('body > .not-found').clone().removeClass('hidden').appendTo('.outer');
}

function hideError() {
    $('.outer').find('.not-found').remove();
}

function addToContacts(contact) {
    let foundContacts = contacts.filter((c) => c.phoneNumber === contact.phoneNumber);

    if (!foundContacts.length) {
        contacts.push(contact);
        return true;
    } else {
        return false;
    }
}

function deleteFromContacts(contact) {
    contacts = contacts.filter((item) => item.phoneNumber !== contact.phoneNumber);
}
