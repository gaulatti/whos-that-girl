import { Container, Flex, Heading, Link as RadixLink, Section, Separator, Skeleton } from '@radix-ui/themes';
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import React2LighthouseViewer from 'react2-lighthouse-viewer';
import { Method, useAPI } from '../../clients/api';
import { Link } from '../../components/foundations/link';
import { OverlaySpinner } from '../../components/foundations/spinners';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '../../components/ui/breadcrumb';

const ExecutionDetails = () => {
  const { uuid } = useParams();
  const { pathname } = useLocation();

  const viewportMode = useMemo(() => {
    return pathname.split('/').pop();
  }, [pathname]);

  const { data, loading } = useAPI(Method.GET, [], `pulses/${uuid}/${viewportMode}`);
  const { data: dataJson } = useAPI(Method.GET, [], `pulses/${uuid}/${viewportMode}/json`);
  const { data: dataJsonMinified } = useAPI(Method.GET, [], `pulses/${uuid}/${viewportMode}/json?minified`);

  /**
   * The parsed report data from the API response.
   */
  const report = useMemo(() => {
    return data ? JSON.parse(data.report) : null;
  }, [data]);

  return (
    <Container>
      <Section size='1'>
        <Heading as='h1' className='text-left'>
        Pulse Detail
        </Heading>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to='/'>Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to='/pulses'>Pulses</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{uuid}</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <b>Results ({viewportMode})</b>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section className='my-4'>
          {loading && <OverlaySpinner />}
          <Section size='2'>
            <Flex gap='3' justify='center'>
              {dataJson && dataJsonMinified ? (
                <Flex gap='3' align='center'>
                  <RadixLink href={dataJson.signedUrl} target='_blank'>
                    Download Original JSON
                  </RadixLink>
                  <Separator orientation='vertical' />
                  <RadixLink href={dataJsonMinified.signedUrl} target='_blank'>
                    Download Simplified JSON
                  </RadixLink>
                </Flex>
              ) : (
                <Skeleton aria-label='Loading Content' />
              )}
            </Flex>
          </Section>
          {report ? <React2LighthouseViewer json={report} /> : <></>}
        </section>
      </Section>
    </Container>
  );
};
export { ExecutionDetails };