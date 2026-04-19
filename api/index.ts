import { createApp } from "../server/app";
import type { IncomingMessage, ServerResponse } from "http";

const appPromise = createApp().then(({ app }) => app);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await appPromise;
  return (app as any)(req, res);
}
