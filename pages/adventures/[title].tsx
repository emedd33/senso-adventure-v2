import { useRouter } from 'next/router'

const AdventurePage = () => {
  const router = useRouter()
  const { title } = router.query

  return (
<h2>hei</h2>
    )
}

export default AdventurePage