"use client"

import FileCard from "@/components/shared/file-card";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { GridIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { DataTable } from "./table/file-table";
import { columns } from "./table/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RowsIcon } from "@radix-ui/react-icons";
import TypeSelector from "./type-selector";
import { useSearchParams, useRouter, usePathname } from "next/navigation"


type DisplayFilesProps = {
    searchQuery: string;
    favoritesOnly?: boolean;
    deletedOnly?: boolean
}

export default /* async */ function DisplayFiles({ searchQuery, favoritesOnly = false, deletedOnly = false }: DisplayFilesProps) {
    const searchParams = useSearchParams()
    const { replace } = useRouter()
    const params = new URLSearchParams(searchParams)
    const pathname = usePathname()

    async function onSubmit(tab: string) {
        if (tab !== "") {
            params.set('tab', tab)
        } else {
            params.delete('tab')
        }

        replace(`${pathname}?${params.toString()}`)
    }


    const { isLoaded: orgLoaded, organization } = useOrganization()
    const { isLoaded: userLoaded, user } = useUser()

    let orgId: string | undefined = (orgLoaded && userLoaded) ? organization?.id ?? user?.id : undefined

    const type: Doc<"files">["type"] | "all" = params.get("type") as Doc<"files">["type"] | "all" ?? "all" 

    const files = useQuery(api.files.getFiles,
        orgId ? {
            favorites: favoritesOnly,
            orgId,
            type: type !== "all" ? type : undefined,
            query: searchQuery,
            deleted: deletedOnly
        } : "skip"
    )
    const allFavorites = useQuery(api.files.getAllFavorites, orgId ? { orgId } : "skip")

    const modifiedFiles = files?.map((file) => ({
        ...file,
        isFavorited: (allFavorites ?? []).some((favorite) => favorite.fileId === file._id)
    }))


    return (
        <Tabs value={params.get("tab") ?? "grid"} onValueChange={onSubmit} defaultValue="grid" className="">
            <div className="flex justify-between items-center mb-5">
                <TabsList>
                    <TabsTrigger value="grid" className="flex gap-2 items-center"><GridIcon /> Grid</TabsTrigger>
                    <TabsTrigger value="table" className="flex gap-2 items-center"><RowsIcon />Table</TabsTrigger>
                </TabsList>
                <TypeSelector />
            </div>
            {
                files === undefined ?
                    <div
                        className="flex flex-col justify-center items-center gap-4"
                    >
                        {/* TODO: change this spinner to a card or cards with animate-pulse (wait for the final product of the card to make it look alike) */}
                        <Loader2 className="h-24 w-24 animate-spin" />
                        <p className="text-2xl">Loading your files...</p>
                    </div>
                    :
                    files && files?.length < 1 ?
                        <div className="flex flex-col justify-center items-center gap-4">
                            <Image
                                src="/assets/void.svg"
                                width={200}
                                height={200}
                                alt="Image of a picture and directory icon"
                            />
                            <p className="text-2xl">No file/s to show here</p>
                        </div>
                        :
                        <>
                            <TabsContent value="grid">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                            </TabsContent>
                            <TabsContent value="table">
                                <DataTable
                                    columns={columns} data={modifiedFiles ?? []}
                                />
                            </TabsContent>
                        </>
            }
        </Tabs>
    )
}