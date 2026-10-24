'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeLogo } from '@/components/brand/ThemeLogo';
import Image from 'next/image';

const Header: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

	const toggleSubmenu = (menuName: string) => {
		setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
	};

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			setIsMenuOpen(false);
		}
	};

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const menu = document.querySelector('.menu-nav');
			const toggle = document.querySelector('.menu-toggle');
			if (
				menu &&
				!menu.contains(event.target as Node) &&
				toggle &&
				!toggle.contains(event.target as Node)
			) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Prevent body scroll when menu is open
	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [isMenuOpen]);

	const navLinks = {
		company: [
			{ href: '/about-us', label: 'About TrackTradex' },
			{ href: '/security-of-funds', label: 'Security of funds' },
			{ href: '/what-you-can-trade', label: 'What you can trade' },
			{ href: '/news-events', label: 'News & Events' },
			{ href: '/contact-us', label: 'Contact Us' },
		],
		products: [
			{
				href: '/#forex',
				label: 'Forex',
				icon: '/resources/landing/assets/img/Eur_Usd.png',
			},
			{
				href: '/#commodities',
				label: 'Commodities',
				icon: '/resources/landing/assets/img/Gold-1.png',
			},
			{
				href: '/#indices',
				label: 'Indices',
				icon: '/resources/landing/assets/img/Nasdaq-4.png',
			},
			{
				href: '/#stocks',
				label: 'Stocks',
				icon: '/resources/landing/assets/img/Tesla-1.png',
			},
		],
		trading: [
			{ href: '/trading-servers', label: 'Trading Servers' },
			{ href: '/trading-scanners', label: 'Trading Scanners' },
			{ href: '/broker-statement', label: 'Broker Statement' },
		],
	};

	return (
		<header className='header header--1 header--fixed'>
			<div className='container'>
				<div className='row'>
					<div className='col-12'>
						<nav className='menu d-lg-flex justify-content-lg-between align-items-lg-center py-3 py-lg-0'>
							<div className='d-flex align-items-center justify-content-between'>
								<Link
									href='/'
									className='logo link d-inline-flex align-items-center flex-shrink-0'
								>
									<ThemeLogo
										alt='logo'
										width={150}
										height={50}
										className='img-fluid object-fit-contain'
									/>
								</Link>
								<button
									onClick={() => setIsMenuOpen(!isMenuOpen)}
									className='menu-toggle d-lg-none'
								>
									<span
										className={`hamburger ${
											isMenuOpen ? 'active' : ''
										}`}
									></span>
								</button>
							</div>

							{/* Mobile Menu with Overlay */}
							<div
								className={`mobile-menu-container ${
									isMenuOpen ? 'active' : ''
								}`}
								onClick={handleOverlayClick}
							>
								<div className='mobile-menu'>
									<ul className='menu-items'>
										<li>
											<Link
												href='/'
												className='menu-link'
											>
												Home
											</Link>
										</li>
										<li>
											<button
												onClick={() =>
													toggleSubmenu('company')
												}
												className={`menu-link ${
													activeSubmenu === 'company'
														? 'active'
														: ''
												}`}
												data-has-sub='true'
											>
												Company
											</button>
											<ul
												className={`submenu ${
													activeSubmenu === 'company'
														? 'active'
														: ''
												}`}
											>
												{navLinks.company.map(
													(link, index) => (
														<li key={index}>
															<Link
																href={link.href}
																className='submenu-link'
															>
																{link.label}
															</Link>
														</li>
													)
												)}
											</ul>
										</li>
										<li>
											<button
												onClick={() =>
													toggleSubmenu('products')
												}
												className={`menu-link ${
													activeSubmenu === 'products'
														? 'active'
														: ''
												}`}
												data-has-sub='true'
											>
												Products
											</button>
											<ul
												className={`submenu ${
													activeSubmenu === 'products'
														? 'active'
														: ''
												}`}
											>
												{navLinks.products.map(
													(link, index) => (
														<li key={index}>
															<Link
																href={link.href}
																className='submenu-link'
															>
																<span className='icon'>
																	<Image
																		src={
																			link.icon
																		}
																		alt={
																			link.label
																		}
																		width={
																			24
																		}
																		height={
																			24
																		}
																	/>
																</span>
																{link.label}
															</Link>
														</li>
													)
												)}
											</ul>
										</li>
										<li>
											<button
												onClick={() =>
													toggleSubmenu('trading')
												}
												className={`menu-link ${
													activeSubmenu === 'trading'
														? 'active'
														: ''
												}`}
												data-has-sub='true'
											>
												Trading
											</button>
											<ul
												className={`submenu ${
													activeSubmenu === 'trading'
														? 'active'
														: ''
												}`}
											>
												{navLinks.trading.map(
													(link, index) => (
														<li key={index}>
															<Link
																href={link.href}
																className='submenu-link'
															>
																{link.label}
															</Link>
														</li>
													)
												)}
											</ul>
										</li>
									</ul>

									<div className='auth-buttons'>
										<Link
											href='/auth/login'
											className='login-btn'
										>
											Login
										</Link>
										<Link
											href='/auth/signup'
											className='signup-btn'
										>
											Get Started
										</Link>
									</div>
								</div>
							</div>
							
						</nav>
					</div>
				</div>
			</div>

			<style jsx>{`
				.menu-toggle {
					background: none;
					border: none;
					padding: 10px;
					cursor: pointer;
					z-index: 1001;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.hamburger {
					display: block;
					width: 20px;
					height: 2px;
					background: var(--primary, #3730a3);
					position: relative;
					transition: all 0.3s ease;
				}

				.hamburger::before,
				.hamburger::after {
					content: '';
					position: absolute;
					width: 20px;
					height: 2px;
					background: var(--primary, #3730a3);
					transition: all 0.3s ease;
				}

				.hamburger::before {
					top: -8px;
				}

				.hamburger::after {
					bottom: -8px;
				}

				.hamburger.active {
					background: transparent;
				}

				.hamburger.active::before {
					transform: rotate(45deg);
					top: 0;
				}

				.hamburger.active::after {
					transform: rotate(-45deg);
					bottom: 0;
				}

				.mobile-menu-container {
					display: none;
				}

				@media (max-width: 991px) {
					.mobile-menu-container {
						position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						height: 100vh;
						background: rgba(0, 0, 0, 0.5);
						z-index: 999;
						display: none;
					}

					.mobile-menu-container.active {
						display: block;
					}

					.mobile-menu {
						position: fixed;
						top: 0;
						left: 0;
						width: 60%;
						height: 100vh;
						background: var(--bg-dark, #1a1a1a);
						padding: 80px 20px 20px;
						display: flex;
						flex-direction: column;
						transform: translateX(-100%);
						transition: transform 0.3s ease;
						z-index: 1000;
					}

					.mobile-menu-container.active .mobile-menu {
						transform: translateX(0);
					}

					.menu-toggle {
						background: none;
						border: none;
						padding: 10px;
						cursor: pointer;
						z-index: 1001;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.menu-items {
						list-style: none;
						padding: 0;
						margin: 0;
					}

					.menu-link {
						display: block;
						padding: 15px 0;
						color: var(--text-light, #ffffff);
						text-decoration: none;
						font-size: 1.1rem;
						font-weight: 500;
						background: none;
						border: none;
						width: 100%;
						text-align: left;
						cursor: pointer;
						transition: color 0.3s ease;
						position: relative;
					}

					.menu-link:hover {
						color: var(--primary, #3730a3);
						text-decoration: none;
					}

					/* Add submenu indicator */
					.menu-link[data-has-sub='true']::after {
						content: '';
						position: absolute;
						right: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 0;
						height: 0;
						border-left: 5px solid transparent;
						border-right: 5px solid transparent;
						border-top: 5px solid var(--text-light, #ffffff);
						transition: transform 0.3s ease;
					}

					.menu-link[data-has-sub='true'].active::after {
						transform: translateY(-50%) rotate(180deg);
					}

					.menu-link[data-has-sub='true']:hover::after {
						border-top-color: var(--primary, #3730a3);
					}

					.submenu {
						display: none;
						padding-left: 20px;
						background: rgba(0, 0, 0, 0.2);
					}

					.submenu.active {
						display: block;
					}

					.submenu-link {
						display: flex;
						align-items: center;
						padding: 12px 0;
						color: var(--text-light, #ffffff);
						text-decoration: none;
						font-size: 0.95rem;
						transition: all 0.3s ease;
					}

					.submenu-link:hover {
						color: var(--primary, #3730a3);
						text-decoration: none;
					}

					.submenu-link .icon {
						margin-right: 12px;
						opacity: 0.8;
					}

					.auth-buttons {
						margin-top: auto;
						padding-top: 20px;
						display: flex;
						flex-direction: column;
						gap: 12px;
					}

					.login-btn,
					.signup-btn {
						display: block;
						padding: 14px;
						text-align: center;
						border-radius: 8px;
						text-decoration: none;
						font-weight: 600;
						font-size: 1rem;
						transition: all 0.3s ease;
					}

					.login-btn {
						background: transparent;
						border: 2px solid var(--primary, #3730a3);
						color: var(--primary, #3730a3);
					}

					.login-btn:hover {
						background: var(--primary, #3730a3);
						color: white;
					}

					.signup-btn {
						background: var(--primary, #3730a3);
						color: white;
						border: 2px solid var(--primary, #3730a3);
					}

					.signup-btn:hover {
						background: transparent;
						color: var(--primary, #3730a3);
					}

					/* Add animation for submenu items */
					.submenu-link {
						opacity: 0;
						transform: translateX(-10px);
						animation: slideIn 0.3s ease forwards;
					}

					@keyframes slideIn {
						to {
							opacity: 1;
							transform: translateX(0);
						}
					}

					/* Add animation delay for each submenu item */
					.submenu.active .submenu-link:nth-child(1) {
						animation-delay: 0.1s;
					}
					.submenu.active .submenu-link:nth-child(2) {
						animation-delay: 0.2s;
					}
					.submenu.active .submenu-link:nth-child(3) {
						animation-delay: 0.3s;
					}
					.submenu.active .submenu-link:nth-child(4) {
						animation-delay: 0.4s;
					}
					.submenu.active .submenu-link:nth-child(5) {
						animation-delay: 0.5s;
					}
				}
			`}</style>
		</header>
	);
};

export default Header;
