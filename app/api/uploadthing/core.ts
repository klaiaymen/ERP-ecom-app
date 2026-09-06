import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, key: file.key };
    }),
  qrCodeImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
