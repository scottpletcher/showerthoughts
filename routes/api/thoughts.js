const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Thought = require("../../models/thought");

router.get("/:username", auth, async (req, res) => {
  try {
    if (req.params.username !== req.username) {
      return res.status(401).json({ msg: "Authorization denied" });
    }
    const thoughts = await Thought.find({
      username: req.params.username,
    }).sort({ date: -1 });
    res.json(thoughts);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (thought.username.toString() !== req.username) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(thought);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    if (req.body.username !== req.username) {
      return res.status(401).json({ msg: "Authorization denied" });
    }
    const thought = new Thought({
      username: req.body.username,
      thought: req.body.thought,
    });
    await thought.save();
    res.json(thought);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    var thought = await Thought.findById(req.params.id);

    if (thought.username.toString() !== req.username) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (thought) {
      thought.thought = req.body.thought;
      thought.date = Date.now();
    }

    await thought.save();
    res.json(thought);
  } catch (err) {
    res.json({ message: err });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const removedThought = await Thought.deleteOne({
      _id: req.params.id,
      username: req.username,
    });
    res.json(removedThought);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
