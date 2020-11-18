import multer from "multer";
import path from "path";

export default {
  storage: multer.diskStorage({
    destination: path.join(__dirname, "..", "..", "uploads"),
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname
        .split(" ")
        .join("-")}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req: any, file: any, cb: any) => {
    const isAccepted = ["image/png", "image/jpg", "image/jpeg"].find(
      (formatoAceito) => formatoAceito == file.mimetype
    );

    if (isAccepted) {
      return cb(null, true);
    }

    return cb(null, false);
  },
};
