import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchButton() {
  return (
    <Button
      size="lg"
      className="rounded-full px-8 bg-white text-black"
    >
      <Search className="mr-2 h-4 w-4" />
      Search
    </Button>
  )
}
