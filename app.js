const express = require("express");
const multer = require("multer"); // uploader
const ejs = require("ejs");
const sharp = require("sharp"); // image converter
const path = require("path"); // Node module
const config = require("./config");

// Init multer
const storage = multer.memoryStorage();

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: config.sizeLimit },
  fileFilter: function(req, file, cb) {
    const extname = config.fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = config.fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb("Error: images only!");
    }
  }
}).single("myImage");

// Init App
const app = express();

// Init EJS
app.set("view engine", "ejs");

// Public folder
app.use(express.static("./public"));

app.get("/", (req, res) => res.render("index"));

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("index", { msg: err });
    }
    // Resize buffer and write
    sharp(req.file.buffer)
      .resize(config.width, config.height)
      .toFile(config.filePath + Date.now() + req.file.originalname)
      .catch(err => {
        console.log(err);
      });

    res.render("index", { msg: "Uploaded" });
  });
});

// Port
const port = 7000;

app.listen(port, () => console.log(`Server started on port ${port}`));
