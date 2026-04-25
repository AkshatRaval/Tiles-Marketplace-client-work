'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function PopupClosePage() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        { type: 'GOOGLE_AUTH_SUCCESS' },
        window.location.origin
      )
      window.close()
    } else {
      // Opened directly, not as popup
      window.location.href = '/'
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="animate-spin" size={32} />
        <p className="text-sm">Completing sign in...</p>
      </div>
    </div>
  )
}