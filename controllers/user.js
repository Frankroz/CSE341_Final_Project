const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const { validateObjectId, handleServerError } = require("../utils/index");

const getAll = async (req, res) => {
  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection("Users")
      .find()
      .toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error);
  }
};

const getSingle = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    if (!validateObjectId(contactId, res)) return;

    const result = await mongodb
      .getDb()
      .db()
      .collection("Users")
      .findOne({ _id: contactId });

    if (!result) {
      return res.status(404).json({ error: "Contact not found." });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    handleServerError(res, error);
  }
};

// POST: Create a new contact
const createContact = async (profile) => {
  const newUser = {
    githubId: profile.id,
    displayName: profile.displayName || profile.username,
    createdAt: new Date(),
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("Users")
    .insertOne(newUser);
  if (response.acknowledged) {
    return;
  } else {
    return response.error || "Some error occurred while creating the contact.";
  }
};

// PUT: Update an existing contact
const updateContact = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection("Users")
    .replaceOne({ _id: userId }, contact);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while updating the contact.",
      );
  }
};

// DELETE: Delete a contact
const deleteContact = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection("Users")
    .deleteOne({ _id: userId }, true);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while deleting the contact.",
      );
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact,
};
