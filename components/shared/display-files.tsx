"use client"

import FileCard from "@/components/shared/file-card";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type DisplayFilesProps = {
    searchQuery: string;
    favoritesOnly?: boolean;
    deletedOnly?: boolean 
}

export default /* async */ function DisplayFiles({ searchQuery, favoritesOnly = false, deletedOnly = false }: DisplayFilesProps) {
    const { isLoaded: orgLoaded, organization } = useOrganization()
    const { isLoaded: userLoaded, user } = useUser()

    let orgId: string | undefined = (orgLoaded && userLoaded) ? organization?.id ?? user?.id : undefined

    const files = useQuery(api.files.getFiles, orgId ? { favorites: favoritesOnly, orgId, query: searchQuery, deleted: deletedOnly } : "skip")
    const allFavorites = useQuery(api.files.getAllFavorites, orgId ? { orgId } : "skip")

    if (files === undefined) {
        return (
            <div
                className="flex flex-col justify-center items-center gap-4"
            >
                {/* TODO: change this spinner to a card or cards with animate-pulse (wait for the final product of the card to make it look alike) */}
                <Loader2 className="h-24 w-24 animate-spin" />
                <p className="text-2xl">Loading your files...</p>
            </div>
        )
    }

    if (files && files?.length < 1) {
        return (
            <div className="flex flex-col justify-center items-center gap-4">
                <Image
                    src="/assets/void.svg"
                    width={200}
                    height={200}
                    alt="Image of a picture and directory icon"
                />
                <p className="text-2xl">No file/s to show here</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* {files?.map((file: Doc<"files">) => (
                <FileCard
                    key={file._id}
                    file={file}
                    allFavorites={allFavorites ?? []}
                />
            ))} */}
            {files?.reduce((allFiles: JSX.Element[], file: Doc<"files">) => {
                allFiles.push(
                    <FileCard
                        key={file._id}
                        file={file}
                        allFavorites={allFavorites ?? []}
                    />
                )
                return allFiles
            }, new Array<JSX.Element>())}
        </div>

    )
}