"use client"; // parent component it's client too

import { Id } from "@/convex/_generated/dataModel"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArchiveRestoreIcon, DownloadIcon, EllipsisVertical, StarIcon, Trash2Icon } from "lucide-react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Protect } from "@clerk/nextjs";
import { getFileUrl } from "./file-card";


export default function FileCardActions({ fileId, fileIdStorage, isFavorited, forDeleted }: {
    fileId: Id<"files">,
    fileIdStorage: Id<"_storage">,
    isFavorited: boolean;
    forDeleted?: boolean
}) {
    const deleteFile = useMutation(api.files.deleteFile)
    const deleteFilePermanently = useMutation(api.files.deleteFilePermanently)
    const restoreFile = useMutation(api.files.restoreFile)
    const toogleFavorite = useMutation(api.files.toogleFavorite)

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>File Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem
                        onClick={() => {
                            // open new tab to the file location on convex
                            window.open(getFileUrl(fileIdStorage), "_blank")
                        }}
                        className="flex gap-1 cursor-pointer"
                    >
                        <DownloadIcon className="w-4 h-4" />Download
                    </DropdownMenuItem>
                    
                    <Protect
                        role="org:admin"
                        fallback={<></>}
                    >
                        {forDeleted ?
                            <>
                                <DropdownMenuItem
                                    onClick={async () => {
                                        await restoreFile({ fileId })
                                        toast("File restored", {
                                            description: "Your file won't be deleted anymore.",
                                            duration: 100000,
                                        })
                                    }}
                                    className="flex gap-1 cursor-pointer">
                                    <ArchiveRestoreIcon className="w-4 h-4" />Restore
                                </DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="flex gap-1 text-destructive bg-destructive-foreground cursor-pointer">
                                        <Trash2Icon className="w-4 h-4" />Delete forever
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </>
                            : <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="flex gap-1 text-destructive bg-destructive-foreground cursor-pointer">
                                    <Trash2Icon className="w-4 h-4" />Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        }
                        <DropdownMenuSeparator />
                    </Protect>

                    

                    {forDeleted ?
                        null
                        : <DropdownMenuItem
                            onClick={() => {
                                toogleFavorite({ fileId })
                            }}
                            className="flex gap-1 cursor-pointer"
                        >
                            <StarIcon className={`w-4 h-4 ${isFavorited ? "fill-primary" : ""}`} />{isFavorited ? "Remove Favorite" : "Set Favorite"}
                        </DropdownMenuItem>
                    }

                </DropdownMenuContent>
            </DropdownMenu>
            <Protect
                role="org:admin"
                fallback={<></>}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will marked the file for deletion, files are perioodically.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {
                            forDeleted ?
                                <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground"
                                    onClick={async () => {
                                        await deleteFilePermanently({ fileId, fileIdStorage })
                                        toast("File deleted", {
                                            description: 'File deleted forever from our server',
                                            // classNames: {
                                            //     toast: "group-[.toaster]:bg-foreground group-[.toaster]:text-secondary-foreground",
                                            //     description: "group-[.toast]:text-foreground",
                                            // },
                                            duration: 100000,
                                        })
                                    }}
                                >
                                    Delete
                                </AlertDialogAction>
                                :
                                <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground"
                                    onClick={async () => {
                                        await deleteFile({ fileId })
                                        toast("File deleted", {
                                            description: 'File marked for deletion, your file will be deleted soon.',
                                            // classNames: {
                                            //     toast: "group-[.toaster]:bg-foreground group-[.toaster]:text-secondary-foreground",
                                            //     description: "group-[.toast]:text-foreground",
                                            // },
                                            duration: 100000,
                                        })
                                    }}
                                >
                                    Delete
                                </AlertDialogAction>
                        }
                    </AlertDialogFooter>
                </AlertDialogContent>
            </Protect>
        </AlertDialog>
    )
}