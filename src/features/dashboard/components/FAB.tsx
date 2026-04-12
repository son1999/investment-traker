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
      className="fixed bottom-4 right-4 z-50 size-12 rounded-xl shadow-lg sm:bottom-8 sm:right-8 sm:size-14"
    >
      <Plus size={16} />
    </Button>
  )
}
