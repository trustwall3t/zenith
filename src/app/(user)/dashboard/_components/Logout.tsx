'use client'
import { logout } from "@/actions/auth/login";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
export const Logout = () => {
	const router = useRouter();
    const handleLogout = async () => {
        await logout();
        router.push('/auth/login');
    }
	return (
		<div
			onClick={handleLogout}
		    className='flex items-center gap-2'
		>
			<LogOut className='h-4 w-4' strokeWidth={2} />
			Logout
		</div>
	);
};
