import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import {createProjectSchema} from "@/feat/workspaces/schemas";
import {sessionMiddleware} from "@/lib/session-middleware";
import {DATABASES_ID, WORKSPACES_ID, IMAGES_BUCKET_ID, MEMBERS_ID, TASKS_ID} from "@/config";
import {ID, Query} from "node-appwrite";
import {Buffer} from "buffer";
import {MemberRole} from "@/feat/members/types";
import {generateInviteCode} from "@/lib/utils";
import {updateWorkspaceSchema} from "@/feat/workspaces/schemas";
import {getMember} from "@/feat/members/utils";
import {z} from "zod"
import {Workspace} from "@/feat/workspaces/types";
import {endOfMonth, startOfMonth, subMonths} from "date-fns";
import {TaskStatus} from "@/feat/tasks/types";


const app = new Hono()
    .get("/", sessionMiddleware, async (c) => {
        const user = c.get("user");
        const databases = c.get("databases");
        const members = await databases.listDocuments(
            DATABASES_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        )
        if (!members.documents.length) {
            return c.json({data: {documents: [], total: 0}})
        }
        const workspaceIds = members.documents.map((member) => member.workspaceId);
        const workspaces = await databases.listDocuments(
            DATABASES_ID,
            WORKSPACES_ID,
            [
                Query.orderDesc("$createdAt"),
                Query.contains("$id", workspaceIds),
            ]
        )
        return c.json({data: workspaces});
    })
    .get("/:workspaceId",sessionMiddleware,async (c)=>{
        const user=c.get("user");
        const databases=c.get("databases");
        const{workspaceId}= c.req.param();

        const member=await getMember({
            databases,
            workspaceId,
            userId:user.$id
        })
        if(!member){
            return c.json({error: "Unauthorized"}, 401);
        }
        const workspace=await databases.getDocument<Workspace>(
            DATABASES_ID,
            WORKSPACES_ID,
            workspaceId,
        );
        return c.json({data:workspace});
    })
    .get("/:workspaceId/info",sessionMiddleware,async (c)=>{

        const databases=c.get("databases");
        const{workspaceId}= c.req.param();

        const workspace=await databases.getDocument<Workspace>(
            DATABASES_ID,
            WORKSPACES_ID,
            workspaceId,
        );
        return c.json({data:{$id:workspace.$id,name:workspace.name,imageUrl:workspace.imageUrl}});
    })
    .post("/",
        zValidator("form", createProjectSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const storage = c.get("storage");
            const user = c.get("user");
            const {name, image} = c.req.valid("form");
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
                    role: MemberRole.ADMIN,
                }
            )
            return c.json({data: workspace});
        })
    .patch(
        "/:workspaceId",
        sessionMiddleware,
        zValidator("form", updateWorkspaceSchema),
        async (c) => {
            const databases = c.get("databases");
            const storage = c.get("storage");
            const user = c.get("user")

            const {workspaceId} = c.req.param() as { workspaceId: string };
            const {name, image} = c.req.valid("form")
            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            })
            if (!member || member.role !== MemberRole.ADMIN) {
                return c.json({error: "Unauthorized"}, 401);
            }
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
                uploadImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
            } else {
                uploadImageUrl = image;
            }
            const workspace = await databases.updateDocument(
                DATABASES_ID,
                WORKSPACES_ID,
                workspaceId,
                {
                    name,
                    imageUrl: uploadImageUrl,

                }
            )
            return c.json({data: workspace});

        }
    )
    .delete("/:workspaceId", sessionMiddleware,async (c) => {
        const databases = c.get("databases");
        const user = c.get("user");
        const {workspaceId} = c.req.param();
        const member = await getMember(
            {
                databases,
                workspaceId,
                userId: user.$id
            }
        )
        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({error: "Unauthorized"},401)
        }
        await databases.deleteDocument(
            DATABASES_ID,
            WORKSPACES_ID,
            workspaceId,
        );
        return c.json({data: {$id: workspaceId}});
    })
    .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
        const databases = c.get("databases");
        const user = c.get("user");
        const {workspaceId} = c.req.param();
        const member = await getMember(
            {
                databases,
                workspaceId,
                userId: user.$id
            }
        )
        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({error: "Unauthorized"},401)
        }
        const workspace = await databases.updateDocument(
            DATABASES_ID,
            WORKSPACES_ID,
            workspaceId,
            {
                inviteCode: generateInviteCode(9),
            },
        )
        return c.json({data:workspace})
    })
    .post("/:workspaceId/join", sessionMiddleware, zValidator("json", z.object({
            code: z.string()
        })),
        async (c) => {
            const {workspaceId} = c.req.param();
            const {code} = c.req.valid("json")

            const databases = c.get("databases");
            const user = c.get("user");

            const member=await getMember({
                databases,
                workspaceId,
                userId:user.$id
            });
            if(member){
                return c.json({error:"Already a member"},400)
            }
            const workspace=await databases.getDocument<Workspace>(
                DATABASES_ID,
                WORKSPACES_ID,
                workspaceId,
            );

            if(workspace.inviteCode==code){
                return c.json({error:"Invalid invite code"},400)
            }
            await databases.createDocument(
                DATABASES_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    workspaceId,
                    userId:user.$id,
                    role:MemberRole.MEMBER,
                }
            )
            return c.json({data:workspace})
        }
    )
    .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
        const databases = c.get("databases");
        const user = c.get("user");
        const {workspaceId} = c.req.param();


        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id
        })

        if (!member) {
            return c.json({error: "Unauthorized"}, 401)
        }
        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));

        const thisMonthTasks = await databases.listDocuments(
            DATABASES_ID,
            TASKS_ID,
            [
               Query.equal("workspaceId", workspaceId),
                Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
            ]
        )
        const lastMonthTasks = await databases.listDocuments(
            DATABASES_ID,
            TASKS_ID,
            [
               Query.equal("workspaceId", workspaceId),
                Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
            ]
        );


        const taskCount = thisMonthTasks.total;
        const taskDifference = taskCount - lastMonthTasks.total;
        const thisMonthAssignedTasks = await databases.listDocuments(
            DATABASES_ID,
            TASKS_ID,
            [
           Query.equal("workspaceId", workspaceId),
                Query.equal("assigneeId", member.$id),
                Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
            ]
        );
        const lastMonthAssignedTasks = await databases.listDocuments(
            DATABASES_ID,
            TASKS_ID,
            [
           Query.equal("workspaceId", workspaceId),
                Query.equal("assigneeId", member.$id),
                Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
            ]
        );


        const assignedTaskCount = thisMonthAssignedTasks.total;
        const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.total;
        const thisMonthIncompleteTasks = await databases.listDocuments(
            DATABASES_ID,
            TASKS_ID,
            [
     Query.equal("workspaceId", workspaceId),
                Query.notEqual("status", TaskStatus.DONE),
                Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
            ]
        );
        const lastMonthIncompleteTasks = await databases.listDocuments(
            DATABASES_ID,
            TASKS_ID,
            [
           Query.equal("workspaceId", workspaceId),
                Query.notEqual("status", TaskStatus.DONE),
                Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
            ]
        );
        const incompleteTasksCount = thisMonthIncompleteTasks.total;
        const incompleteTaskDifference = incompleteTasksCount - lastMonthIncompleteTasks.total;

        const thisMonthCompletedTasks = await databases.listDocuments(
            DATABASES_ID,
            TASKS_ID,
            [
           Query.equal("workspaceId", workspaceId),
                Query.equal("status", TaskStatus.DONE),
                Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
            ]
        );
        const lastMonthCompletedTasks = await databases.listDocuments(
            DATABASES_ID,
            TASKS_ID,
            [
           Query.equal("workspaceId", workspaceId),
                Query.notEqual("status", TaskStatus.DONE),
                Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
            ]
        );
        const completedTasksCount = thisMonthCompletedTasks.total;
        const completedTaskDifference = completedTasksCount - lastMonthCompletedTasks.total;

        const thisMonthOverdueTasks = await databases.listDocuments(
            DATABASES_ID,
            TASKS_ID,
            [
           Query.equal("workspaceId", workspaceId),
                Query.notEqual("status", TaskStatus.DONE),
                Query.lessThan("dueDate", now.toISOString()),
                Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
            ]
        );
        const lastMonthOverdueTasks = await databases.listDocuments(
            DATABASES_ID,
            TASKS_ID,
            [
           Query.equal("workspaceId", workspaceId),
                Query.notEqual("status", TaskStatus.DONE),
                Query.lessThan("dueDate", now.toISOString()),
                Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
                Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
            ]
        );
        const overdueTasksCount = thisMonthOverdueTasks.total;
        const overdueTaskDifference = overdueTasksCount - lastMonthOverdueTasks.total;
        return c.json({data:{
                taskCount,
                taskDifference,
                assignedTaskCount,
                assignedTaskDifference,
                incompleteTasksCount,
                incompleteTaskDifference,
                completedTasksCount,
                completedTaskDifference,
                overdueTasksCount,
                overdueTaskDifference,
            }})

    })


export default app;