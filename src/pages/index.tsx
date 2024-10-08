import { Container, Section } from '@radix-ui/themes';
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import { HistoryScoreChart } from '../components/charts';
import { Trigger } from '../components/trigger';
import { Divider } from '@tremor/react';

const data = [
  {
    subject: 'Homepage',
    LCP: 150,
    FCP: 110,
    fullMark: 200,
  },
  {
    subject: 'Content',
    LCP: 199,
    FCP: 130,
    fullMark: 200,
  },
  {
    subject: 'About Us',
    LCP: 186,
    FCP: 130,
    fullMark: 200,
  },
  {
    subject: 'Media Player',
    LCP: 169,
    FCP: 100,
    fullMark: 200,
  },
  {
    subject: 'Gallery',
    LCP: 185,
    FCP: 90,
    fullMark: 200,
  },
  {
    subject: 'History',
    LCP: 85,
    FCP: 45,
    fullMark: 200,
  },
];

const dataSinglePageLoad = {
  nodes: [
    { name: 'Time to Interactive' },
    { name: 'Largest Contentful Paint' },
    { name: 'First Contentful Paint' },
    { name: 'First Input Delay' },
    { name: 'Extra Tasks' },
    { name: 'Network Latency' },
    { name: 'Server Processing' },
    { name: 'Client Rendering' },
    { name: 'Input Delay' },
    { name: 'Interactive Time' },
  ],
  links: [
    { source: 0, target: 1, value: 2700 },
    { source: 1, target: 2, value: 1000 },
    { source: 4, target: 3, value: 30 },
    { source: 0, target: 4, value: 1000 },

    { source: 1, target: 5, value: 1200 },
    { source: 1, target: 7, value: 500 },

    { source: 2, target: 5, value: 700 },
    { source: 2, target: 7, value: 300 },

    { source: 3, target: 8, value: 30 },

    { source: 4, target: 9, value: 1000 },
  ],
};

const Home = () => {
  return (
    <Container>
      <Section size='1'>
        <HistoryScoreChart />
        <Trigger />
        <Divider>Detailed Stats</Divider>
        <div className='flex w-full my-4 flex-col'>
          <h1 className='p-4 text-center'>Latency Distribution</h1>
          <ResponsiveContainer width='100%' height={300} className='m-4'>
            <Sankey
              height={300}
              data={dataSinglePageLoad}
              node={{ stroke: '#2980b9', strokeWidth: 2, fill: '#2980b9' }}
              nodePadding={50}
              margin={{
                left: 50,
                right: 50,
                top: 25,
                bottom: 25,
              }}
              link={{ stroke: '#c0392b' }}
            >
              <Tooltip />
            </Sankey>
          </ResponsiveContainer>
        </div>
        <h1 className='p-4 text-center'>Project Metrics</h1>
        <div className='flex flex-wrap w-full my-4'>
          <div className='flex-1 min-w-[50%] md:min-w-[25%]'>
            <ResponsiveContainer width='100%' height={300} className='m-4'>
              <RadarChart outerRadius={90} width={730} height={250} data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey='subject' />
                <PolarRadiusAxis angle={30} domain={[0, 200]} />
                <Radar name='FCP' dataKey='FCP' stroke='#8884d8' fill='#8884d8' fillOpacity={0.6} />
                <Radar name='LCP' dataKey='LCP' stroke='#82ca9d' fill='#82ca9d' fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className='flex-1 min-w-[100%] md:min-w-[75%]'></div>
        </div>
      </Section>
    </Container>
  );
};

export { Home };
