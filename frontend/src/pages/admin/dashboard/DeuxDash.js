import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import axios from 'axios';

const DeuxDash = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem('login')
    ? JSON.parse(localStorage.getItem('login')).token
    : '';
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://3.88.157.0/userstats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { clientsPercentage, employesPercentage } = response.data;
        setData([
          {
            id: 'Clients',
            label: 'Clients',
            value: parseFloat(clientsPercentage),
          },
          {
            id: 'Employés',
            label: 'Employés',
            value: parseFloat(employesPercentage),
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ height: 400 }}>
      {data && (
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 65, bottom: 80, left: 80 }}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLinkLabelsTextOffset={4}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          defs={[
            {
              id: 'dots',
              type: 'patternDots',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: 'rgba(255, 255, 255, 0.3)',
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            { match: { id: 'Clients' }, id: 'ruby' },
            { match: { id: 'Employés' }, id: 'c' },
          ]}
          colors={{ scheme: 'paired' }}
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
                    itemTextColor: '#000',
                  },
                },
              ],
            },
          ]}
        />
      )}
    </div>
  );
};

export default DeuxDash;
