const express = require("express");
const router = express.Router();
const { subscribe, getSubscribers, toggleSubscriber, deleteSubscriber, sendEmailToSubscribers } = require("../controllers/subscriberController");
const { protect } = require("../middleware/auth");

router.post("/", subscribe);
router.get("/", protect, getSubscribers);
router.put("/:id/toggle", protect, toggleSubscriber);
router.delete("/:id", protect, deleteSubscriber);
router.post("/send-email", protect, sendEmailToSubscribers);

module.exports = router;
