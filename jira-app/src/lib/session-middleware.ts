import "server-only";
import {
    Account,
    Client,
    Databases,
    Storage,
    Models,
    type Storage as StorageType,
    type Account as AccountType,
    type Databases as DatabasesType,
    type Users as UsersTypes,
} from "node-appwrite";

type AditionalContext = {
    Variables: {
        account: AccountType,
        databases: DatabasesType,
        storage: StorageType,
        users: UsersTypes,
        user: Models.User<Models.Preferences>
    }
}

import {getCookie, setCookie} from "hono/cookie";
import {createMiddleware} from "hono/factory";
import {AUTH_COOKIE} from "@/feat/auth/constant";

export const sessionMiddleware = createMiddleware<AditionalContext>(async (c, next) => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = getCookie(c, AUTH_COOKIE);

    if (!session) {
        return c.json({error: "Unauthorized"}, 401);
    }
    client.setSession(session);
    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);
    const user = await account.get()
    c.set("account", account)
    c.set("databases", databases)
    c.set("storage", storage)
    c.set("user", user)
    await next();
})
