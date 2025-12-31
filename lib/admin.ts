import 'server-only'
import { auth } from '@clerk/nextjs/server'

export async function isAdmin() {
  const { userId } = await auth()

  if (!userId) return false

  return userId === process.env.ADMIN_USER_ID
}
