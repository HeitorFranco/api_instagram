import fs from "fs";
import sharp from "sharp";

export default (
  file: Express.Multer.File,
  size: number,
  compressed_size: number
) => {
  const newPath = [
    file.path.split(".")[0] + ".webp",
    file.path.split(".")[0] + "_compressed" + ".webp",
  ];

  const paths = [];

  for (let i = 0; i < newPath.length; i++) {
    sharp(file.path)
      .resize(i == 0 ? size : compressed_size)

      .toFormat("webp")

      .webp({
        quality: 80,
      })

      .toBuffer()

      .then((data: any) => {
        fs.access(file.path, (err) => {
          if (!err) {
            fs.unlink(file.path, (err) => {
              if (err) console.log(err);
            });
          }
        });

        fs.writeFile(newPath[i], data, (err) => {
          if (err) {
            throw err;
          }
        });
      });
    paths.push(newPath[i].split("/uploads/")[1]);
  }
  return paths;
};
