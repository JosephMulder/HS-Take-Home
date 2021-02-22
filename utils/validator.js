const validator = require("validator");

const validatePersonField = (field, value) => {
    if (field === "firstName") {
        return typeof value === 'string';
    } else if (field === "lastName") {
        return typeof value === 'string';
    } else if (field === "dateOfBirth") {
        return validator.isDate(value);
    } else if ( field === "emailAddress") {
        return validator.isEmail(value);
    } else if ( field === "socialSecurityNumber") {
        return isValidSSN(value);
    } else {
        return false;
    }
}

const isValidSSN = (value) => { //Used this to validate ssn https://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256F6A0072B54C
    var re = /^([0-6]\d{2}|7[0-6]\d|77[0-2])([ \-]?)(\d{2})\2(\d{4})$/;
    if (!re.test(value)) { return false; }
    var temp = value;
    if (value.indexOf("-") != -1) { temp = (value.split("-")).join(""); }
    if (value.indexOf(" ") != -1) { temp = (value.split(" ")).join(""); }
    if (temp.substring(0, 3) == "000") { return false; }
    if (temp.substring(3, 5) == "00") { return false; }
    if (temp.substring(5, 9) == "0000") { return false; }
    return true;
}

module.exports = { validatePersonField };