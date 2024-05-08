import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import axios from 'axios';

const UneDash = () => {
    const [data, setData] = useState(null);
    const token = localStorage.getItem('login')
    ? JSON.parse(localStorage.getItem('login')).token
    : '';
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/adherentstats', {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                const { adherentPercentage, nonAdherentPercentage } = response.data;
                setData([
                    { id: 'Adhérents', label: 'Adhérents', value: parseFloat(adherentPercentage) },
                    { id: 'Non Adhérents', label: 'Non Adhérents', value: parseFloat(nonAdherentPercentage) },
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ height: 400 }}>
            {data && <ResponsivePie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'accent' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    { match: { id: 'Adhérents' }, id: 'dots' },
                    { match: { id: 'Non Adhérents' }, id: 'dots' }
                ]}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000'
                                }
                            }
                        ]
                    }
                ]}
            />}
        </div>
    );
};

export default UneDash;
