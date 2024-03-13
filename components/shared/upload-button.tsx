"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

const formSchema = z.object({
    title: z.string().min(1).max(200),
    file: z
        .custom<FileList>(v => v instanceof FileList, "Required")
        .refine(files => files.length > 0, "Required"),
})

export default function UploadButton() {
    const { isLoaded: orgLoaded, organization } = useOrganization()
    const { isLoaded: userLoaded, user } = useUser()
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    let orgId: string | undefined = (orgLoaded && userLoaded) ? organization?.id ?? user?.id : undefined

    const createFile = useMutation(api.files.createFile)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: undefined,
        },
    })

    const fileRef = form.register("file")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const postUrl = await generateUploadUrl();

        if (!orgId) return

        const fileType = values.file[0].type

        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": fileType },
            body: values.file[0],
        });

        const { storageId } = await result.json();

        console.log(values.file[0].type)

        const types = {
            "image/png": "image",
            "image/jpeg": "image",
            "application/pdf": 'pdf',
            "text/csv": "csv",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
        } as Record<string, Doc<"files">["type"]>

        try {
            await createFile({
                name: values.title,
                type: types[fileType],
                fileId: storageId,
                orgId,
            })

            form.reset()

            toast("File uploaded successfully", {
                description: 'Now everyone can view your file',
                classNames: {
                    toast: "group-[.toaster]:bg-success group-[.toaster]:text-success-foreground",
                    description: "group-[.toast]:text-success-foreground",
                },
                duration: 100000,
            })
        } catch (error) {
            console.log(error)

            toast("File didn't upload successfully", {
                description: 'Something went wrong, try again please',
                classNames: {
                    toast: "group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground",
                    description: "group-[.toast]:text-destructive-foreground",
                },
                duration: 100000,
            })
        }


    }

    return (

        <Dialog onOpenChange={() => form.reset()}>
            <DialogTrigger asChild>
                <Button>Upload File</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="mb-8">Upload your file here</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="file"
                            render={() => (
                                <FormItem>
                                    <FormLabel>File</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            {...fileRef}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={form.formState.isSubmitting}
                            type="submit"
                            className="flex gap-2"
                        >
                            {
                                form.formState.isSubmitting
                                    ? <Loader2 className="animate-spin" />
                                    : 'Submit'
                            }
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
