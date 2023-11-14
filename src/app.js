const express = require("express");
const app = express();
app.use(express.json());
const pastes = require("./data/pastes-data");



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

app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});

// POST request to /pastes

app.post("/pastes", (req, res, next) => {

})


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
