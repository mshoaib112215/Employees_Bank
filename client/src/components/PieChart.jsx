import React from 'react';
import ReactApexChart from 'react-apexcharts';

const DistributedBarChart = ({ categories, values }) => {
    const categoryRowHeight = 60; // Adjust this value as needed
    let calculatedHeight = categories.length * categoryRowHeight;
    if(categories.length == 1){
        calculatedHeight = 105
    }
    const chartOptions = {
        chart: {
            type: 'bar',
            // height: 300, // Adjust the height value as needed
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 10,
                // columnWidth: 10,
                // barHeight: 25
            },
        },
        xaxis: {
            categories: categories,
        },
        fill: {
            colors: ['#00a2ff'],
        },
        // title: {
        //     text: 'Employee Categories Distribution',
        //     align: 'center',
        //     margin: 50,
        //     offsetY: 20,
        //     style: {
        //         fontSize: '30px',
        //         fontWeight: 'bold',
        //         color: '#6b7280',
        //     },
        // },
    };

    const chartSeries = [
        {
            name: 'Count',
            data: values,
        },
    ];

    return (
        <div className="sm:w-[90%] w-full flex-1 -z-3">
            <div className="mt-3 h-[300px] md:h-auto w-full" style={{ height: 'auto' }}>
                <ReactApexChart
                    series={chartSeries}
                    type="bar"
                    height={calculatedHeight}
                    options={chartOptions}
                />
            </div>
        </div>
    );
};

export default DistributedBarChart;
