import { CloudIcon, HardDriveIcon, TrashIcon, XIcon } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { Button } from "~/components/ui/button";
import { useTempImages, type StoredImageType } from "../hooks/use-temp-images";
import { useConfirmationAlert } from "~/features/dialogs/hooks/use-confirm-dialog";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Props {
  image: File | StoredImageType;
  id: string;
}

const ImagePreview = ({ image, id }: Props) => {
  const { onRemove } = useTempImages();
  const {
    onOpen: openDeleteConfirmation,
    onError: onDeleteError,
    onCompleted: onDeleteCompleted,
    onPending: onDeletePending,
    onReset: onDeleteReset,
  } = useConfirmationAlert();
  const { mutate: deleteImage, isPending } =
    api.image.deleteImage.useMutation();
  const isFile = image instanceof File;

  const handleRemove = (id: string) => {
    if (image instanceof File) {
      onRemove(id);
    } else {
      openDeleteConfirmation({
        title: `Delete Image?`,
        message: `Are you sure you want to delete this image from our records? This action is not reversible.`,
        icon: TrashIcon,
        mode: "destructive",
        actionLabel: "Delete",
        enableConfirmation: true,
        children: () => {
          return (
            <div className="flex w-full flex-col items-start gap-3">
              <p className="text-primary text-sm font-medium">
                Image to Delete:
              </p>

              <div className="bg-muted/20 flex w-full items-center gap-4 rounded-md border p-3">
                {/* Image preview */}
                <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-md bg-transparent">
                  <Image
                    className="object-contain"
                    fill
                    src={image.url}
                    alt="Image to Delete"
                  />
                </div>

                {/* File details */}
                <div className="flex h-full max-w-[calc(100%-7rem)] flex-col overflow-hidden">
                  <p
                    className="text-foreground truncate text-left text-base font-medium"
                    title={image.name}
                  >
                    {image.name}
                  </p>
                  <Link
                    className="text-primary cursor-pointer truncate text-left text-xs underline underline-offset-2"
                    title={image.url}
                    href={image.url}
                    target="_blank"
                  >
                    {image.url}
                  </Link>
                </div>
              </div>
            </div>
          );
        },
        action: () => {
          onDeletePending();

          deleteImage(
            { imgId: image.id },
            {
              onSuccess: () => {
                toast.success(`Image Deleted.`);
                onRemove(image.id);
                onDeleteReset();
              },
              onError: (error) => {
                onDeleteError(error.message);
              },
              onSettled: () => {
                onDeleteCompleted();
              },
            },
          );
        },
      });
    }
  };

  return (
    <div className="relative w-36 rounded-xl border bg-transparent p-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        <Image
          fill
          className="object-contain"
          src={image instanceof File ? URL.createObjectURL(image) : image.url}
          alt={image.name}
        />
      </div>
      <div className="absolute top-2 right-2">
        <Button
          type="button"
          className="size-fit rounded-full bg-black/60 p-2"
          size="icon"
          onClick={() => handleRemove(id)}
          disabled={isPending}
        >
          <XIcon />
        </Button>
      </div>
      <div className="absolute bottom-2 left-2">
        <div
          className={cn(
            "rounded-full p-1 shadow-md",
            isFile ? "bg-gray-500" : "bg-sky-500",
          )}
        >
          {isFile ? (
            <HardDriveIcon className="!size-4 text-white" />
          ) : (
            <CloudIcon className="!size-4 text-white" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
