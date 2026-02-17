const { validateObjectId, handleServerError } = require("../utils/index.js");
const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

exports.getUserMealPlans = async (req, res) => {
  try {
    const db = mongodb.getDb().db().collection("MealPlans");
    const plans = await db.find({ userId: req.user._id }).toArray();
    res.json(plans);
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.getMealPlanById = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id, res)) return;
    const db = mongodb.getDb().db().collection("MealPlans");
    const plan = await db.findOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.user._id),
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.createMealPlan = async (req, res) => {
  try {
    const db = mongodb.getDb().db().collection("MealPlans");
    const plan = { ...req.body, userId: req.user._id };
    const result = await db.insertOne(plan);
    res.status(201).json(result.insertedId);
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.updateMealPlan = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id, res)) return;
    const db = mongodb.getDb().db().collection("MealPlans");
    const plan = await db.findOne({ _id: new ObjectId(req.params.id) });
    if (plan.userId !== req.user._id)
      return res.status(403).json("Ownership check failed");

    const updated = await db.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
    );
    res.json({ ...plan, ...req.body });
  } catch (error) {
    handleServerError(res, error);
  }
};

exports.deleteMealPlan = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id, res)) return;
    const db = mongodb.getDb().db().collection("MealPlans");
    const plan = await db.findOne({ _id: new ObjectId(req.params.id) });
    if (plan.userId !== req.user._id)
      return res.status(403).json("Unauthorized delete");
    await db.deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
  } catch (error) {
    handleServerError(res, error);
  }
};
