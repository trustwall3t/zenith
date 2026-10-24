'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
	return (
		<div className='trigger-showcase position-relative z-1'>
			<div className='single-blog-area section-space-y hero-2'>
				<div className='container'>
					<div className='swiper blog-single-slider'>
						<div className='swiper-wrapper'>
							<div className='swiper-slide swiper-slide-active'>
								<div className='row align-items-center gy-4 section-space-y'>
									<div className='col-lg-6'>
										<div className='blog-latest-thumb p-5'>
											<Link
												href='/'
												className='d-block'
											>
												<Image
													src='/resources/landing/assets/img/mobile-cta-fsa.png'
													alt='image'
													width={500}
													height={500}
													className='img-fluid w-100 object-fit-cover'
												/>
											</Link>
										</div>
									</div>
									<div className='col-lg-6'>
										<div className='blog-latest-content'>
											<h4 className='h4 mb-6 fw-extrabold'>
												<Link
													href='/'
													className='link clr-neutral-90 clr-primary-key'
												>
													Explore a new Universe of{' '}
													<span className='text-primary'>
														Copy-Trading
													</span>{' '}
													from expert Traders
												</Link>
											</h4>
											<p className='clr-neutral-80 mb-6'>
												Benefit from some of the
												industry&apos;s lowest trading
												costs on over 1,000 highly
												liquid currencies, indices,
												commodities, share CFDs, and
												more, with razor-sharp spreads
												starting at 0.0 pips.
											</p>
											<ul className='list list-row flex-wrap gap-4'>
												<li>
													<Link
														href='/auth/signup'
														className='blog-tag'
													>
														Create Free Account
													</Link>
												</li>
												<li>
													<Link
														href='/auth/login'
														className='blog-tag'
													>
														Trader Account
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
			</div>

			<section className='hero-1'>
				<div className='container'>
					<div className='row justify-content-md-center'>
						<div className='col-md-10 col-lg-9 col-xxl-10 text-center'>
							<h1 className='clr-white fw-extrabold mb-6 animate-line-3d'>
								Endless{' '}
								<span className='clr-grad-1'>
									Trading Opportunities
								</span>{' '}
								Awaits
							</h1>
							<p className='fs-18 fw-bold clr-neutral-80 max-text-50 mx-auto mb-10 animate-text-from-bottom'>
								Try our advanced Copy Trading platforms and
								never miss a trade! <br />
								Join 50 million traders and investors taking the
								future into their own hands.
							</p>
						</div>
					</div>
				</div>
				<Image
					src='/resources/landing/assets/img/Tesla-1.png'
					alt='image'
					width={200}
					height={200}
					className='img-fluid hero-1-shapes__img hero-1-shapes__img--5'
				/>
				<Image
					src='/resources/landing/assets/img/Eur_Usd.png'
					alt='image'
					width={200}
					height={200}
					className='img-fluid hero-1-shapes__img hero-1-shapes__img--6'
				/>
			</section>
		</div>
	);
}
