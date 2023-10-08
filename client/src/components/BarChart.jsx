    import React from 'react';
    import ReactApexChart from 'react-apexcharts';

    const BarChart = ({categories, series }) => {
        const chartOptions = {
            chart: {
                type: 'bar',
                toolbar: {
                    show: true,
                },
            },
            plotOptions: {
                bar: {
                        horizontal: false,
                        borderRadius: 10,
                        columnWidth: 50,
                },
            },
            xaxis: {
                categories: categories,
                labels: {
                    rotate: -45,
                    margin: 23,
                    style: {
                        fontSize: '12px',
                    },
                },
                
            },
            tooltip: {
                enabled: true,
                style: {
                    fontSize: '14px',
                },
                y: {
                    formatter: function (val) {
                        return val;
                    },
                },
            },
            fill: {
                colors: ['#00a2ff'],
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val;
                },
                offsetY: -1,
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    colors: ['#fff'],
                },
            },
            // title: {
            //     text: 'Employee Data Entries by Month',
            //     align: 'center',
            //     margin: 20,
            //     offsetY: 20,
            //     style: {
            //         fontSize: '30px',
            //         fontWeight: 'bold',
            //         color: '#6b7280',
            //         TextDecoder: ''
            //     },
            // },
        };

        return (
            <div className="sm:w-[90%] w-full z-[0] mx-5 sm:mx-0 mt-3 transition-all ">
                <ReactApexChart
                    series={series}
                    type='bar'
                    height={500}
                    options={chartOptions}
                    
                />
            </div>
        );
    };

    export default BarChart;
