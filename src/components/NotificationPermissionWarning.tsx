"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

export default function NotificationPermissionWarning() {
  const [permissionState, setPermissionState] = useState<NotificationPermission | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    // Check if notifications are supported in this browser
    if (typeof Notification === "undefined") {
      setIsSupported(false)
      return
    }

    // Get current permission state
    setPermissionState(Notification.permission)

    // Set up a listener for permission changes
    const checkPermission = () => {
      setPermissionState(Notification.permission)
    }

    // Check permission when the component mounts and when window gets focus
    window.addEventListener("focus", checkPermission)

    return () => {
      window.removeEventListener("focus", checkPermission)
    }
  }, [])

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      setPermissionState(permission)
    } catch (error) {
      console.error("Error requesting notification permission:", error)
    }
  }

  // Don't show anything if notifications are granted or not supported
  if (!isSupported || permissionState === "granted" || permissionState === null) {
    return null
  }

  return (
    <div className="mb-4 rounded-md border border-amber-500 bg-amber-50 p-4 text-amber-800">
      <div className="flex items-start">
        <Bell className="mr-3 h-5 w-5 flex-shrink-0" />
        <div>
          <p>
          Notificările sunt dezactivate. Nu vei primi notificări când nu folosești aplicația.
            {permissionState === "denied" ? (
              <span> Notificările sunt blocate în setările browserului tău..</span>
            ) : (
              <span> Activați notificările pentru a primi actualizări importante.”</span>
            )}
          </p>

          {permissionState !== "denied" && (
            <button
              onClick={requestPermission}
              className="mt-2 rounded-md bg-amber-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-amber-700"
            >
              Activează notificări
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
