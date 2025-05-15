import Dompurify from 'dompurify'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  content: string
}

function RichTextRender({ content, className }: Props) {
  const sanitizedContent = Dompurify.sanitize(content)
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} className={className}></div>
}

export default RichTextRender
