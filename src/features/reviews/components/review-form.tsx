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
  Divide,
  Loader2Icon,
} from "lucide-react";
import Toast from "~/components/toast";
import { ModeType } from "~/types/component";

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
          <Toast
            title="Review submitted."
            message={`Your review for the book: ${response.title} has been submitted successfully`}
            mode={ModeType.SUCCESS}
            footer={
              <Button>
                Go To Review <ArrowRightIcon />
              </Button>
            }
          />
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
