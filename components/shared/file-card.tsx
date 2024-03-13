"use client"; // parent component it's client too

import {
    Card,
    CardContent,
    // CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc, Id } from "@/convex/_generated/dataModel"
// import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DownloadIcon, EllipsisVertical, FileTextIcon, GanttChartIcon, ImageIcon, TextIcon, Trash2Icon } from "lucide-react"

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
import { ReactMutation, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { FunctionReference } from "convex/server"
import { toast } from "sonner"
import { ReactNode } from "react"
import Image from "next/image"

type FileCardProps = {
    file: Doc<"files">
}

function getFileUrl(fileId: Id<"_storage">  /* Doc<"files">["_id"] */): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}

export default function FileCard({ file }: FileCardProps) {
    const deleteFile = useMutation(api.files.deleteFile)

    const typeIcons = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
        'docx': <TextIcon />,
    } as Record<Doc<"files">["type"], ReactNode>

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center w-full">
                <CardTitle className="flex justify-start items-center gap-2">{typeIcons[file.type]}{file.name}</CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
                <FileCardActions
                    deleteFile={deleteFile}
                    fileId={file._id}
                    fileIdStorage={file.fileId}
                />
            </CardHeader>
            <CardContent className="h-[200px] flex justify-center items-center">
                {file.type === "image" &&
                    <Image
                        src={getFileUrl(file.fileId)}
                        width="200"
                        height="100"
                        alt={file.name}
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
            {/* <CardFooter>
                <Button>Download</Button>
            </CardFooter> */}
        </Card>
    )
}

function FileCardActions({ deleteFile, fileId, fileIdStorage }: {
    deleteFile: ReactMutation<FunctionReference<"mutation", "public", {
        fileId: Id<"files">;
    }, null>>,
    fileId: Id<"files">,
    fileIdStorage: Id<"_storage">,
}) {
    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>File Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="flex gap-1 text-destructive bg-destructive-foreground cursor-pointer">
                            <Trash2Icon className="w-4 h-4" />Delete
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <DropdownMenuItem
                        onClick={() => {
                            // oepn new tab to the file location on convex
                            window.open(getFileUrl(fileIdStorage), "_blank")
                        }}
                        className="flex gap-1 cursor-pointer"
                    >
                        <DownloadIcon className="w-4 h-4" />Download
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your file
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive text-destructive-foreground"
                        onClick={async () => {
                            await deleteFile({ fileId })
                            toast("File deleted", {
                                description: 'Your file is now gone from the system',
                                // classNames: {
                                //     toast: "group-[.toaster]:bg-foreground group-[.toaster]:text-secondary-foreground",
                                //     description: "group-[.toast]:text-foreground",
                                // },
                                duration: 100000,
                            })
                        }}
                    >Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}