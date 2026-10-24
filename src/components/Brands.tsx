'use client';

import Image from 'next/image';

export default function Brands() {
	const brands = [
		{
			src: '/resources/landing/assets/img/barclays-logo.png',
			alt: 'Barclays',
		},
		{ src: '/resources/landing/assets/img/ssl-logo.png', alt: 'SSL' },
		{
			src: '/resources/landing/assets/img/brand-icon-2.png',
			alt: 'Brand 2',
		},
		{ src: '/resources/landing/assets/img/mcafee-logo.png', alt: 'McAfee' },
		{
			src: '/resources/landing/assets/img/customer-logo-1.png',
			alt: 'Customer 1',
		},
		{
			src: '/resources/landing/assets/img/customer-logo-2.png',
			alt: 'Customer 2',
		},
		{
			src: '/resources/landing/assets/img/brand-icon-7.png',
			alt: 'Brand 7',
		},
		{
			src: '/resources/landing/assets/img/brand-icon-8.png',
			alt: 'Brand 8',
		},
		{
			src: '/resources/landing/assets/img/brand-icon-9.png',
			alt: 'Brand 9',
		},
		{
			src: '/resources/landing/assets/img/brand-icon-10.png',
			alt: 'Brand 10',
		},
		{
			src: '/resources/landing/assets/img/brand-icon-11.png',
			alt: 'Brand 11',
		},
		{
			src: '/resources/landing/assets/img/brand-icon-12.png',
			alt: 'Brand 12',
		},
	];

	return (
		<div className='section-space-sm-y'>
			<div className='section-space-sm-bottom'>
				<div className='container'>
					<div className='row justify-content-center'>
						<div className='col-md-8 col-xl-6'>
							<h6 className='mb-0 clr-neutral-90 text-center fw-extrabold animate-line-3d'>
								We&apos;ve with worked and are trusted by
								<span className='clr-grad-1'>
									25,000+ Global BRANDS
								</span>
							</h6>
						</div>
					</div>
				</div>
			</div>
			<div className='container-fluid p-0'>
				<div className='row g-0'>
					<div className='col-12'>
						<div
							className='scroller-x mb-4'
							data-direction='right'
							data-speed='slow'
						>
							<ul className='list list-row gap-4 scroller-x__list'>
								{brands.map((brand, index) => (
									<li key={index}>
										<div className='brand-btn d-inline-block py-4 px-10 rounded-pill bg-neutral-10'>
											<Image
												src={brand.src}
												alt={brand.alt}
												width={150}
												height={50}
												className='img-fluid'
											/>
										</div>
									</li>
								))}
							</ul>
						</div>
						<div
							className='scroller-x'
							data-direction='left'
							data-speed='slow'
						>
							<ul className='list list-row gap-4 scroller-x__list'>
								{brands.map((brand, index) => (
									<li key={`second-${index}`}>
										<div className='brand-btn d-inline-block py-4 px-10 rounded-pill bg-neutral-10'>
											<Image
												src={brand.src}
												alt={brand.alt}
												width={150}
												height={50}
												className='img-fluid'
											/>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
