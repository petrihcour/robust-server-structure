const pastes = require("../data/pastes-data");

// router handler function

// get data. the list function will filter the pastes by userId if the userId is a route parameter. 
function list(req, res) {
  const { userId } = req.params;
  res.json({ data: pastes.filter(userId ? paste => paste.user_id == userId : () => true) });
}

// middleware validation for create pastes
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({
      status: 400,
      message: `Must include a(n) ${propertyName}.`,
    });
  };
}

// middleware validation for specific properties

// middleware validation for exposure property
function exposurePropertyIsValid(req, res, next) {
  const { data: { exposure } = {} } = req.body;
  const validExposure = ["private", "public"];
  if (validExposure.includes(exposure)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}.`,
  });
}

//middleware validation for syntax property
function syntaxPropertyIsValid(req, res, next) {
  const { data: { syntax } = {} } = req.body;
  const validSyntax = [
    "None",
    "Javascript",
    "Python",
    "Ruby",
    "Perl",
    "C",
    "Scheme",
  ];
  if (validSyntax.includes(syntax)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}.`,
  });
}

// middleware validation for expiration
function expirationIsValidNumber(req, res, next) {
  const { data: { expiration } = {} } = req.body;
  if (expiration <= 0 || !Number.isInteger(expiration)) {
    return next({
      status: 400,
      message: `Expiration requires a valid number.`,
    });
  }
  next();
}

// create pastes
function create(req, res) {
  let lastPasteId = pastes.reduce(
    (maxId, paste) => Math.max(maxId, paste.id),
    0
  );

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
}

// validate pasteId

function validatePasteId(req, res, next) {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => Number(pasteId) === paste.id);
  if (foundPaste) {
    res.locals.paste = foundPaste;
    return next();
  }
  next({
    status: 404,
    message: `Paste id not found: ${pasteId}`,
  });
}

// access specific pasteId

function read(req, res) {
  res.json({ data: res.locals.paste });
}

// update a post id, put request
function update(req, res) {
  const paste = res.locals.paste;
  const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;
  
  // Update the paste
  paste.name = name;
  paste.syntax = syntax;
  paste.expiration = expiration;
  paste.exposure = exposure;
  paste.text = text;

  res.json({ data: paste });
}


// handler to delete a paste
function destroy(req, res) {
  const { pasteId } = req.params;
  const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
  // splice() returns an array of the deleted elements, even if it's one element 
  const deletedPastes = pastes.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposure"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    bodyDataHas("user_id"),
    exposurePropertyIsValid,
    syntaxPropertyIsValid,
    expirationIsValidNumber,
    create,
  ],
  read: [validatePasteId, read],
  update: [
    validatePasteId, 
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposure"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    exposurePropertyIsValid,
    syntaxPropertyIsValid,
    expirationIsValidNumber,
    update,
  ],
  destroy: [validatePasteId, destroy],
};
