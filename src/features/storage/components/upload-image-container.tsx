/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import EmptyImages from "./empty-images";
import ImagePreview from "./image-preview";
import { motion, AnimatePresence } from "framer-motion";
import { useTempImages } from "../hooks/use-temp-images";

interface Props {
  openFileBrowser?: boolean;
  onFileBrowserOpened?: () => void;
}
const UploadImageContainer = ({
  openFileBrowser = false,
  onFileBrowserOpened,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { images, onAddImages } = useTempImages();

  useEffect(() => {
    if (openFileBrowser) {
      handleClick();
      if (onFileBrowserOpened) {
        onFileBrowserOpened();
      }
    }
  }, [openFileBrowser]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files ? Array.from(e.target.files) : [];

    if (filesList.length > 0) {
      const existingIds = images ? new Set(Object.keys(images)) : new Set();

      const newRecords: Record<string, File> = {};
      for (const file of filesList) {
        const id = `${file.name}-${file.lastModified}`;
        if (!existingIds.has(id)) {
          newRecords[id] = file;
        }
      }

      if (Object.keys(newRecords).length > 0) {
        onAddImages(newRecords);
      }
    }

    // Reset so user can re-upload same file later
    e.target.value = "";
  };

  return (
    <div className="group border-primary bg-muted/10 text-primary hover:bg-muted/20 cursor-pointer rounded-2xl border border-dashed p-8 transition">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />

      {!images || Object.keys(images).length === 0 ? (
        <EmptyImages onClick={handleClick} />
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Images:</p>
          <div className="relative flex w-full flex-row flex-wrap gap-4">
            <AnimatePresence mode="popLayout">
              {Object.entries(images).map(([id, image]) => (
                <motion.div
                  key={id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, x: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="relative"
                >
                  <ImagePreview image={image} id={id} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImageContainer;
