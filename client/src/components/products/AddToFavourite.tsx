import { Button, } from "@/components/ui/button"
import { HTMLAttributes } from "react";
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils";
import { useFetcher } from "react-router";
interface FavouriteProps extends HTMLAttributes<HTMLButtonElement> {
    id: string;
    rating: number;
    isFavourite: boolean;
}

function AddToFavourite({
    id,
    // rating, 
    isFavourite,
    className,
    ...props }: FavouriteProps) {

    const fetcher = useFetcher({ key: `products/${id}` })
    let favourite = isFavourite;

    if (fetcher.formData) {
        favourite = fetcher.formData.get("favourite") === "true";
    }

    return (
        <fetcher.Form method="post" >
            <Button {...props} variant={"secondary"} className={cn("size-8 shrink-0", className)}
                name="favourite"
                value={favourite ? "false" : "true"}>
                {!favourite ? <Icons.heartIconFill className="size-4 text-red-500" /> : <Icons.heartIcon className="size-4 text-red-500" />}
            </Button>
        </fetcher.Form>
    )
}

export default AddToFavourite