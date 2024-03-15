"use client"; // parent component it's client too

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { FileTextIcon, GanttChartIcon, ImageIcon,  TextIcon } from "lucide-react"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ReactNode } from "react"
import Image from "next/image"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import FileCardActions from "./file-actions";


export function getFileUrl(fileId: Id<"_storage">  /* Doc<"files">["_id"] */): string {
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}

export function isFavorited(allFavorites: Doc<"favorites">[], fileId: Id<"files">) {
    return allFavorites.some(favorite => favorite.fileId === fileId)
}

type FileCardProps = {
    file: Doc<"files"> /* & { isFavorited: boolean } */,
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

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center w-full">
                <CardTitle className="flex justify-start items-center gap-2 text-base font-normal truncate text-ellipsis overflow-hidden ">{typeIcons[file.type]}{file.name/* .slice(0, 18) */}{/* {file.name.length > 18 && "..."} */}</CardTitle>
                <FileCardActions
                    fileId={file._id}
                    fileIdStorage={file.fileId}
                    isFavorited={isFavorited(allFavorites, file._id)}
                    forDeleted={file.forDeleted}
                    userId={file.userId}
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

