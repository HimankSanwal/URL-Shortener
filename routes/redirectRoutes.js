const express = require("express");

const router = express.Router();

const { redirectToOriginal } = require("../controllers/urlController");

router.get("/:shortCode", redirectToOriginal);

module.exports = router;