import { assertEquals } from "testing/asserts.ts";
import { errorHandler } from "./errorHandler.ts";
import { Context, Status, HttpError } from "oak";

Deno.test({
  name: "No error",
  fn: async () => {
    const ctx = new ContextMock() as Context;
    await errorHandler(ctx, () => {});
    assertEquals(ctx.response.body, undefined);
    assertEquals(ctx.response.status, undefined);
  },
});

Deno.test({
  name: "Http error",
  fn: async () => {
    const ctx = new ContextMock() as Context;
    const err = new HttpError("error message");
    err.status = Status.BadRequest;
    await errorHandler(ctx, createErrorNextFunction(err));
    assertEquals(ctx.response.body, { message: "error message" });
    assertEquals(ctx.response.status, Status.BadRequest);
  },
});

Deno.test({
  name: "Generic error",
  fn: async () => {
    const ctx = new ContextMock() as Context;
    const err = new Error("error message");
    await errorHandler(ctx, createErrorNextFunction(err));
    assertEquals(ctx.response.body, undefined);
    assertEquals(ctx.response.status, Status.InternalServerError);
  },
});

const createErrorNextFunction = (err: Error) => {
  return () => {
    if (err) throw err;
  };
};

class ContextMock {
  response = {
    body: undefined,
    status: undefined,
  } as unknown;
}
