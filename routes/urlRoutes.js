const express = require("express");
const router = express.Router();
const {

    createShortUrl,

    getUrlStats,

    getAllUrls,

    deleteUrl,

    getQRCode

} = require("../controllers/urlController");

router.post("/shorten", createShortUrl);
router.get("/stats/:shortCode", getUrlStats);
router.get("/urls", getAllUrls);
router.delete("/urls/:id", deleteUrl);
router.get("/qr/:shortCode", getQRCode);

module.exports = router;