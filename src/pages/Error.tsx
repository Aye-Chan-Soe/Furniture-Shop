import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom";

function Error() {
  return <div className="min-h-screen flex flex-col">
    <Header/>
    <main className="flex flex-1 items-center justify-center">
    <Card className="w-[350px] md:w-[500px] lg:w-[500px]">
      <CardHeader className="text-center">
        <CardTitle>Oops!</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        An error occurs accidentally!
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild variant="outline">
          <Link to="/">Go to Home Page</Link>
        </Button>
      </CardFooter>
    </Card>
    </main>
  </div>;
}

export default Error;
