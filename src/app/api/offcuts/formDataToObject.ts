import { File } from "buffer";
import { nanoid } from "nanoid";
import fs from "fs";
import sharp from "sharp";
import { Picture } from "./Offcut";

const resizeAndOptimizeImage = async (buffer: Buffer) => {
  return sharp(buffer)
    .resize(600, 600, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .toFormat("jpeg", {
      mozjpeg: true,
      quality: 80,
    })
    .toBuffer();
};

const formDataToObject = async (formData: FormData) => {
  let modifications: any = {};

  let fileKeys: string[] = [];
  formData.forEach((value, key) => {
    if (value instanceof File) {
      fileKeys.push(key);
      return;
    }
    let valueToAdd = null;
    try {
      valueToAdd = JSON.parse(value as string);
    } catch (e) {
      valueToAdd = value;
    }
    if (modifications[key]) {
      if (Array.isArray(modifications[key])) {
        modifications[key].push(valueToAdd);
        return;
      }
      modifications[key] = [modifications[key], valueToAdd];
      return;
    }
    modifications[key] = valueToAdd;
  });

  for (const key of fileKeys) {
    for (const picture of formData.getAll(key)) {
      if (!(picture instanceof File)) {
        continue;
      }
      const file: File = picture.valueOf() as File;

      const name = nanoid();
      const path = `./public/uploads/${name}`;
      const pictureObject: Picture = {
        src: `/api/images/${name}`,
        title: file.name,
      };

      const buffer = await resizeAndOptimizeImage(
        Buffer.from(await file.arrayBuffer())
      );

      fs.writeFileSync(path, buffer);

      if (!modifications[key]) {
        modifications[key] = pictureObject;
      } else if (Array.isArray(modifications[key])) {
        modifications[key].push(pictureObject);
      } else {
        modifications[key] = [modifications[key], pictureObject];
      }
    }
  }

  return modifications;
};

export default formDataToObject;
