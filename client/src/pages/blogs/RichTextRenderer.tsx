import { cn } from "@/lib/utils"
import Dompurify from "dompurify"

interface Props extends React.HTMLAttributes<HTMLDivElement> { content: string }
function RichTextRenderer({ content, className }: Props) {
    const sanitizedContent = Dompurify.sanitize(content)
    return (
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} className={cn(className)} />
    )
}

export default RichTextRenderer