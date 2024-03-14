"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Protect, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Loader2 } from "lucide-react";

export default function ClearTrash() {
    const { isLoaded: orgLoaded, organization } = useOrganization()
    const { isLoaded: userLoaded, user } = useUser()

    let orgId: string | undefined = (orgLoaded && userLoaded) ? organization?.id ?? user?.id : undefined
    
    const clearTrash = useMutation(api.files.clearTrash)
    const filesforDeletion = useQuery(api.files.getFiles, orgId ? { favorites: false, orgId, query: "", deleted: true } : "skip")

    if (filesforDeletion === undefined) {
        return (
            <div
                className="flex flex-col justify-center items-center gap-4"
            >
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if(filesforDeletion && filesforDeletion.length < 1) return <></>

    return (
        <Protect
            role="org:admin"
            fallback={<></>}
        >
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button
                        variant={"destructive"}
                    >
                        Clear trash
                    </Button>
                </AlertDialogTrigger>
                <Protect
                    role="org:admin"
                    fallback={<></>}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will delete all files from the recycle bin, files will be gone forever.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground"
                                onClick={async () => {
                                    await clearTrash()
                                    toast("Trash has been cleared", {
                                        description: "The trash can files are gone forever",
                                        duration: 100000,
                                    })
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </Protect>
            </AlertDialog>
        </Protect>
    )
}