'use client';

import { useEffect } from 'react';
import Image from 'next/image';

export default function Testimonials() {
	const testimonials = [
		{
			content:
				"A top support experience. I never experimented this kind of top customer service before. The kindness and the help with my problem was really pleasant. Obviously the trading conditions are top too. I am very happy to finally open my account with Cavarates. I'm very happy and confortable with this broker.",
			author: 'Mark Villomas',
			rating: 5,
		},
		{
			content:
				'I have known this company for a long time. very convenient personal account. The support service answers clearly and helps resolve various work related issues. Trading conditions are very good.',
			author: 'Ufqad Warraich',
			rating: 3,
		},
		{
			content:
				'I spoke with an assistant, who took her time and assisted me. She waited until I was finish which made me comfortable, and her response was very quickly.',
			author: 'Mario',
			rating: 4,
		},
		{
			content:
				"Recently, I had a problem. I reached out to Cavarates' support person and was pleasantly surprised by the overall experience. The representative I spoke with was knowledgeable, friendly, and patient. They took the time to understand my issue completely and offered clear explanations.",
			author: 'Arshad Cervantes',
			rating: 5,
		},
	];

	useEffect(() => {
		// Initialize swiper if needed
		// This would typically be done using the Swiper library
	}, []);

	const renderStars = (rating: number) => {
		return Array(5)
			.fill(0)
			.map((_, index) => (
				<li key={index}>
					<span className='d-inline-block text-warning'>
						<i
							className={`bi bi-star${
								index < rating ? '-fill' : ''
							}`}
						></i>
					</span>
				</li>
			));
	};

	return (
		<div className='faq-section-1 section-space-top section-space-sm-bottom'>
			<div className='section-space-sm-bottom'>
				<div className='container'>
					<div className='row justify-content-center'>
						<div className='col-md-8 col-xl-6'>
							<div className='d-flex justify-content-center align-items-center gap-4 flex-wrap mb-4'>
								<div className='w-30 subtitle-flush-x subtitle-flush-x--secondary subtitle_line_3'></div>
								<h6 className='mb-0 clr-secondary-key fs-18 fadein_1'>
									{' '}
									Customer Reviews{' '}
								</h6>
								<div className='w-30 subtitle-flush-x subtitle-flush-x--secondary subtitle_line_4'></div>
							</div>
							<h3 className='mb-0 clr-neutral-90 text-center animate-line-3d'>
								What Traders Are Saying About Us
							</h3>
						</div>
					</div>
				</div>
			</div>
			<div className='container'>
				<div className='row'>
					<div className='col-12'>
						<div className='swiper faq-1'>
							<div className='swiper-wrapper'>
								{testimonials.map((testimonial, index) => (
									<div
										key={index}
										className='swiper-slide'
									>
										<div className='d-flex flex-column justify-content-between px-8 py-12 rounded-1 border border-neutral-10 h-100'>
											<p className='faq-1__para mb-6 clr-neutral-80'>
												&ldquo;{testimonial.content}
												&rdquo;
											</p>
											<div className='d-flex align-items-center justify-content-between flex-wrap gap-4'>
												<div className='d-flex align-items-center gap-4 flex-wrap'>
													<div className='flex-grow-1'>
														<h6 className='mb-0 fs-18 clr-neutral-80'>
															{testimonial.author}
														</h6>
													</div>
												</div>
												<ul className='list list-row gap-1'>
													{renderStars(
														testimonial.rating
													)}
												</ul>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Image
				src='/resources/landing/assets/img/faq-shape-1.webp'
				alt='FAQ shape 1'
				width={500}
				height={300}
				className='img-fluid faq-section-1__img faq-section-1__img--1'
			/>
			<Image
				src='/resources/landing/assets/img/faq-shape-2.webp'
				alt='FAQ shape 2'
				width={500}
				height={300}
				className='img-fluid faq-section-1__img faq-section-1__img--2'
			/>
		</div>
	);
}
