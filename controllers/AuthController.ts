import {
  RouterContext,
  Status,
} from "oak";

import {
  makeJwt,
  setExpiration,
  Jose,
  Payload,
  Algorithm,
} from "djwt/create.ts";

import { hashSync, compareSync } from "bcrypt";
import User from "../models/User.ts";
import { createHttpError } from "../httpError.ts";

const header: Jose = {
  alg: Deno.env.get("JWT_ALG")! as Algorithm,
  typ: "JWT",
};

class AuthController {
  async login(ctx: RouterContext) {
    const { email, password } = await ctx.request.body().value;

    validateEmailAndPassword(email, password);

    let user = await User.findOne({ email });
    if (
      !user ||
      !compareSync(password, user.password)
    ) {
      throw createHttpError("Invalid login", Status.Unauthorized);
    }

    const payload: Payload = {
      iss: user.email,
      exp: setExpiration(new Date().getTime() + 60 * 60 * 1000),
    };

    const jwt = await makeJwt(
      { key: Deno.env.get("JWT_SECRET_KEY")!, header, payload },
    );

    ctx.response.body = {
      id: user.id,
      name: user.name,
      email: user.email,
      jwt,
    };
  }

  async register(ctx: RouterContext) {
    const { name, email, password } = await ctx.request.body().value;

    let user = await User.findOne({ email });

    if (user) {
      throw createHttpError("Email is already used", Status.BadRequest);
    }

    const hashedPasword = hashSync(password);
    user = new User({ name, email, password: hashedPasword });
    await user.save();

    ctx.response.status = Status.Created;

    ctx.response.body = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

function validateEmailAndPassword(email: string, password: string) {
  if (!email || !password) {
    throw createHttpError(
      "Please provide email and password.",
      Status.BadRequest,
    );
  }
}

const authController = new AuthController();

export default authController;
