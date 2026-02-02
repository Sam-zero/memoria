const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const memoryController = require("../controllers/memoryController");

router.post("/", auth, upload.single("coverImage"), memoryController.createMemory);
router.post("/with-moments", auth, memoryController.createMemoryWithMoments);
router.get("/", auth, memoryController.getMyMemories);
router.get("/:id", auth, memoryController.getMemoryById);
router.patch("/:id", auth, memoryController.updateMemory);
router.patch("/:id/add-moment", auth, memoryController.addMomentToMemory);
router.patch("/:id/remove-moment", auth, memoryController.removeMomentFromMemory);
router.delete("/:id", auth, memoryController.deleteMemory);

module.exports = router;
