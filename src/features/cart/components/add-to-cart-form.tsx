import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCartPlus } from "react-icons/fa";
import type z from "zod";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup } from "~/components/ui/radio-group";
import BookListItem from "~/features/books/components/book-list-item";
import BookVariantSelect from "~/features/books/components/book-variant-select";
import { api } from "~/trpc/react";
import type {
  BookDetailType,
  BookPreviewType,
  BookVariantType,
} from "~/types/book";
import { Loader2Icon } from "lucide-react";
import { createAddToCartSchema } from "~/zod-schemas/book";
import { cn } from "~/lib/utils";
import { useAddToCartDialog } from "../hooks/use-add-to-cart-dialog";

interface Props {
  book: BookPreviewType | BookDetailType;
  mode?: "page" | "dialog";
}

const AddToCartForm = ({ book, mode = "dialog" }: Props) => {
  const { mutate: addToCart, isPending } = api.cart.addToCart.useMutation();
  const utils = api.useUtils();
  const {
    onClose: closeAddToCartDialog,
    onPending: onAddingToCart,
    onCompleted: onAddingToCartCompleted,
  } = useAddToCartDialog();

  const addToCartSchema = useMemo(() => createAddToCartSchema(book), [book]);
  const [currentVariant, setCurrentVariant] = useState<BookVariantType | null>(
    null,
  );
  const form = useForm<z.infer<typeof addToCartSchema>>({
    resolver: zodResolver(addToCartSchema),
    defaultValues: {
      variantId: "",
      quantity: 1,
    },
  });

  const selectedVariantId = useWatch({
    control: form.control,
    name: "variantId",
  });

  useEffect(() => {
    setCurrentVariant(
      book.variants.find((v) => v.id === selectedVariantId) ?? null,
    );
  }, [selectedVariantId, book]);

  const onSubmit = (values: z.infer<typeof addToCartSchema>) => {
    onAddingToCart();
    addToCart(
      {
        variantId: values.variantId,
        bookId: book.id,
        quantity: values.quantity ?? 0,
      },
      {
        onSuccess: (response) => {
          if (response) {
            if (response.toastMessage) {
              toast.success(response.toastMessage);
            }

            if (response.addToCount) {
              utils.cart.getCartItemsCount.setData(undefined, (prev) => {
                return (prev ?? 0) + 1;
              });
            }

            if (response.cartItem) {
              const cartItem = response.cartItem;

              utils.cart.getCartItems.setData(undefined, (prev) => {
                if (!prev) return prev;

                const existingIndex = prev.items.findIndex(
                  (item) => item.id === cartItem.id,
                );

                const updatedItems = [...prev.items];

                if (existingIndex > -1) {
                  updatedItems[existingIndex] = cartItem;
                } else {
                  updatedItems.push(cartItem);
                }

                return {
                  ...prev,
                  items: updatedItems,
                };
              });
            }
          }

          closeAddToCartDialog();
        },
        onError: (error) => {
          toast.error(`Error adding item to cart: ${error.message}`);
        },
        onSettled: () => {
          onAddingToCartCompleted();
        },
      },
    );
  };

  const AddToCartButton = ({ className }: { className?: string }) => {
    return (
      <Button
        className={cn(className)}
        disabled={!form.formState.isValid || isPending}
      >
        {isPending ? <Loader2Icon className="animate-spin" /> : <FaCartPlus />}
        {isPending ? "Adding To Cart..." : "Add To Cart"}
      </Button>
    );
  };

  return (
    <div>
      {mode === "dialog" && <BookListItem book={book} compact />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div
            className={cn(
              "flex flex-col items-start justify-start gap-4",
              mode === "page" && "lg:flex-row lg:gap-8",
            )}
          >
            <FormField
              name="variantId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose a Format:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid w-fit grid-cols-3 gap-4"
                      disabled={isPending}
                    >
                      {book.variants.map((variant) => (
                        <BookVariantSelect
                          key={variant.id}
                          variant={variant}
                          isSelected={field.value === variant.id}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {currentVariant?.format !== "Digital" && (
              <FormField
                name="quantity"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-2">
                      <FormLabel> Quantity:</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={1}
                          {...field}
                          min={1}
                          max={currentVariant?.stock ?? 0}
                          className="w-24"
                          disabled={isPending}
                        />
                      </FormControl>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {mode === "dialog" && (
            <DialogFooter className="pt-4">
              <AddToCartButton />
            </DialogFooter>
          )}
          {mode === "page" && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <AddToCartButton className="col-span-1 lg:col-span-2" />
              <Button className="col-span-1">Read Sample</Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default AddToCartForm;
