"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useSearchParams, useRouter, usePathname } from "next/navigation"


export default function TypeSelector() {
    const searchParams = useSearchParams()
    const { replace } = useRouter()
    const params = new URLSearchParams(searchParams)
    const pathname = usePathname()

    async function onSubmit(type: string) {
        if (type !== "") {
            params.set('type', type)
        } else {
            params.delete('type')
        }

        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <Select value={params.get("type") ?? ""} defaultValue="all" onValueChange={(type) => onSubmit(type)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="docx">Docx</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
        </Select>
    )
}

