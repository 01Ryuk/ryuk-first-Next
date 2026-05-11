import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: File): Promise<string> => {
  // convert the file to a base64 string so cloudinary can read it
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "ryuk", //  all images go into a "ryuk" folder in cloudinary
    resource_type: "image",
    transformation: [
      { width: 1200, height: 630, crop: "fill" }, // resizes to a standard blog image size
      { quality: "auto" }, // cloudinary automatically optimizes quality
      { fetch_format: "auto" }, // serves webp to browsers that support it
    ],
  });

  return result.secure_url; //this is the URL we save in the database
};