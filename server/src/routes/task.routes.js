const express = require("express");
const controller = require("../controllers/task.controller");

const router = express.Router();

router.get("/", controller.getTasks);
router.post("/", controller.createTask);
router.patch("/", controller.updateAllTasks);
router.delete("/", controller.deleteManyTasks);

router.patch("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;