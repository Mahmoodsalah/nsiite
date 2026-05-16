import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "./app";

const appPromise = createApp().then(({ app }) => app);

module.exports = async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const app = await appPromise;
  (app as any)(req, res);
};
