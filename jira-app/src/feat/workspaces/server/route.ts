import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkspaceSchema } from "@/feat/workspaces/schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASES_ID, WORKSPACES_ID, IMAGES_BUCKET_ID ,MEMBERS_ID} from "@/config";
import { ID, Query} from "node-appwrite";
import { Buffer } from "buffer";
import {MemberRole} from "@/feat/members/types";
import {generateInviteCode} from "@/lib/utils";

const app = new Hono()
    .get("/",sessionMiddleware,async (c)=>{
        const user=c.get("user");
        const databases=c.get("databases");
        const members=await databases.listDocuments(
            DATABASES_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        )
        if(!members.documents.length){
            return c.json({data:{documents:[],total:0}})
        }
        const workspaceIds=members.documents.map((member)=>member.workspaceId);
        const workspaces=await databases.listDocuments(
            DATABASES_ID,
            WORKSPACES_ID,
            [
                Query.orderDesc("$createdAt"),
                Query.contains("$id", workspaceIds),
            ]
        )
        return c.json({data:workspaces});
    })
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
                    imageUrl: uploadImageUrl,
                    inviteCode: generateInviteCode(9),
                }
            );
             await databases.createDocument(
                 DATABASES_ID,
                 MEMBERS_ID,
                 ID.unique(),
                 {
                     userId: user.$id,
                     workspaceId: workspace.$id,
                     role:MemberRole.ADMIN,
                 }

             )
            return c.json({ data: workspace });
        }
    );

export default app;
