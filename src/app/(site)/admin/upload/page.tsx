"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { useUploadFiles } from "~/features/storage/hooks/use-upload-file";
import { uploadFiles } from "~/utils/uploadthing";

export default function FileUploader() {
  const [files, setFiles] = useState<FileList | null>(null);
  const { uploadImages, uploading } = useUploadFiles();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async () => {
    if (!files) return;

    const uploadedFilesData = await uploadImages(files);
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <Button onClick={handleSubmit}> Upload</Button>
      {uploading ? <p>Uploading...</p> : null}
    </div>
  );
}
