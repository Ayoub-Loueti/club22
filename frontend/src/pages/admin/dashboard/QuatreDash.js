import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsiveBar } from '@nivo/bar';

const QuatreDash = () => {
    const [data, setData] = useState([]);
    const token = localStorage.getItem('login')
    ? JSON.parse(localStorage.getItem('login')).token
    : '';
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/reservationsCollabs', {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ height: '400px' }}>
            <ResponsiveBar
                data={data}
                keys={['actitviteReservations', 'hotelReservations', 'voyageReservations']}
                indexBy="collaborateur"
                margin={{ top: 50, right: 150, bottom: 60, left: 33 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Collaborateurs',
                    legendPosition: 'middle',
                    legendOffset: 39,
                    
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1,
                                },
                            },
                        ],
                    },
                ]}
                role="application"
                ariaLabel="Total Reservations by Collaborateur"
            />
        </div>
    );
};

export default QuatreDash;
