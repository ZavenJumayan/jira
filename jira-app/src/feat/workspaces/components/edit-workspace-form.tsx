"use client";

import {updateWorkspaceSchema} from "@/feat/workspaces/schemas";
import {z} from "zod";
import {useRef} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel
} from "@/components/ui/form";
import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {DottedSeparator} from "@/components/dotted-separator";

import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {ImageIcon, ArrowLeftIcon,CopyIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Workspace} from "@/feat/workspaces/types";
import {useUpdateWorkspace} from "@/feat/workspaces/api/use-update-workspace";
import {useConfirm} from "@/hooks/use-confirm";
import {useDeleteWorkspace} from "@/feat/workspaces/api/use-delete-workspace";
import {toast} from "sonner";
import {useResetInviteCode} from "@/feat/workspaces/api/use-reset-invite-code";

interface EditWorkspaceFormProps {
    onCancel?: () => void;
    initialValues: Workspace;
}

export const EditWorkspaceForm = ({onCancel, initialValues}: EditWorkspaceFormProps) => {
    const router = useRouter();
    const {mutate, isPending} = useUpdateWorkspace();
    const {
        mutate:deleteworkspace,
        isPending:isdeleting
    }=useDeleteWorkspace();
    const {
        mutate:resetInviteCode,
        isPending:isResettingInviteCode
    }=useResetInviteCode();

    const [DeleteDialog,confirmDelete] = useConfirm(
        "Delete Workspace",
        "This action cannot be undone",
        "destructive"
    );
    const [ResetDialog,confirmReset] = useConfirm(
        "Reset invite link",
        "This will invalidate the current link",
        "destructive"
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? ""
        }
    });
const handleDelete = async () => {
const ok= await confirmDelete();
if (!ok) return;
deleteworkspace({
    param:{workspaceId:initialValues.$id}
},
    {
        onSuccess:()=>{
         window.location.href="/";
        }
    })
}
    const handleResetInviteCode = async () => {
        const ok= await confirmReset();
        if (!ok) return;
        resetInviteCode({
                param:{workspaceId:initialValues.$id}
            },
            {
                onSuccess:()=>{
                router.refresh()
                }
            })
    }
    const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : "",
        }
        mutate({
                form: finalValues,
                param: {workspaceId: initialValues.$id}

            },
            {
                onSuccess: ({data}) => {
                    form.reset();
                    router.push(`/workspaces/${data.$id}`);
                }
            }
        );
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file);
        }
    }
    const fullInviteLink=`${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;
    const handleCopyInviteLink= ()=>{
         navigator.clipboard.writeText(fullInviteLink)
        .then(()=>toast.success("Copied to clipboard"))

    }
    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDialog/>
            <ResetDialog/>
        <Card className="w-full h-full border border-none shadow-none">
            <CardHeader className="flex flex-row  items-center gap-x-4 p-7 spacy-y-0">
                <Button variant="secondary" size="sm"
                        onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}>
                    <ArrowLeftIcon/>
                    Back
                </Button>
                <CardTitle className="text-xl font-bold">
                    {initialValues.name}
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator/>
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Workspace Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="enter workspace name"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="image" render={({field}) => (
                                <div className="flex flex-col gap-y-2">
                                    <div className="flex items-center gap-x-5">
                                        {field.value ? (
                                            <div className="size-[72px] relative rounded-md overflow-hidden">
                                                <Image
                                                    src={
                                                        field.value instanceof File ?
                                                            URL.createObjectURL(field.value) :
                                                            field.value
                                                    }
                                                    alt="Logo"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <Avatar className="size-[72px]">
                                                <AvatarFallback>
                                                    <ImageIcon className="size-[36px] text-neutral-400"/>
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="flex flex-col">
                                            <p className="text-sm">Workspace Icon</p>
                                            <p className="text-sm text-muted-foreground">SVG,JPEG,JPG or PNG, max
                                                1mb</p>
                                            <Input
                                                className="hidden"
                                                type="file"
                                                accept=".jpg, .png, .jpeg, .svg"
                                                ref={inputRef}
                                                onChange={handleImageChange}
                                                disabled={isPending}
                                            />
                                            {field.value ? (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={isPending}
                                                    className="w-fit mt-2"
                                                    onClick={() => {
                                                        field.onChange(null);
                                                        if (inputRef.current) {
                                                            inputRef.current.value = "";
                                                        }
                                                    }}
                                                >
                                                    Remove Image
                                                </Button>
                                            ) : <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={isPending}
                                                className="w-fit mt-2"
                                                onClick={() => inputRef.current?.click()}
                                            >
                                                Upload Image
                                            </Button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}/>
                        </div>
                        <DottedSeparator className="py-7"/>
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                variant="secondary"
                                size="lg"
                                onClick={onCancel}
                                disabled={isPending}
                                className={cn(!onCancel && "invisible")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                disabled={isPending}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
            <Card className="w-full h-full  border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col ">
                        <h3 className="text-xl font-bold">
                            Invite Members
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Use the invite link to add members to your workspace
                        </p>
                        <div className="mt-4">
                            <div className="flex items-center gap-x-2">
                                <Input disabled value={fullInviteLink} />
                                <Button onClick={handleCopyInviteLink}
                                variant="secondary"
                                    className="size-12"
                                >
                                <CopyIcon className="size-5"/>
                                </Button>
                            </div>
                        </div>
                        <DottedSeparator className="py-7"/>
                        <Button className="mt-6 w-fit ml-auto"
                                size="sm"
                                variant="destructive"
                                type="button"
                                disabled={isPending|| isResettingInviteCode}
                                onClick={handleResetInviteCode}
                        >
                            Reset Invite Link
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full h-full  border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col ">
                        <h3 className="text-xl font-bold">
                            Danger Zone
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Deleting a workspace is irretrievable and will remove all associated files
                        </p>
                        <DottedSeparator className="py-7"/>
                        <Button className="mt-6 w-fit ml-auto"
                        size="sm"
                                variant="destructive"
                                type="button"
                                disabled={isPending|| isdeleting}
                                onClick={handleDelete}
                        >
                            Delete Workspace
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};
