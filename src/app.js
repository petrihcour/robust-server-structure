const express = require("express");
const app = express();
app.use(express.json());
const pastes = require("./data/pastes-data");





app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

// POST request to /pastes

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", (req, res, next) => {
  const { data: { user_id, name, syntax, expiration, exposure, text } = {} } = req.body;
  if (text) { 
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
  res.status(201).json({ data: newPaste })
  } else {
    res.sendStatus(400);
  }
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
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
