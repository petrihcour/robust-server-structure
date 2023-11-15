const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");

// use app.use express.json to parse json data and add a body property to the request (req.body)
app.use(express.json());

app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

// New middleware function to validate request body for post request

function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next(); // call next without an error message if the result exists
  }
  next({
    status: 400,
    message: "A 'text' property is required.",
  });
}

// POST request to /pastes

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", bodyHasTextProperty, (req, res, next) => {
  const { data: { user_id, name, syntax, expiration, exposure, text } = {} } =
    req.body;
  const newPaste = {
    id: ++lastPasteId,
    user_id,
    name,
    syntax,
    expiration,
    exposure,
    text,
  };
  pastes.push(newPaste);
  res.status(201).json({ data: newPaste });
});

// TODO: Follow instructions in the checkpoint to implement ths API.

app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => Number(pasteId) === paste.id);
  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next(`Paste id not found: ${pasteId}`);
  }
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
