const mongodb = require("../data/database");
const { ObjectId } = require("mongodb");

// GET all grocery lists for the authenticated user
const getAll = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await mongodb
      .getDb()
      .db()
      .collection("GroceryLists")
      .find({ userId: userId });

    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single grocery list by ID (with ownership check)
const getSingle = async (req, res) => {
  try {
    const listId = new ObjectId(req.params.id);
    const userId = req.user._id;

    const result = await mongodb
      .getDb()
      .db()
      .collection("GroceryLists")
      .findOne({ _id: listId, userId: userId });

    if (!result) {
      return res
        .status(404)
        .json({ message: "List not found or unauthorized" });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST: Create a new grocery list
const createList = async (req, res) => {
  try {
    const newList = {
      userId: req.user._id, // Set ownership automatically
      weekNumber: req.body.weekNumber,
      listName: req.body.listName,
      items: req.body.items, // Array of objects [{name, quantity, unit, isPurchased}]
      totalEstimatedCost: req.body.totalEstimatedCost,
      storeName: req.body.storeName,
      updatedAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection("GroceryLists")
      .insertOne(newList);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json("Some error occurred while creating the list.");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT: Update an existing grocery list
const updateList = async (req, res) => {
  try {
    const listId = new ObjectId(req.params.id);
    const userId = req.user._id;

    const updatedList = {
      userId: userId,
      weekNumber: req.body.weekNumber,
      listName: req.body.listName,
      items: req.body.items,
      totalEstimatedCost: req.body.totalEstimatedCost,
      storeName: req.body.storeName,
      updatedAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection("GroceryLists")
      .replaceOne({ _id: listId, userId: userId }, updatedList);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json("List not found or no changes made.");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE: Remove a grocery list
const deleteList = async (req, res) => {
  try {
    const listId = new ObjectId(req.params.id);
    const userId = req.user._id;

    const response = await mongodb
      .getDb()
      .db()
      .collection("GroceryLists")
      .deleteOne({ _id: listId, userId: userId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json("List not found or unauthorized.");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createList,
  updateList,
  deleteList,
};
