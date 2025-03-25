"use client";


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
import {ImageIcon, ArrowLeftIcon,} from "lucide-react";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";


import {useConfirm} from "@/hooks/use-confirm";

import {updateProjectSchema} from "@/feat/projects/shemas";
import {Project} from "@/feat/projects/types";
import {useUpdateProject} from "@/feat/projects/api/use-update-project";
import {useDeleteProject} from "@/feat/projects/api/use-delete-project";

interface EditProjectFormProps {
    onCancel?: () => void;
    initialValues: Project;
}

export const EditProjectForm = ({onCancel, initialValues}: EditProjectFormProps) => {
    const router = useRouter();
    const {mutate, isPending} = useUpdateProject();
    const {
        mutate: deleteProject,
        isPending: isDeletingProject,
    } = useDeleteProject();

    const [DeleteDialog, confirmDelete] = useConfirm(
        "Delete Workspace",
        "This action cannot be undone",
        "destructive"
    );

    const inputRef = useRef<HTMLInputElement>(null);
    const form = useForm<z.infer<typeof updateProjectSchema>>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? ""
        }
    });
    const handleDelete = async () => {
        const ok = await confirmDelete();
        if (!ok) return;
        deleteProject({
                param: {projectId: initialValues.$id}
            },
            {
                onSuccess: () => {
                    router.push(`/workspaces/${initialValues.workspaceId}`)
                }
            })
     }

        const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
            const finalValues = {
                ...values,
                image: values.image instanceof File ? values.image : "",
            }
            mutate({
                    form: finalValues,
                    param: {projectId: initialValues.$id}

                },
                {
                    onSuccess: () => {
                        form.reset();
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
        return (
            <div className="flex flex-col gap-y-4">
                <DeleteDialog/>
                <Card className="w-full h-full border border-none shadow-none">
                    <CardHeader className="flex flex-row  items-center gap-x-4 p-7 spacy-y-0">
                        <Button variant="secondary" size="sm"
                                onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)}>
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
                                                Project Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter Project name"/>
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
                                                    <p className="text-sm">Project Icon</p>
                                                    <p className="text-sm text-muted-foreground">SVG,JPEG,JPG or PNG,
                                                        max
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
                                Danger Zone
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Deleting a project is irretrievable and will remove all associated files
                            </p>
                            <DottedSeparator className="py-7"/>
                            <Button className="mt-6 w-fit ml-auto"
                                    size="sm"
                                    variant="destructive"
                                    type="button"
                                    disabled={isPending}
                                    onClick={handleDelete}
                            >
                                Delete Project
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        );
};
