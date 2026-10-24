'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
	return (
		<footer className='footer-1 position-relative overflow-hidden'>
			<div className='footer-1__top section-space-y border border-start-0 border-end-0 border-neutral-10 position-relative z-1 overflow-hidden'>
				<div className='container'>
					<div className='row g-4 gy-5'>
						<div className='col-md-9 col-lg-8 col-xl-6'>
							<div className='pe-xl-15'>
								<h3 className='mb-10 clr-neutral-90 fw-extrabold animate-line-3d'>
									You can only trade right with -{' '}
									<span className='clr-grad-1'>
										Cavarates.
									</span>
								</h3>
								<p className='clr-neutral-90'>
									Cavarates is dedicated to crafting an
									unparalleled trading journey for both retail
									and institutional clients, enabling traders
									to concentrate on their trading endeavors.
									Developed by traders for traders,
									Cavarates is committed to providing
									exceptional spreads, execution, and service.
								</p>
							</div>
						</div>
						<div className='col-xl-6'>
							<div className='ps-xl-10'>
								<div className='row g-4 gy-5'>
									<div className='col-md-3 col-xl-6'>
										<h6 className='mb-6 fs-18 clr-neutral-90 animate-text-from-bottom'>
											{' '}
											Trading{' '}
										</h6>
										<ul className='list gap-1'>
											<li>
												<Link
													href='/#stocks'
													className='link d-inline-block clr-neutral-80 clr-secondary-key animate-text-from-bottom'
												>
													Stocks Overview
												</Link>
											</li>
											<li>
												<Link
													href='/security-of-funds'
													className='link d-inline-block clr-neutral-80 clr-secondary-key animate-text-from-bottom'
												>
													Insurance
												</Link>
											</li>
										</ul>
									</div>
									<div className='col-md-3 col-xl-6'>
										<h6 className='mb-6 fs-18 clr-neutral-90 animate-text-from-bottom'>
											{' '}
											Specifications{' '}
										</h6>
										<ul className='list gap-1'>
											<li>
												<Link
													href='/#trade-commissions'
													className='link d-inline-block clr-neutral-80 clr-secondary-key animate-text-from-bottom'
												>
													Trade Commissions
												</Link>
											</li>
											<li>
												<Link
													href='/#products'
													className='link d-inline-block clr-neutral-80 clr-secondary-key animate-text-from-bottom'
												>
													Products
												</Link>
											</li>
											<li>
												<Link
													href='/#trading-hours'
													className='link d-inline-block clr-neutral-80 clr-secondary-key animate-text-from-bottom'
												>
													Trading Hours
												</Link>
											</li>
										</ul>
									</div>
									<div className='col-md-3 col-xl-6'>
										<h6 className='mb-6 fs-18 clr-neutral-90 animate-text-from-bottom'>
											{' '}
											Company{' '}
										</h6>
										<ul className='list gap-1'>
											<li>
												<Link
													href='/about-us'
													className='link d-inline-block clr-neutral-80 clr-secondary-key animate-text-from-bottom'
												>
													About-us
												</Link>
											</li>
											<li>
												<Link
													href='/contact-us'
													className='link d-inline-block clr-neutral-80 clr-secondary-key animate-text-from-bottom'
												>
													Contact Us
												</Link>
											</li>
										</ul>
									</div>
									<div className='col-md-3 col-xl-6'>
										<h6 className='mb-6 fs-18 clr-neutral-90 animate-text-from-bottom'>
											{' '}
											Legal Documentation{' '}
										</h6>
										<ul className='list gap-1'>
											<li>
												<Link
													href='/privacy-policy'
													className='link d-inline-block clr-neutral-80 clr-secondary-key animate-text-from-bottom'
												>
													Privacy Policy
												</Link>
											</li>
											<li>
												<Link
													href='/privacy-policy'
													className='link d-inline-block clr-neutral-80 clr-secondary-key animate-text-from-bottom'
												>
													Terms of Use
												</Link>
											</li>
											<li>
												<Link
													href='/privacy-policy'
													className='link d-inline-block clr-neutral-80 clr-secondary-key animate-text-from-bottom'
												>
													Terms & Conditions
												</Link>
											</li>
											<li>
												<Link
													href='/privacy-policy'
													className='link d-inline-block clr-neutral-80 clr-secondary-key animate-text-from-bottom'
												>
													Risk Disclosure Statement
												</Link>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='footer-1__bottom section-space-xsm-y'>
				<div className='container'>
					<div className='row g-4'>
						<div className='col-md-5 col-lg-12 text-center'>
							<p className='mb-0 clr-neutral-80 fs-14 fw-semibold'>
								Copyright &copy;2025 All Rights Reserved and
								Protected by{' '}
								<Link
									href='/'
									className='link d-inline-block clr-secondary-key'
								>
									Cavarates
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
			<Image
				src='/resources/landing/assets/img/footer-1-shape.webp'
				alt='shape'
				width={500}
				height={500}
				className='img-fluid footer-1__shape'
			/>
		</footer>
	);
}
