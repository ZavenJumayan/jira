"use client";

import {createProjectSchema} from "@/feat/projects/shemas";
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
import {ImageIcon} from "lucide-react";

import {cn} from "@/lib/utils";
import {useCreateProject} from "@/feat/projects/api/use-create-project";
import {useWorkspaceId} from "@/feat/workspaces/hooks/use-workspace-id";
import {useRouter} from "next/navigation";



interface CreateProjectFormProps {
    onCancel?: () => void;
}

export const CreateProjectForm = ({onCancel}: CreateProjectFormProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const {mutate, isPending} = useCreateProject();
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof createProjectSchema>>({
        // @ts-expect-error type error connected with type miss-connecting
        resolver: zodResolver(createProjectSchema.omit({workspaceId: true})),
        defaultValues: {
            name: "",
        }
    });

    const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
        const finalValues = {
            ...values,
            workspaceId,
            image: values.image instanceof File ? values.image : "",
        }
        mutate({form: finalValues},
            {
                onSuccess: ({data}) => {
                    form.reset();
                   router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
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
        <Card className="">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a new project
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
                                        <Input {...field} placeholder="Enter project name"/>
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
                                            <p className="text-sm text-muted-foreground">SVG,JPEG,JPG or PNG, max
                                                50mb</p>
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
                                Create Project
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
