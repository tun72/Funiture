import { Button, } from "@/components/ui/button"
import { HTMLAttributes } from "react";
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils";
interface FavouriteProps extends HTMLAttributes<HTMLButtonElement> {
    id: string;
    rating: number;

}

function AddToFavourite({ id, rating, className, ...props }: FavouriteProps) {
    console.log(id, rating);

    return (
        <Button {...props} variant={"secondary"} className={cn("size-8 shrink-0", className)}>
            <Icons.heartIcon className="size-4" />
        </Button>
    )
}

export default AddToFavourite