'use client';
import { logoutAdmin } from '@/actions/auth/admin';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function LogoutButton() {
	const router = useRouter();
	const handleLogout = async () => {
		await logoutAdmin();
		router.push('/admin/login');
	};
	return (
		<button onClick={handleLogout} className='flex items-center gap-2'>
			<LogOut className='h-4 w-4' strokeWidth={2} />
			Logout
		</button>
	);
}
