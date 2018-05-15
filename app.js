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
    const ext = config.fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    // const mime = config

    if (ext) {
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
    } else {
      sharp(req.file.buffer)
        .resize(config.width, config.height)
        .toFile("./public/uploads/" + Date.now() + req.file.originalname)
        .then(info => {
          console.log(req.file);
        })
        .catch(err => {
          console.log(err);
          return err;
        });

      res.render("index", { msg: "Uploaded" });
    }
  });
});

// Port
const port = 7000;

app.listen(port, () => console.log(`Server started on port ${port}`));
