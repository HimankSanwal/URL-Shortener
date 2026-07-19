const Url = require("../models/Url");
const { nanoid } = require("nanoid");
const validator = require("validator");
const QRCode = require("qrcode");
const createShortUrl = async (req, res) => {

    try {

        const { originalUrl, customCode } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                success: false,
                message: "URL is required"
            });
        }

        if (!validator.isURL(originalUrl)) {
            return res.status(400).json({
                success: false,
                message: "Invalid URL"
            });
        }

        // Check if URL already exists
        const existingUrl = await Url.findOne({ originalUrl });

        if (existingUrl) {

            return res.status(200).json({
                success: true,
                message: "URL already exists",
                data: existingUrl
            });

        }

        // Decide short code
        const shortCode = customCode && customCode.trim() !== ""
            ? customCode.trim()
            : nanoid(6);

        // Check if alias already exists
        const aliasExists = await Url.findOne({ shortCode });

        if (aliasExists) {

            return res.status(400).json({

                success: false,

                message: "Custom alias already taken."

            });

        }

        // Create URL
        const newUrl = await Url.create({

            originalUrl,

            shortCode

        });

        res.status(201).json({

            success: true,

            data: newUrl

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

const redirectToOriginal = async (req, res) => {

    try {

        const { shortCode } = req.params;

        const url = await Url.findOne({ shortCode });

        if (!url) {

            return res.status(404).send("Short URL not found");

        }

        url.clicks++;

        await url.save();

        res.redirect(url.originalUrl);

    }

    catch (error) {

        console.log(error);

        res.status(500).send("Server Error");

    }

};

const getUrlStats = async (req, res) => {

    try {

        const { shortCode } = req.params;

        const url = await Url.findOne({ shortCode });

        if (!url) {

            return res.status(404).json({

                success: false,

                message: "URL not found"

            });

        }

        res.status(200).json({

            success: true,

            data: url

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};
const getAllUrls = async (req, res) => {

    try {

        const urls = await Url.find()
            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            data: urls

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};
const deleteUrl = async (req, res) => {

    try {

        const { id } = req.params;

        const deletedUrl = await Url.findByIdAndDelete(id);

        if (!deletedUrl) {

            return res.status(404).json({

                success: false,

                message: "URL not found"

            });

        }

        res.status(200).json({

            success: true,

            message: "URL deleted successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};
const getQRCode = async (req,res)=>{

    try{

        const {shortCode}=req.params;

        const url=await Url.findOne({shortCode});

        if(!url){

            return res.status(404).json({

                success:false,

                message:"URL not found"

            });

        }

        const shortUrl=

        `${req.protocol}://${req.get("host")}/${shortCode}`;

        const qr=

        await QRCode.toDataURL(shortUrl);

        res.json({

            success:true,

            qr

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            message:"Server Error"

        });

    }

};

module.exports = {

    createShortUrl,
    
    getQRCode,

    deleteUrl,

    redirectToOriginal,

    getUrlStats,

    getAllUrls

};