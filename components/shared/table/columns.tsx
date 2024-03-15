"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { ColumnDef } from "@tanstack/react-table"
import { useQuery } from "convex/react"
import FileCardActions from "../file-actions"
import { isFavorited } from "../file-card"

function UserCell({ userId }: { userId: Id<"users"> }) {
    const userProfile = useQuery(api.users.getUserProfile, { userId: userId })
    return <div className="flex justify-start items-center gap-2 text-xs">
        <Avatar className="w-8 h-8">
            <AvatarImage src={userProfile?.image} alt={userProfile?.name} />
            <AvatarFallback>FM</AvatarFallback>
        </Avatar>
        {userProfile?.name}
    </div>
}

export const columns: ColumnDef<Doc<"files"> & { isFavorited: boolean }>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
            return <UserCell userId={row.original.userId!} />
        },
    },
    {
        header: "Uploaded on",
        cell: ({ row }) => {
            const formatted = new Intl.DateTimeFormat('en-US', {
                dateStyle: 'short',
                timeStyle: 'short',
            }).format(row.original._creationTime)

            return <div>{formatted}</div>
        },
    },
    {
        header: "Actions",
        cell: ({ row }) => {
            return <FileCardActions
                fileId={row.original._id}
                fileIdStorage={row.original.fileId}
                isFavorited={row.original.isFavorited}
                forDeleted={row.original.forDeleted}
            />
        },
    }
]
