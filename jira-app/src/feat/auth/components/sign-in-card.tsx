"use client"
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/feat/auth/schemas";
import { useLogin } from "@/feat/auth/api/use-login";

export function SignInCard() {
    const { mutate,isPending } = useLogin();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        mutate({json:values});
    };


    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle>Welcome back!</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                    By signing up you agree to our{" "}
                    <Link href="/privacy">
                        <span className="text-blue-800">Privacy policy</span>
                    </Link>{" "}
                    and
                    <br />
                    <Link href="/terms">
                        <span className="text-blue-800">Terms of service</span>
                    </Link>
                </CardDescription>
            </CardHeader>

            <div className="px-7">
                <DottedSeparator />
            </div>

            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="Enter email address"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Enter password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={isPending}
                            type="submit"
                            variant="primary"
                            className="flex items-center justify-center w-full"
                        >
                            Login
                        </Button>
                    </form>
                </Form>
            </CardContent>

            <div className="px-7">
                <DottedSeparator />
            </div>

            <CardContent className="p-7">
                <Button disabled={isPending} variant="secondary" size="lg" className="w-full">
                    <FcGoogle className="mr-2 h-5 w-5" />
                    Login with Google
                </Button>
            </CardContent>

            <div className="px-7">
                <DottedSeparator />
            </div>

            <CardContent className="p-7">
                <Button disabled={isPending} variant="secondary" size="lg" className="w-full">
                    <FaGithub className="mr-2 h-5 w-5" />
                    Login with Github
                </Button>
            </CardContent>

            <div className="px-7">
                <DottedSeparator />
            </div>

            <CardContent className="p-7 flex items-center justify-center">
                <p>Don&apos; t have an account</p>
                <Link href="/sign-up">
                    <span className="text-blue-700">&nbsp;Sign Up</span>
                </Link>
            </CardContent>
        </Card>
    );
}
