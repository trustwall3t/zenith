'use client';

import Image from 'next/image';

export default function Features() {
	return (
		<div className='section-space-sm-top'>
			<div className='section-space-sm-bottom'>
				<div className='container'>
					<div className='row g-4 justify-content-between'>
						<div className='col-md-6 col-lg-7 col-xxl-6'>
							<h3 className='mb-0 clr-neutral-90 animate-line-3d'>
								{' '}
								What makes Cavarates unique?{' '}
							</h3>
						</div>
					</div>
				</div>
			</div>
			<div className='creative-approach-section position-relative overflow-hidden'>
				<div className='container'>
					<div className='row g-4 g-xl-0'>
						<div className='col-md-6 col-xl-3 creative-approach-section__item'>
							<div className='p-6 py-xl-18 fadein_bottom_8'>
								<div className='w-30 subtitle-flush-x subtitle-flush-x--secondary subtitle_line_2 mb-6'></div>
								<h5 className='mb-6 clr-secondary-key'>
									{' '}
									We Believe You Deserve The Best{' '}
								</h5>
								<p className='mb-0 clr-neutral-80'>
									Utilize our Expert Advisors, platforms, and
									round-the-clock Copy trading. Experiment
									with our distinctive risk management tool or
									integrate the Trading Central automated
									analysis add-on.
								</p>
							</div>
						</div>
						<div className='col-md-6 col-xl-3 creative-approach-section__item'>
							<div className='p-6 py-xl-18 fadein_bottom_8'>
								<div className='w-30 subtitle-flush-x subtitle-flush-x--secondary subtitle_line_2 mb-6'></div>
								<h5 className='mb-6 clr-secondary-key'>
									{' '}
									We Believe in Endless Possibilities{' '}
								</h5>
								<p className='mb-0 clr-neutral-80'>
									Gain access to a diverse range of the
									world&apos;s most sought-after instruments,
									spanning from forex pairs to CFDs on stocks,
									indices, commodities, and cryptocurrencies –
									all conveniently at your fingertips.
								</p>
							</div>
						</div>
						<div className='col-md-6 col-xl-3 creative-approach-section__item'>
							<div className='p-6 py-xl-18 fadein_bottom_8'>
								<div className='w-30 subtitle-flush-x subtitle-flush-x--secondary subtitle_line_2 mb-6'></div>
								<h5 className='mb-6 clr-secondary-key'>
									{' '}
									Equiped With Great Trading Conditions{' '}
								</h5>
								<p className='mb-0 clr-neutral-80'>
									From crafting top-tier educational materials
									to delivering daily market analysis updates
									and hosting live webinars, our commitment to
									your success matches your own level of
									dedication.
								</p>
							</div>
						</div>
						<div className='col-md-6 col-xl-3 creative-approach-section__item'>
							<div className='p-6 py-xl-18 fadein_bottom_8'>
								<div className='w-30 subtitle-flush-x subtitle-flush-x--secondary subtitle_line_2 mb-6'></div>
								<h5 className='mb-6 clr-secondary-key'>
									{' '}
									High Image Quality{' '}
								</h5>
								<p className='mb-0 clr-neutral-80'>
									Hedging is permitted without any
									constraints, alongside scalping. We ensure
									swift and dependable order execution, along
									with ultra-low spreads.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Image
				src='/resources/landing/assets/img/about-section-1-shape-1.png'
				alt='shape'
				width={500}
				height={500}
				className='img-fluid d-none d-xl-block position-absolute top-0 start-0 z-n1'
			/>
			<Image
				src='/resources/landing/assets/img/about-section-1-shape-2.png'
				alt='shape'
				width={500}
				height={500}
				className='img-fluid d-none d-xl-block position-absolute top-0 end-0 z-n1'
			/>
		</div>
	);
}
