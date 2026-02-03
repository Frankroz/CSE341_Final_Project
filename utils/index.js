const ObjectId = require("mongodb").ObjectId;

const validateObjectId = (id, res) => {
  if (!ObjectId.isValid(id)) {
    res.status(400).json({
      error: "Invalid ID format. Must be a 24-character hexadecimal string.",
    });
    return false;
  }
  return true;
};

const handleServerError = (res, error) => {
  console.error(error);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: error.message });
};

module.exports = { validateObjectId, handleServerError };