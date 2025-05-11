import { useParams } from "react-router-dom"

export default function BlogDetail() {
  const {postId} = useParams();
  return (
    <div>BlogDetail : {postId}</div>
  )
}
