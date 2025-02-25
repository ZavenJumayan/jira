import {Hono} from "hono";
import {zValidator} from '@hono/zod-validator'
import {loginSchema, registerSchema} from "../schemas";
import {CreateAdminClient} from "@/lib/appwrite";
import {ID} from "node-appwrite"
import {AUTH_COOKIE} from "@/feat/auth/constant";
import {deleteCookie, setCookie} from "hono/cookie";

const app = new Hono()
    .post("/login",
        zValidator("json", loginSchema),
        async (c) => {
            const {email, password} = c.req.valid("json")
            const {Account} = await CreateAdminClient();
            const session = await Account.createEmailPasswordSession(
                email,
                password,
            );
            setCookie((c), AUTH_COOKIE, session.secret, {
                path: '/',
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 60,
                sameSite: "strict"
            })
            return c.json({success: true})
        })
    .post("/register",
        zValidator("json", registerSchema),
        async (c) => {
            const {name, email, password} = c.req.valid("json")
            const {Account} = await CreateAdminClient();
             await Account.create(
                ID.unique(),
                email,
                password,
                name
            );
            const session = await Account.createEmailPasswordSession(
                email,
                password,
            );
            setCookie((c), AUTH_COOKIE, session.secret, {
                path: '/',
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 60,
                sameSite: "strict"
            })
            return c.json({success: true})
        })
    .post("/logout",(c)=>{
        deleteCookie(c,AUTH_COOKIE);
        return c.json({success: true})
        }
        )

export default app;