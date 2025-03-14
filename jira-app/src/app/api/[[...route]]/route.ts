
import {Hono} from "hono";
import {handle} from "hono/vercel";
import auth from "@/feat/auth/server/route";
import workspaces from "@/feat/workspaces/server/route";

const app=new Hono().basePath("/api");
const routes=app
    .route('/auth',auth)
    .route('/workspaces',workspaces)

export const GET=handle(app);
export const POST=handle(app);
export const PATCH=handle(app);
export const DELETE=handle(app);
export type AppType = typeof routes;