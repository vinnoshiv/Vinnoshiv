const express = require("express");
const router = express.Router();
const { getInbox } = require("../controllers/inboxController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getInbox);

module.exports = router;
