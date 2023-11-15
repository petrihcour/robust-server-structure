const request = require("supertest");
const pastes = require("../../src/data/pastes-data");
const app = require("../../src/app");
// The lines ^^^ above load the SuperTest library, pastes data, and Express server into the file

describe("path /pastes", () => {
    beforeEach(() => {
        pastes.splice(0, pastes.length); // Clears out the pastes data
    })
    describe("GET method", () => {
        it("returns an array of pastes", async () => {
            const expected = [
                {
                    id: 1,
                    user_id: 1,
                    name: "Hello",
                    syntax: "None",
                    expiration: 10,
                    exposure: "private",
                    text: "Hello World!"
                  },
                  {
                    id: 2,
                    user_id: 1,
                    name: "Hello World in Python",
                    syntax: "Python",
                    expiration: 24,
                    exposure: "public",
                    text: "print(Hello World!)"
                  },
                  {
                    id: 3,
                    user_id: 2,
                    name: "String Reverse in JavaScript",
                    syntax: "Javascript",
                    expiration: 24,
                    exposure: "public",
                    text: "const stringReverse = str => str.split('').reverse().join('');" 
                }
            ];

            pastes.push(...expected);
            const response = await request(app).get("/pastes");

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(expected);
        });
    });
});