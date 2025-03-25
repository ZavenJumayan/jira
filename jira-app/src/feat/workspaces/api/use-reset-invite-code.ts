import {toast} from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/rpc";
import {useRouter} from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]>;

export const useResetInviteCode = () => {
    const queryClient = useQueryClient();

    const router = useRouter();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({param}) => {
            const response = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({param});

            if (!response.ok) {
                throw new Error("Failed to reset invite code");
            }

            return response.json();
        },
        onSuccess: ({data}) => {
            toast.success("Invite code reset successfully");

            router.refresh()
            queryClient.invalidateQueries({queryKey: ["workspaces"]});
            queryClient.invalidateQueries({queryKey: ["workspace", data.$id]})

        },
        onError: () => {
            toast.error("Failed to reset invite code");
        }
    });

    return mutation;
};
