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
        <div className="min-h-screen flex flex-col ">
            <Header />
            <main className="mx-auto  flex flex-1 items-center">
                <Card className="w-[350px] md:w-[500px] lg:w-[550px]">
                    <CardHeader>
                        <CardTitle className="text-center">Opps!</CardTitle>
                        <CardDescription className="text-center">An Error occurs accidently.</CardDescription>
                    </CardHeader>

                    <CardFooter className="flex justify-center">
                        <Button asChild>
                            <Link to="/">Go to Home Page</Link>
                        </Button>

                    </CardFooter>
                </Card>
            </main>
            <Footer />
        </div>
    )
}


/*
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto flex bg-red-500 flex-1 items-center">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle className="text-center">Opps!</CardTitle>
                        <CardDescription className="text-center">An Error occurs accidently.</CardDescription>
                    </CardHeader>

                    <CardFooter className="flex justify-center">
                        <Button asChild>
                            <Link to="/">Go to Home Page</Link>
                        </Button>

                    </CardFooter>
                </Card>
            </main>
        </div>

*/
