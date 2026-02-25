'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { INotification } from '@/types'
import { useAuth } from './auth-context'
import {
  apiGetAllNotifications,
  apiGetUnreadCount,
  apiMarkAsRead,
} from '../httpclient/notification.client'

// NOTE: This provider focus in display badge on header and display only 5 latest products

interface NotificationContextType {
  notifications: INotification[]
  unreadNumber: number
  fetchNotifications: () => Promise<void>
  onMarkAsRead: (id: string) => Promise<void>
  syncNotifications: (data: INotification[]) => void
  addNewNotification: (notification: INotification) => void
  setUnreadNumber: React.Dispatch<React.SetStateAction<number>>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [unreadNumber, setUnreadNumber] = useState<number>(0)

  const fetchNotifications = async () => {
    if (!user?.id) return
    try {
      const res = await Promise.all([
        apiGetAllNotifications({ userId: user.id }),
        apiGetUnreadCount(user.id)
      ])
      setNotifications(res[0].data)
      setUnreadNumber(res[1].unreadNumber)
    } catch (e) {
      console.error(e)
    }
  }

  const onMarkAsRead = async (id: string) => {
    try {
      const res = await apiMarkAsRead(id)
      if (!res) return
      setNotifications(prev =>
        prev.map(n => (n.id === id ? res : n))
      )
      setUnreadNumber(prev => prev - 1)
    } catch (e) {
      console.error(e)
    }
  }

  const syncNotifications = async (data: INotification[]) => {
    setNotifications(data.slice(0, 5))
  }

  const addNewNotification = (notification: INotification) => {
    setNotifications(prev => {
      if (prev.some(n => n.id === notification.id)) return prev
      return [notification, ...prev]
    })
    setUnreadNumber(prev => prev + 1)
  }

  useEffect(() => {
    if (!user?.id) return

    // First fetch
    fetchNotifications()

    // Create connection to API stream
    const url = `/api/notifications/stream?userId=${user.id}`
    const eventSource = new EventSource(url)

    // Listen messages from server
    eventSource.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data) as INotification
        addNewNotification(newNotification)
      } catch (error) {
        console.error('Error parsing notification event:', error)
      }
    }

    eventSource.onerror = (e) => {
      console.error('SSE Error:', e)
      eventSource.close()
    }
    return () => {
      eventSource.close()
    }
  }, [user?.id])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadNumber,
        fetchNotifications,
        onMarkAsRead,
        syncNotifications,
        addNewNotification,
        setUnreadNumber
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error(
      'useNotification must be used within NotificationProvider'
    )
  }
  return ctx
}