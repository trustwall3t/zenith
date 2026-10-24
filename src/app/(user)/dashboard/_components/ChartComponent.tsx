'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltipContent,
	ChartTooltip,
} from '@/components/ui/chart';

const chartData = [
	{ month: 'January', deposit: 186, withdraw: 80 },
	{ month: 'February', deposit: 305, withdraw: 200 },
	{ month: 'March', deposit: 237, withdraw: 120 },
	{ month: 'April', deposit: 73, withdraw: 190 },
	{ month: 'May', deposit: 209, withdraw: 130 },
	{ month: 'June', deposit: 214, withdraw: 140 },
];

const chartConfig = {
	deposit: {
		label: 'Deposit',
		color: 'green',
	},
	withdraw: {
		label: 'Withdraw',
		color: '#FFA500',
	},
} satisfies ChartConfig;

function ChartComponent() {
	return (
		<ChartContainer
			config={chartConfig}
			className='min-h-[200px] w-full'
		>
			<BarChart
				accessibilityLayer
				data={chartData}
			>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='month'
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<Bar
					dataKey='deposit'
					fill='var(--color-deposit)'
					radius={4}
				/>
				<Bar
					dataKey='withdraw'
					fill='var(--color-withdraw)'
					radius={4}
				/>
			</BarChart>
		</ChartContainer>
	);
}

export default ChartComponent;
