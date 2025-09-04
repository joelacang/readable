import { useState } from "react";
import type { ClientUploadedFileData } from "uploadthing/types";
import { createClient } from "~/utils/supabase/client"; // Adjust path to your Supabase client instance
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
