import Image from 'next/image';

export default function CopyTrading() {
	return (
		<div className='position-relative z-1'>
			<div className='container'>
				<div className='row g-4'>
					<div className='col-12'>
						<div className='p-4 p-md-6 p-xl-10 rounded-4 bg-black border border-neutral-10'>
							<div className='p-4 p-md-8 p-xl-10 py-xl-12 rounded-4 bg-neutral-4 border border-neutral-variant-20'>
								<div className='row g-4 align-items-center'>
									<div className='col-lg-6 col-xxl-7'>
										<span className='d-inline-block mb-4 rounded py-1 px-3 bg-primary-key clr-white fs-14 fw-bold text-center fadeIn_bottom'>
											Copy Top Traders
										</span>
										<h3 className='mb-6 clr-neutral-90 fw-extrabold animate-line-3d'>
											With Cavarates, replicate top
											traders trading actions.
										</h3>
										<p className='mb-8 max-text-40 fs-14 fw-medium clr-neutral-80 animate-text-from-right'>
											Broaden your trading portfolio by
											exploring the strategies of our Lead
											traders. Emulate their trading
											actions. When they trade, you trade!
											Their potential becomes yours as
											well!
										</p>
										<ul className='list list-row flex-wrap gap-4 align-items-center'>
											<li className='fadein_bottom_19'>
												<div className='d-flex aling-items-center gap-3'>
													<div className='d-grid place-content-center w-6 h-6 rounded-circle bg-neutral-variant-30 clr-neutral-80 flex-shrink-0'>
														<i className='bi bi-check2'></i>
													</div>
													<span className='d-block fw-semibold clr-neutral-80'>
														{' '}
														Instant Deposit{' '}
													</span>
												</div>
											</li>
											<li className='fadein_bottom_19'>
												<div className='d-flex aling-items-center gap-3'>
													<div className='d-grid place-content-center w-6 h-6 rounded-circle bg-neutral-variant-30 clr-neutral-80 flex-shrink-0'>
														<i className='bi bi-check2'></i>
													</div>
													<span className='d-block fw-semibold clr-neutral-80'>
														{' '}
														Fastest Withdrawal{' '}
													</span>
												</div>
											</li>
										</ul>
									</div>
									<div className='col-lg-6 col-xxl-5'>
										<div className='text-lg-center fadeIn_bottom'>
											<Image
												src='/resources/landing/assets/img/copy-trading-daman.png'
												alt='copy trading'
												width={500}
												height={500}
												className='img-fluid'
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='col-md-6'>
						<div className='border border-neutral-10 bg-black rounded-4 h-100'>
							<div className='p-4 p-lg-6 p-xxl-12 text-center fadeIn_bottom'>
								<Image
									src='/resources/landing/assets/img/img-2.png'
									alt='image'
									width={500}
									height={500}
									className='img-fluid'
								/>
							</div>
							<div className='px-4 px-lg-6 px-xxl-12 pb-4 pb-lg-4 pb-xxl-12'>
								<div className='mb-0 fw-extrabold'>
									<h3 className='mb-6 clr-neutral-90 fw-extrabold animate-line-3d'>
										Our strength is in the numbers.
									</h3>
								</div>
								<p className='mb-8 max-text-40 fs-14 fw-medium clr-neutral-80 animate-text-from-right'>
									Cavarates is one of the largest Copy
									Trading platform providers in the world by
									trading volume. With full support across the
									globe.
								</p>
							</div>
						</div>
					</div>
					<div className='col-md-6'>
						<div className='border border-neutral-10 bg-black rounded-4 h-100'>
							<div className='pt-4 pt-lg-6 pt-xxl-12 text-center overflow-hidden'>
								<div
									className='scroller-x mb-6'
									data-direction='left'
									data-speed='slow'
									data-animated='true'
								>
									{/* Add scrolling flags here if needed */}
								</div>
							</div>
							<div className='p-4 p-lg-6 p-xxl-12'>
								<span className='d-inline-block py-1 px-3 bg-neutral-6 clr-neutral-80 mb-4 rounded fadeIn_bottom'>
									<span className='d-inline-block fw-extrabold'>
										{' '}
										Unlimited Language Support{' '}
									</span>
								</span>
								<div className='mb-6 fw-extrabold'>
									<h5 className='link d-block clr-grad-1 animate-text-from-right'>
										Cavarates is Trusted by Millions in
										40+ Countries.
									</h5>
								</div>
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
