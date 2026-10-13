const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

function validId(id) {
  return mongoose.isValidObjectId(id);
}

// GET /api/tasks - list tasks, newest first
router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id - get one task
router.get("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks - create task
router.post("/", async (req, res, next) => {
  try {
    const { title, description = "" } = req.body;
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "A task title is required" });
    }
    const task = await Task.create({ title: title.trim(), description });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// PUT /api/tasks/:id - update task
router.put("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    const { title, description, completed } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Task title cannot be empty" });
      }
      updates.title = title.trim();
    }
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = Boolean(completed);

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/tasks/:id/toggle - toggle completion
router.patch("/:id/toggle", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id - delete task
router.delete("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully", id: task._id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
