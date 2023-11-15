const request = require("supertest");
const pastes = require("../../src/data/pastes-data");
const app = require("../../src/app");
// The lines ^^^ above load the SuperTest library, pastes data, and Express server into the file

describe("path /pastes", () => {
    beforeEach(() => {
        pastes.splice(0, pastes.length); // Clears out the pastes data
    })
})