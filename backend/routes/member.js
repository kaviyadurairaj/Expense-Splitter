const express = require("express");
const mongoose = require("mongoose");
const Member = require("../models/Member"); // Import your Member model
const authMiddleware = require("../middleware/auth"); // Import your auth middleware

const router = express.Router();

// Add Member
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("📥 Request Body:", req.body);
    console.log("🔑 User ID from Token:", req.user?.id);

    // Validate request body
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ error: "Member name is required" });
    }

    // Check if member already exists
    const existingMember = await Member.findOne({ name });
    if (existingMember) {
      return res.status(400).json({ error: "Member already exists" });
    }

    const newMember = new Member({
      name,
      userId: req.user.id // Assuming you want to associate members with users
    });

    await newMember.save();
    console.log("✅ Member Saved:", newMember);
    res.status(201).json(newMember);
  } catch (error) {
    console.error("❌ Error adding member:", error.message);
    res.status(500).json({ error: "Failed to add member", details: error.message });
  }
});

// Get Members (for a specific user)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const members = await Member.find({ userId });
    res.json(members);
  } catch (error) {
    console.error("❌ Error fetching members:", error.message);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// Delete Member
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting member:", error.message);
    res.status(500).json({ error: "Failed to delete member" });
  }
});

module.exports = router;