import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "~/components/ui/textarea";
import type { OrderItemType } from "~/types/order";
import { createReviewSchema } from "~/zod-schemas/review";
import { useReviewDialog } from "../hooks/use-review-dialog";
import { useState } from "react";
import { StarRating } from "~/components/star-rating";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { truncateText } from "~/utils/get-values";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CheckIcon,
  Loader2Icon,
} from "lucide-react";

interface Props {
  orderItem: OrderItemType;
}
const ReviewForm = ({ orderItem }: Props) => {
  const { onClose } = useReviewDialog();
  const { mutate: createReview, isPending } = api.review.create.useMutation();

  const form = useForm<z.infer<typeof createReviewSchema>>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      title: "",
      content: "",
      rating: 0,
      orderItemId: orderItem.id,
      bookId: orderItem.product.id ?? undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof createReviewSchema>) => {
    const creatingReviewToast = toast.loading(`Creating Review...`);

    createReview(values, {
      onSuccess: (response) => {
        toast.custom(() => (
          <div className="bg-card flex max-w-md flex-row gap-3 rounded-lg p-4">
            <div className="py-2">
              <CheckCircle2Icon className="h-8 w-8 text-green-500" />
            </div>

            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col">
                <h3 className="text-base font-semibold">Review submitted.</h3>
                <p className="text-muted-foreground text-sm">
                  Your review:&nbsp;&apos;
                  <span className="font-mono font-semibold">
                    {response.title}
                  </span>
                  &apos;&nbsp;was successfully created.
                </p>
              </div>

              <div className="flex w-full items-center justify-end">
                <Button>
                  Go To Review <ArrowRightIcon />
                </Button>
              </div>
            </div>
          </div>
        ));

        onClose();
      },
      onError: (error) => {
        toast.error(`Error creating review. ${error.message}`);
      },
      onSettled: () => {
        toast.dismiss(creatingReviewToast);
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          name="rating"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating:</FormLabel>
              <FormControl>
                <StarRating value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content:</FormLabel>
              <FormControl>
                <Textarea className="h-24" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="mr-2 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ReviewForm;
