const express = require("express");
const router = express.Router();
const { getTools, createTool, updateTool, deleteTool, incrementView, getAnalytics } = require("../controllers/toolController");
const { protect } = require("../middleware/auth");

router.get("/", getTools);
router.get("/analytics", protect, getAnalytics);
router.post("/", protect, createTool);
router.post("/:id/view", incrementView);
router.put("/:id", protect, updateTool);
router.delete("/:id", protect, deleteTool);

module.exports = router;
