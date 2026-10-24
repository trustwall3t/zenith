const TradingNews = () => {
	const widgetConfig = {
		feedMode: 'all_symbols',
		isTransparent: false,
		displayMode: 'regular',
		width: '100%',
		height: '100%',
		colorTheme: 'light',
		locale: 'en',
	};

	return (
		<div className='tradingview-widget-container'>
			<div className='tradingview-widget-container__widget'></div>
			
			<script
				type='text/javascript'
				src='https://s3.tradingview.com/external-embedding/embed-widget-timeline.js'
				async
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(widgetConfig),
				}}
			/>
		</div>
	);
};

export default TradingNews;
