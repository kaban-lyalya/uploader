const config = {
  // Limit uploading images (Bites)
  sizeLimit: 1000000,

  // Scaling size of image (Pixels)
  width: 300,
  height: 300,

  // Allowed extensions and mimetype
  fileTypes: /jpeg|jpg|png|gif/,

  // Path for write files
  filePath: "./public/uploads/"
};

module.exports = config;
