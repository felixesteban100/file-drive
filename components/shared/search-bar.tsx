"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Search } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"


const formSchema = z.object({
    query: z.string().min(0).max(200),
})

export default function SearchBar() {
    const searchParams = useSearchParams()
    const { replace } = useRouter()
    const params = new URLSearchParams(searchParams)
    const pathname = usePathname()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: searchParams.get('query') ?? "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.query !== "") {
            params.set('query', values.query)
        } else {
            params.delete('query')
        }

        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center">
                    <FormField
                        control={form.control}
                        name="query"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="file name..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="flex gap-2 items-center"
                        size={"icon"}
                    >
                        <Search />
                    </Button>
                </form>
            </Form>
        </div>
    )
}