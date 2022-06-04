const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const buffer = multer();

const configuracionMulter = {
  //100kb

  limits: { fileSize: 4 * 1024 * 1024 },
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + "../../uploads/");
    },
    filename: (req, file, cb) => {
      console.log("accaa", buffer);

      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
    buffer: (req, file, cb) => {},
  })),
  fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Formato No válido"));
    }
  },
};

const upload = multer(configuracionMulter).single("image");

exports.subirArchivos = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          res
            .status(400)
            .json({ error: "El archivo es muy grande: Máximo 5MB " });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(400).json({ error: error.message });
      }
    }

    return next();
  });
};
