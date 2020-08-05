import { Application } from "oak";
import router from "./router.ts";
import { loggingMiddleware } from "./middlewares/loggingMiddleware.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import "https://deno.land/x/dotenv@v0.5.0/load.ts";

const app = new Application();

app.use(errorHandler);
app.use(loggingMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on ${secure ? "https://" : "http://"}${hostname ||
      "localhost"}:${port}`,
  );
});

app.addEventListener("error", (evt) => {
  console.log(evt.error);
});

await app.listen({ port: 8000 });
