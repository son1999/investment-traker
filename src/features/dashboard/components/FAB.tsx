import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useIsGuest } from '@/hooks/useIsGuest'

export default function FAB() {
  const navigate = useNavigate()
  const isGuest = useIsGuest()

  if (isGuest) return null

  return (
    <Button
      size="icon-lg"
      onClick={() => navigate('/transactions')}
      className="fixed bottom-8 right-8 z-50 size-14 rounded-xl shadow-lg"
    >
      <Plus size={16} />
    </Button>
  )
}
