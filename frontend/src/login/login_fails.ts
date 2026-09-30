/*
This object contains the messages
that are used during login
and registration.
The messages are stored in one place
so the same text can be reused
in different parts of the frontend.
If a message has to be changed later,
it only has to be changed here.
*/
export const LOGIN_MESSAGES = {

    /*
    Used when the email
    or password is incorrect.
    */
    LOGIN_FAILED:
        "E-Mail oder Passwort falsch",

    /*
    Used when a user tries
    to register with an email
    that already exists.
    */
    EMAIL_EXISTS:
        "E-Mail ist bereits registriert",

    /*
    Used after a successful registration.
    */
    REGISTER_SUCCESS:
        "Registrierung erfolgreich",

    /*
    Used if the registration
    could not be completed.
    */
    REGISTER_FAILED:
        "Registrierung fehlgeschlagen",

    /*
    Used when required fields
    were not filled in.
    */
    REGISTER_FIELDS_MISSING:
        "Bitte alle Felder ausfüllen"
};