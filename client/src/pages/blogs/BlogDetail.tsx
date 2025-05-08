import { useParams } from 'react-router'

function BlogDetail() {
    const { postId } = useParams();
    return (
        <div>BlogDetail - {postId}</div>
    )
}

export default BlogDetail