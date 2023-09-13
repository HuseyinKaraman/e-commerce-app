const bcrypt = require("bcryptjs");
const ObjectId = require("mongodb").ObjectId

const users = [
    {
        name: "admin",
        lastName: "admin",
        email: "admin@admin.com",
        password: bcrypt.hashSync("admin@admin.com", 10),
        isAdmin: true,
    },
    {
        _id : new ObjectId("6488a4d8dcf924b931694650"),
        name: "John",
        lastName: "Doe",
        email: "test@test.com",
        password: bcrypt.hashSync("test@test.com", 10),
    },
];

module.exports = users;
