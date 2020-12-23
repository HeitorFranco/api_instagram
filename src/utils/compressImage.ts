import fs from "fs";
import sharp from "sharp";

export default async (
  file: Express.Multer.File,
  size: number,
  compressed_size: number
) => {
  const newPath = [
    file.path.split(".")[0] + ".webp",
    file.path.split(".")[0] + "_compressed" + ".webp",
  ];

  const paths: any = [];

  for (let i = 0; i < newPath.length; i++) {
    const data = await sharp(file.path)
      .resize(i == 0 ? size : compressed_size)
      .toFormat("webp")
      .webp({
        quality: 80,
      })
      .toBuffer();

    fs.writeFile(newPath[i], data, (err) => {
      if (err) {
        throw err;
      }
    });

    paths.push(newPath[i].split("/uploads/")[1]);
  }

  fs.access(file.path, (err) => {
    if (!err) {
      fs.unlink(file.path, (err) => {
        if (err) console.log(err);
      });
    }
  });

  return paths;
};
