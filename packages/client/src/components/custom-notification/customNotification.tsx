import { notification } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import CONSTS from '../../utils/consts'

const { PALETTE, NOTIFICATION_SHADOWS } = CONSTS

type NotificationType = 'success' | 'error' | 'info' | 'warning'
type NotificationOptions = {
  message: string
  description?: string
  type?: NotificationType
}

export function customNotification(options: NotificationOptions) {
  const { message, description, type = 'info' } = options

  let bgColor = PALETTE.background
  let color = PALETTE.primary
  let boxShadow
  let icon

  switch (type) {
    case 'success':
      boxShadow = NOTIFICATION_SHADOWS.success
      icon = <CheckCircleOutlined style={{ color }} />
      break
    case 'error':
      boxShadow = NOTIFICATION_SHADOWS.error
      color = PALETTE.error
      icon = <CloseCircleOutlined style={{ color }} />
      break
    case 'warning':
      boxShadow = NOTIFICATION_SHADOWS.warning
      color = PALETTE.warning
      icon = <ExclamationCircleOutlined style={{ color }} />
      break
    default: // info
      boxShadow = NOTIFICATION_SHADOWS.info
      color = PALETTE.info
      icon = <ExclamationCircleOutlined style={{ color }} />
      break
  }

  const CustomMessage = <span style={{ color }}>{message}</span>

  notification[type]({
    message: CustomMessage,
    description,
    icon: icon,
    style: {
      color,
      backgroundColor: bgColor,
      boxShadow,
    },
  })
}
