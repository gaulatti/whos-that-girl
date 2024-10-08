import { Container, Flex, Heading, Section } from '@radix-ui/themes';
import { DateRangePickerValue, Divider } from '@tremor/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchURLStats, URLStatsResult } from '../../clients/api';
import { CoreWebVitals } from '../../components/foundations/cwv';
import { LighthouseCharts } from '../../components/foundations/lighthouse';
import { Link } from '../../components/foundations/link';
import { ErrorMessage } from '../../components/foundations/message';
import { PulsesTable } from '../../components/foundations/pulses';
import { DateRangeSelector } from '../../components/foundations/selectors/date-range';
import { OverlaySpinner } from '../../components/foundations/spinners';
import { URLNavbar } from '../../components/foundations/url-navbar';
import { WebSocketManager } from '../../engines/sockets';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../components/ui/breadcrumb';

/**
 * URLStats component fetches and displays statistics for a specific URL.
 *
 * This component:
 * - Retrieves the URL UUID from the route parameters.
 * - Manages state for URL statistics, date range, loading, and error states.
 * - Fetches URL statistics when the component mounts or when dependencies change.
 * - Listens for WebSocket messages to refresh the statistics.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const URLStats = (): JSX.Element => {
  /**
   * State to manage the refresh of the URL statistics.
   */
  const [refreshStats, setRefreshStats] = useState(0);

  /**
   * Get the URL UUID from the route parameters.
   */
  const { uuid } = useParams<{ uuid: string }>();

  /**
   * State to hold the result of the URL statistics.
   */
  const [result, setResult] = useState<URLStatsResult | null>(null);

  /**
   * State for the date range selected in the dashboard.
   */
  const [dashboardRange, setDashboardRange] = useState<DateRangePickerValue>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  /**
   * State to manage loading and error states.
   */
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Effect to fetch the URL statistics when the component mounts or when dependencies change.
   */
  useEffect(() => {
    const fetchData = async () => {
      if (uuid) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchURLStats(uuid, dashboardRange);
          if (data) {
            setResult(data);
          }
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [dashboardRange, uuid, refreshStats]);

  /**
   * This useEffect is used to listen to the WebSocketManager for REFRESH_EXECUTIONS_TABLE action
   */
  useEffect(() => {
    WebSocketManager.getInstance().addListener((message: { action: string }) => {
      if (message.action === 'REFRESH_EXECUTIONS_TABLE') {
        setRefreshStats(Math.random());
      }
    });
  }, []);

  return (
    <Container>
      <Section size='1'>
        <Heading as='h1'>URL Statistics</Heading>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to='/'>Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to='/urls'>URLs</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>URL Statistics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {loading && <OverlaySpinner />}

        {error && <ErrorMessage>Error: {error}</ErrorMessage>}

        {result && uuid && (
          <>
            <URLNavbar uuid={uuid} url={result.url} />
            <Divider />
            <Section size='1'>
              <Flex gap='3' justify='between'>
                <DateRangeSelector dateRange={dashboardRange} setDateRange={setDashboardRange} />
              </Flex>
            </Section>
            <Divider />
            <Section size='1'>
              <CoreWebVitals cwvStats={result.cwvStats} />
            </Section>
            <Divider />
            <Section size='1'>
              <LighthouseCharts scores={result.scores} />
            </Section>
            <Section size='1'>
              <Heading as='h2'>Pulses</Heading>
              <PulsesTable urlUUID={uuid} dashboardRange={dashboardRange} />
            </Section>
          </>
        )}
      </Section>
    </Container>
  );
};

export { URLStats };