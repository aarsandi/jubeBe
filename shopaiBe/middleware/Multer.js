const multer = require("multer");

const Multer = multer({
  limits: 1024 * 1024
});

module.exports = {
  Multer
};
