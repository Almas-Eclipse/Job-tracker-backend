const router = require("express").Router();
const Note = require("../models/Note.model");
const isAuthenticated = require("../middleware/auth.middleware");

router.get("/:jobId/notes", isAuthenticated, async (req, res) => {
  try {
    const notes = await Note.find({ jobApplication: req.params.jobId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes", error: err.message });
  }
});


router.post("/:jobId/notes", isAuthenticated, async (req, res) => {
  const { content } = req.body;
  try {
    const newNote = await Note.create({
      content,
      jobApplication: req.params.jobId,
      user: req.user._id
    });
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: "Error creating note", error: err.message });
  }
});


router.delete("/notes/:id", isAuthenticated, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Error deleting note", error: err.message });
  }
});

module.exports = router;
