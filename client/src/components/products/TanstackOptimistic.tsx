import { Button, } from "@/components/ui/button"
import { HTMLAttributes } from "react";
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils";
// import { useFetcher } from "react-router";
import { useMutation } from "@tanstack/react-query";
import api from "@/api";
import { queryClient } from "@/api/query";
interface FavouriteProps extends HTMLAttributes<HTMLButtonElement> {
    id: string;
    rating: number;
    isFavourite: boolean;
}

import { useState } from "react";

function AddToFavourite({
    id,
    // rating, 
    isFavourite,
    className,
    ...props }: FavouriteProps) {

    const [optimisticFavourite, setOptimisticFavourite] = useState(isFavourite);
    const [, setIsMutating] = useState(false);

    const { mutate } = useMutation({
        mutationFn: async () => {
            const data = {
                productId: Number(id),
                favourite: !optimisticFavourite
            };
            const response = await api.patch("user/products/toggle-favourite", data);

            if (response.status !== 200) {
                throw new Error(response.data || "Add to Favourite Fail!");
            }

            return response.data;
        },
        onMutate: async () => {
            if (navigator.onLine) {
                setOptimisticFavourite((prev) => !prev);
                setIsMutating(true);
            }
        },
        onError: () => {
            // Revert optimistic update if mutation fails
            setOptimisticFavourite(isFavourite);
            setIsMutating(false);
        },
        onSuccess: () => {
            setIsMutating(false);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["product", "detail", id],
            });
        }
    });

    const handleClick = () => {
        if (!navigator.onLine) return; // Prevent mutation if offline
        mutate();
    };

    return (
        <Button
            {...props}
            variant={"secondary"}
            title={optimisticFavourite ? "Remove from favourites" : "Add to favourites"}
            onClick={handleClick}
            className={cn("size-8 shrink-0", className)}
        >
            {optimisticFavourite ? (
                <Icons.heartIconFill className="size-4 text-red-500" />
            ) : (
                <Icons.heartIcon className="size-4 text-red-500" />
            )}
        </Button>
    );
}

export default AddToFavourite