import { useParams } from 'react-router'

function Detail() {
  const { "*": splat } = useParams()
  return (
    <div>Detail {splat}</div>
  )
}

export default Detail