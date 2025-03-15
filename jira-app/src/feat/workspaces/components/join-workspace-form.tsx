"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader
} from "@/components/ui/card";
import {DottedSeparator} from "@/components/dotted-separator";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useJoinWorkspace} from "@/feat/workspaces/api/use-join-workspace";
import {useInviteCode} from "@/feat/workspaces/hooks/use-invite-code";
import {useWorkspaceId} from "@/feat/workspaces/hooks/use-workspace-id";
import {useRouter} from "next/navigation";

interface JoinWorkspaceFromProps {
    initialValues: {
        name: string;
    };
}

export const JoinWorkspaceFrom = ({initialValues}: JoinWorkspaceFromProps) => {
    const workspaceId = useWorkspaceId();
    const inviteCode = useInviteCode();
    const router = useRouter();
    const {mutate,isPending} = useJoinWorkspace();

    const onSubmit = () => {

        mutate(
            {
                param: { workspaceId },
                json: { code: inviteCode }
            },
            {
                onSuccess: ({ data }) => {
                    router.push(`/workspaces/${data.$id}`);
                }
            }
        );
    };

    return (
        <Card className="w-full h-full border shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">
                    Join Workspace
                </CardTitle>
                <CardDescription className="text-xl">
                    You&apos;ve been invited to join <strong>{initialValues.name}</strong> workspace!
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="px-7">
                <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
                    <Button className="w-full lg:w-fit"
                            variant="secondary"
                            type="button"
                            asChild
                            size="lg"
                            disabled={isPending}
                    >
                        <Link href="/">Cancel</Link>
                    </Button>
                    <Button className="w-full lg:w-fit"
                            size="lg"
                            variant="primary"
                            type="button"
                            disabled={isPending}
                            onClick={onSubmit}
                    >
                        Join Workspace
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
