const { validateObjectId, handleServerError } = require("../utils/index.js");
const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

exports.getAllRecipes = async (req, res) => {
  const db = mongodb.getDb().db().collection("Recipes");
  const recipes = await db.find().toArray();
  res.json(recipes);
};

exports.getRecipesById = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id, res)) return;
    const db = mongodb.getDb().db().collection("Recipes");
    const recipe = await db.findOne({ _id: new ObjectId(req.params.id) });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const db = mongodb.getDb().db().collection("Recipes");
    const newRecipe = { ...req.body, userId: req.user._id };
    const result = await db.insertOne(newRecipe);
    res.status(201).json(result.insertedId);
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id, res)) return;
    const db = mongodb.getDb().db().collection("Recipes");
    const recipe = await db.findOne({ _id: new ObjectId(req.params.id) });
    if (recipe.userId !== req.user._id)
      return res.status(403).json("Ownership check failed");

    const updated = await db.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
    );
    res.json({ ...recipe, ...req.body });
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id, res)) return;
    const db = mongodb.getDb().db().collection("Recipes");
    const recipe = await db.findOne({ _id: new ObjectId(req.params.id) });
    if (recipe.userId !== req.user._id)
      return res.status(403).json("Unauthorized delete");
    await db.deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
  } catch (error) {
    handleServerError(res, error);
  }
};
