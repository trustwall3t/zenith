'use client';

import { useState } from 'react';
import Link from 'next/link';

type PlanType = 'standard' | 'advanced' | 'nfp' | 'btc';

interface Plan {
	name: string;
	minDeposit: number;
	maxDeposit: number;
	pips: string;
	commission: string;
}

export default function Pricing() {
	const [activeTab, setActiveTab] = useState<PlanType>('standard');

	const standardPlans = [
		{
			name: 'Premium Plan',
			minDeposit: 10000,
			maxDeposit: 19999,
			pips: '30% - 35%',
			commission: '10%',
		},
		{
			name: 'Ultimate Plan',
			minDeposit: 20000,
			maxDeposit: 49999,
			pips: '35% - 40%',
			commission: '10%',
		},
		{
			name: 'Corporate Plan',
			minDeposit: 50000,
			maxDeposit: 200000,
			pips: '40% - 45%',
			commission: '10%',
		},
	];

	const renderPricingCard = (plan: Plan) => (
		<div
			key={plan.name}
			className='col-sm-6 col-lg-4 col-xxl-3 fadein_bottom_39'
		>
			<div className='pricing-5-card popular text-center'>
				<span className='pricing-5-card-name fs-16 fw-bold clr-neutral-90'>
					{plan.name}
				</span>
				<p className='fs-14 clr-neutral-80 mt-3'>
					Start with ${plan.minDeposit} minimum
				</p>
				<div className='text-center'>
					<h4 className='fw-extrabold mb-0 clr-neutral-90'>
						{plan.pips}
					</h4>
					<div className='clr-neutral-90'>PIPS</div>
				</div>
				<ul className='list gap-4 mt-8'>
					<li>
						<div className='d-flex align-items-center gap-3'>
							<span className='flex-shrink-0 d-grid place-content-center w-4 h-4 rounded-circle border border-neutral-30 clr-neutral-80 fs-10'>
								<i className='bi bi-check2 mt-1'></i>
							</span>
							<span className='d-block fs-14 clr-neutral-80 fw-medium'>
								Minimum Deposit{' '}
								<b className='text-primary'>
									${plan.minDeposit}
								</b>
							</span>
						</div>
					</li>
					<li>
						<div className='d-flex align-items-center gap-3'>
							<span className='flex-shrink-0 d-grid place-content-center w-4 h-4 rounded-circle border border-neutral-30 clr-neutral-80 fs-10'>
								<i className='bi bi-check2 mt-1'></i>
							</span>
							<span className='d-block fs-14 clr-neutral-80 fw-medium'>
								Maximum Deposit{' '}
								<b className='text-primary'>
									${plan.maxDeposit}
								</b>
							</span>
						</div>
					</li>
					<li>
						<div className='d-flex align-items-center gap-3'>
							<span className='flex-shrink-0 d-grid place-content-center w-4 h-4 rounded-circle border border-neutral-30 clr-neutral-80 fs-10'>
								<i className='bi bi-check2 mt-1'></i>
							</span>
							<span className='d-block fs-14 clr-neutral-80 fw-medium'>
								Trade Commission{' '}
								<b className='text-primary'>
									{plan.commission}
								</b>
							</span>
						</div>
					</li>
					<li>
						<div className='d-flex align-items-center gap-3'>
							<span className='flex-shrink-0 d-grid place-content-center w-4 h-4 rounded-circle border border-neutral-30 clr-neutral-80 fs-10'>
								<i className='bi bi-check2 mt-1'></i>
							</span>
							<span className='d-block fs-14 clr-neutral-80 fw-medium'>
								24/7 Customer Support
							</span>
						</div>
					</li>
				</ul>
				<Link
					href='/auth/login'
					className='link pricing-5-card-btn py-2 px-4 fs-14 clr-neutral-80 d-inline-flex align-items-center gap-2 rounded-1 border border-neutral-80 mt-10'
				>
					Purchase Plan <i className='bi bi-arrow-right'></i>
				</Link>
			</div>
		</div>
	);

	return (
		<section className='breadcrumb-section'>
			<div className='breadcrumb-section-inner'>
				<div className='container'>
					<div className='row justify-content-center'>
						<div className='col-xxl-7 col-xl-8 col-md-9'>
							<div className='text-center'>
								<h2 className='h3 fw-bold clr-neutral-90 mt-4'>
									Unleash your trading power with{' '}
									<span className='clr-grad-1'>
										Cavarates
									</span>{' '}
									pricing.
								</h2>
							</div>
						</div>
					</div>
					<div className='pricing- mt-10 d-flex justify-content-center'>
						<ul className='pricing-5-list list list-sm-row align-items-center gap-3 fadeIn_bottom nav nav-tabs'>
							<li className='pricing-btn-5'>
								<button
									type='button'
									className={`nav-link link d-inline-flex py-2 px-3 fs-12 fw-bold clr-neutral-50 border-0 bg-transparent ${
										activeTab === 'standard' ? 'active' : ''
									}`}
									onClick={() => setActiveTab('standard')}
								>
									Standard
								</button>
							</li>
							<li className='pricing-btn-5'>
								<button
									type='button'
									className={`nav-link link d-inline-flex py-2 px-3 fs-12 fw-bold clr-neutral-50 border-0 bg-transparent ${
										activeTab === 'advanced' ? 'active' : ''
									}`}
									onClick={() => setActiveTab('advanced')}
								>
									Advanced
								</button>
							</li>
							<li className='pricing-btn-5'>
								<button
									type='button'
									className={`nav-link link d-inline-flex py-2 px-3 fs-12 fw-bold clr-neutral-50 border-0 bg-transparent ${
										activeTab === 'nfp' ? 'active' : ''
									}`}
									onClick={() => setActiveTab('nfp')}
								>
									NFP
								</button>
							</li>
							<li className='pricing-btn-5'>
								<button
									type='button'
									className={`nav-link link d-inline-flex py-2 px-3 fs-12 fw-bold clr-neutral-50 border-0 bg-transparent ${
										activeTab === 'btc' ? 'active' : ''
									}`}
									onClick={() => setActiveTab('btc')}
								>
									BTC
								</button>
							</li>
						</ul>
					</div>
					<div className='mt-10'>
						<div className='row'>
							<div className='col-lg-12'>
								<div className='tab-content'>
									<div
										className={`tab-pane fade ${
											activeTab === 'standard'
												? 'show active'
												: ''
										}`}
									>
										<div className='row gy-4'>
											{standardPlans.map((plan) =>
												renderPricingCard(plan)
											)}
										</div>
									</div>
									{/* Add other plan tabs similarly */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
