import { Container, Heading, Section } from '@radix-ui/themes';
import { Link } from '../../components/foundations/link';
import { URLsTable } from '../../components/foundations/urls';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../components/ui/breadcrumb';

const UrlsList = () => {
  return (
    <Container>
      <Section size='1'>
        <Heading as='h1' className='text-left'>
          URLs
        </Heading>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to='/'>Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>URLs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>
      <Section size='1'>
        <URLsTable />
      </Section>
    </Container>
  );
};

export default UrlsList;
