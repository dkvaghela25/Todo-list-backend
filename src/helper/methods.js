const { client, connect } = require('../database/index');

async function getUsernames() {
    let users = await client.query({
        text: 'SELECT username FROM public.users;',
        rowMode: 'array',
    });

    users = users.rows.join(' ').split(' ');

    return users;
}

async function getEmails() {
    let emails = await client.query({
        text: 'SELECT email FROM public.users;',
        rowMode: 'array',
    });

    emails = emails.rows.join(' ').split(' ');

    return emails;
}

module.exports = { getUsernames , getEmails };