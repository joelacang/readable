import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { categoryRouter } from "./routers/category";
import { authorRouter } from "./routers/author";
import { seriesRouter } from "./routers/series";
import { collectionRouter } from "./routers/collection";
import { tagRouter } from "./routers/tag";
import { bookRouter } from "./routers/book";
import { imageRouter } from "./routers/image";
import { cartRouter } from "./routers/cart";
import { wishlistRouter } from "./routers/wishlist";
import { checkoutRouter } from "./routers/checkout";
import { orderRouter } from "./routers/order";
import { reviewRouter } from "./routers/review";
import { contactRouter } from "./routers/contact";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  author: authorRouter,
  category: categoryRouter,
  series: seriesRouter,
  collection: collectionRouter,
  tag: tagRouter,
  book: bookRouter,
  image: imageRouter,
  cart: cartRouter,
  wishlist: wishlistRouter,
  checkout: checkoutRouter,
  order: orderRouter,
  review: reviewRouter,
  contact: contactRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
