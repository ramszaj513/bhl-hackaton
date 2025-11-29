import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { wasteRouter } from "./router/waste";
import { recognitionRouter } from "./router/recognition";
import { pszokRouter } from "./router/pszok";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  waste: wasteRouter,
  recognition: recognitionRouter,
  pszok: pszokRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
