import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import {createWorkspaceSchema} from "@/feat/workspaces/schemas";
import {sessionMiddleware} from "@/lib/session-middleware";
import {DATABASES_ID, WORKSPACES_ID} from "@/config";
import {ID} from "node-appwrite";

const app = new Hono()
    .post("/",
        zValidator("json", createWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");
            const {name} = c.req.valid("json")
            const workspace = await databases.createDocument(
                DATABASES_ID,
                WORKSPACES_ID,
                ID.unique(),
                {
                    name:name,
                    userId: user.$id,

                }
            )
            return c.json({data:workspace});
        }
    )

export default app;