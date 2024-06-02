import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsiveBar } from '@nivo/bar';

const CinqueDash = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem('login')
    ? JSON.parse(localStorage.getItem('login')).token
    : '';
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://54.87.28.4/evaluationsByCollab',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
        keys={['evaluationsMoyennes']}
        indexBy="collaboratorName"
        margin={{ top: 50, right: 155, bottom: 60, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear', min: 0, max: 5 }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'set3' }}
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
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Évaluations Moyennes',
          legendPosition: 'middle',
          legendOffset: -40,
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
        ariaLabel="Évaluations Moyennes par Collaborateur"
      />
    </div>
  );
};

export default CinqueDash;
