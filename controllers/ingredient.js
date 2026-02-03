const { validateObjectId, handleServerError } = require("../utils/index.js");
const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection("Ingredients").find();
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

const createIngredient = async (req, res) => {
  try {
    const ingredient = {
      name: req.body.name,
    };
    const response = await mongodb
      .getDb()
      .db()
      .collection("Ingredients")
      .insertOne(ingredient);
    if (response.acknowledged) {
      res.status(201).json(response.insertedId);
    } else {
      res
        .status(500)
        .json(response.error || "Error occurred while creating ingredient.");
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const ingredientId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection("Ingredients")
      .deleteOne({ _id: ingredientId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || "Error occurred while deleting ingredient.");
    }
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = {
  getAll,
  createIngredient,
  deleteIngredient,
};
