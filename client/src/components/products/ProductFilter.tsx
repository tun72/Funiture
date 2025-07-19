

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import type { FilterProps } from "@/types"


interface ProductFilterProps {
    filterList: FilterProps;
    onHandelFilter: (categories: string[], types: string[]) => void,
    categoriesFilter: string[],
    typesFilter: string[],
    clearFilter: () => void

}
const FormSchema = z.object({
    categories: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one categories"
    }),
    types: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one types"
    })
})

export default function ProductFilter({ filterList, onHandelFilter, categoriesFilter, typesFilter, clearFilter }: ProductFilterProps) {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            categories: categoriesFilter,
            types: typesFilter
        },
    })



    function onSubmit(data: z.infer<typeof FormSchema>) {
        onHandelFilter(data.categories, data.types)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="categories"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Funitures Made By</FormLabel>
                            </div>
                            {filterList.categories.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="categories"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-center space-x-2 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        className="data-[state=checked]:bg-brand/90"
                                                        checked={field.value?.includes(item.id.toString())}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, item.id.toString()])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== item.id.toString()
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">
                                                    {item.name}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="types"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Funiture Types</FormLabel>
                            </div>
                            {filterList.types.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="types"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-center space-x-2 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        className="data-[state=checked]:bg-brand/90"
                                                        checked={field.value?.includes(item.id.toString())}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, item.id.toString()])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== item.id.toString()
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">
                                                    {item.name}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-x-2">
                    <Button type="submit" variant={"outline"}>Filter</Button>
                    <Button type="button" variant={"outline"} onClick={() => {
                        form.reset({ categories: [], types: [] })
                        clearFilter()
                    }}>Clear</Button>
                </div>
            </form>
        </Form>
    )
}
