export const dynamic = 'force-dynamic'

import { isAdmin } from '@/lib/admin'

export default async function AdminPage() {
    const allowed = await isAdmin()

    if (!allowed) return <div>Access Denied</div>

    return <div>Admin Dashboard</div>
}
