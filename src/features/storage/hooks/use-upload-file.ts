import { useState } from "react";
import { uploadFiles } from "~/utils/uploadthing";

export function useUploadFiles() {
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (files: FileList) => {
    setUploading(true);

    const result = await uploadFiles("imageUploader", {
      files: Array.from(files),
    });

    setUploading(false);
    return result;
  };

  return {
    uploadImages,
    uploading,
  };
}
