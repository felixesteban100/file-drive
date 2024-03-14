"use client"; // parent component it's client too

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc, Id } from "@/convex/_generated/dataModel"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArchiveRestoreIcon, DownloadIcon, EllipsisVertical, FileTextIcon, GanttChartIcon, ImageIcon, StarIcon, TextIcon, Trash2Icon } from "lucide-react"

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
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { ReactNode } from "react"
import Image from "next/image"
import { Protect } from "@clerk/nextjs";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"


function getFileUrl(fileId: Id<"_storage">  /* Doc<"files">["_id"] */): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}

type FileCardProps = {
    file: Doc<"files">,
    allFavorites: Doc<"favorites">[],
}

export default function FileCard({ file, allFavorites }: FileCardProps) {
    const typeIcons = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
        'docx': <TextIcon />,
    } as Record<Doc<"files">["type"], ReactNode>

    const userProfile = useQuery(api.users.getUserProfile, file.userId ? { userId: file.userId } : "skip")

    function isFavorited(fileId: Id<"files">) {
        return allFavorites.some(favorite => favorite.fileId === fileId)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center w-full">
                <CardTitle className="flex justify-start items-center gap-2 text-base font-normal truncate text-ellipsis overflow-hidden ">{typeIcons[file.type]}{file.name/* .slice(0, 18) */}{/* {file.name.length > 18 && "..."} */}</CardTitle>
                <FileCardActions
                    fileId={file._id}
                    fileIdStorage={file.fileId}
                    isFavorited={isFavorited(file._id)}
                    forDeleted={file.forDeleted}
                />
            </CardHeader>
            <CardContent className="h-[200px] flex justify-center items-center">
                {file.type === "image" &&
                    <Image
                        src={getFileUrl(file.fileId)}
                        width="200"
                        height="100"
                        alt={file.name}
                        className="h-[200px] w-full object-cover"
                    />
                }

                {file.type === "csv" &&
                    <GanttChartIcon className="w-20 h-20" />
                }
                {file.type === "pdf" &&
                    <FileTextIcon className="w-20 h-20" />
                }
                {file.type === "docx" &&
                    <TextIcon className="w-20 h-20" />
                }
            </CardContent>
            <CardFooter className="flex justify-between items-center gap-2 text-xs">
                <div className="flex justify-start items-center gap-2 text-xs">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={userProfile?.image} alt={userProfile?.name} />
                        <AvatarFallback>FM</AvatarFallback>
                    </Avatar>
                    {userProfile?.name}
                </div>
                -
                <p className="text-primary/90">
                    Uploaded on: {new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                    }).format(file._creationTime)}
                </p>
            </CardFooter>
        </Card>
    )
}

function FileCardActions({ fileId, fileIdStorage, isFavorited, forDeleted }: {
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