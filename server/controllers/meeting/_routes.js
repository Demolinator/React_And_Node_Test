const express = require("express");
const router = express.Router();
const { add, index, view, deleteData, deleteMany } = require("./meeting");

router.get("/", index);
router.get("/:id", view);
router.post("/", add);
router.delete("/:id", deleteData);
router.post("/deleteMany", deleteMany);

module.exports = router;
