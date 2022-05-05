const jwt = require("jsonwebtoken");

const token = jwt.sign({userId: 12}, "MY_JWT_SECRET");
console.log(token);

const decoded = jwt.verify(token, "MY_JWT_SECRET");
console.log(decoded);

try {
    const notdecoded = jwt.verify(token, "PAS_LE_BON_SECRET");
} catch(exc) {
    console.log('PAS LA BONNE SIGNATURE');
}

// create bad token
const token2 = jwt.sign({userId: 14}, "MY_JWT_SECRET");
console.log(token2);

const token_splitted = token.split(".");
const token2_splitted = token2.split(".");

const fakeToken = token2_splitted[0] + "." + token2_splitted[1] + "." + token_splitted[2];

console.log(fakeToken);