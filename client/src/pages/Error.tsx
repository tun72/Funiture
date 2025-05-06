import { Icons } from "@/components/icons"
import Footer from "@/components/layouts/Footer"
import Header from "@/components/layouts/Header"


import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router"
export default function Error() {

    return (
        <div className="min-h-screen flex flex-col overflow-hidden">
            <Header />
            <main className="mx-auto  flex flex-1 items-center my-32">
                <Card className="w-[350px] md:w-[500px] lg:w-[550px]">
                    <CardHeader className="grid place-items-center gap-2">
                        <div className="mt-2 mb-4  border border-dashed border-muted-foreground/70 rounded-full size-24 grid place-items-center"><Icons.errorIcon className="size-10 text-muted-foreground/70" aria-hidden="true" /></div>
                        <CardTitle>Opps!</CardTitle>
                        <CardDescription>An Error occurs accidently.</CardDescription>
                    </CardHeader>

                    <CardFooter className="flex justify-center">
                        <Button asChild variant={"outline"}>
                            <Link to="/">Go to Home Page</Link>
                        </Button>

                    </CardFooter>
                </Card>
            </main>
            <Footer />
        </div>
    )
}


