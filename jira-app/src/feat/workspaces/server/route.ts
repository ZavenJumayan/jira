import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema } from "@/feat/workspaces/schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASES_ID, WORKSPACES_ID, IMAGES_BUCKET_ID } from "@/config";
import { ID } from "node-appwrite";
import { Buffer } from "buffer";  // ✔ Import Buffer if needed

const app = new Hono()
    .post("/",
        zValidator("form", createWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const storage = c.get("storage");
            const user = c.get("user");
            const { name, image } = c.req.valid("form");
            let uploadImageUrl: string | undefined;

            if (image instanceof File) {
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image
                );
                const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    file.$id
                );
                uploadImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
            }

            const workspace = await databases.createDocument(
                DATABASES_ID,
                WORKSPACES_ID,
                ID.unique(),
                {
                    name: name,
                    userId: user.$id,
                    imageUrl: uploadImageUrl,  // ✔ Save the image URL if available
                }
            );

            return c.json({ data: workspace });
        }
    );

export default app;
