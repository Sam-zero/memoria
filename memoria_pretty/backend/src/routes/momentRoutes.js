const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const momentController = require("../controllers/momentController");

router.post("/", auth, upload.array("media", 5), momentController.createMoment);
router.get("/", auth, momentController.getMyMoments);
router.get("/:id", auth, momentController.getMomentById);
router.patch("/:id", auth, momentController.updateMoment);
router.delete("/:id", auth, momentController.deleteMoment);
router.post("/:id/view", auth, momentController.incrementViews);

module.exports = router;
