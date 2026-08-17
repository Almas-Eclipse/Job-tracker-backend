const router = require("express").Router();
const JobApplication = require("../models/JobApplication.model");
const isAuthenticated = require("../middleware/auth.middleware");


router.get("/", isAuthenticated, async (req, res) => {
  try {
    const jobs = await JobApplication.find({ user: req.user._id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
});


router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const job = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job", error: err.message });
  }
});


router.post("/", isAuthenticated, async (req, res) => {
  const { company, role, status, notes, dateApplied } = req.body;

  try {
    const newJob = await JobApplication.create({
      company,
      role,
      status,
      notes,
      dateApplied,
      user: req.user._id
    });
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ message: "Error creating job", error: err.message });
  }
});


router.put("/:id", isAuthenticated, async (req, res) => {
  const { company, role, status, notes, dateApplied } = req.body;

  try {
    const updatedJob = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { company, role, status, notes, dateApplied },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: "Error updating job", error: err.message });
  }
});


router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const deletedJob = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
});

module.exports = router;