

import {createSessionClient} from "@/lib/appwrite";

export const getCurrent = async () => {
    try {
       const {Account} = await createSessionClient();
       return await Account.get();
    } catch {
        return null
    }
}