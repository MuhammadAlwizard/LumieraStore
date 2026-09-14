import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export default async function AdminLayout({children}:{children:ReactNode}){const session=await getServerSession(authOptions);return <>{!session?children:<><div className="admin-nav"><div className="admin-nav-inner"><strong>LUMIÉRA Admin</strong><a href="/api/auth/signout">Keluar</a></div></div>{children}</>}</>}
