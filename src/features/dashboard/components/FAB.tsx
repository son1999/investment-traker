import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useIsGuest } from '@/hooks/useIsGuest'

export default function FAB() {
  const navigate = useNavigate()
  const isGuest = useIsGuest()

  if (isGuest) return null

  return (
    <Button
      size="icon-lg"
      onClick={() => navigate('/transactions')}
      className="fixed bottom-5 right-5 z-50 shadow-[var(--shadow-soft)] sm:bottom-8 sm:right-8"
    >
      <Plus size={18} />
    </Button>
  )
}
