'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type User = {
	id: string;
	name: string | null;
	email: string;
	phone?: string;
	address?: string;
	accountType?: string;
	country?: string;
	btcAddress?: string;
	usdtAddress?: string;
	ethAddress?: string;
	walletBalance?: number | null;
	// Add other user fields as needed
};

type UserContextType = {
	user: User | null;
	loading: boolean;
	setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
	user: null,
	loading: true,
	setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch('/api/auth/session');
				if (!response.ok) {
					setLoading(false);
					return;
				}

				const data = await response.json();
				setUser(data.user);
			} catch (error) {
				console.error('Error fetching user:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, loading, setUser }}>
			{children}
		</UserContext.Provider>
	);
};
