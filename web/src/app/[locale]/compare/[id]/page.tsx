import { getTestResult } from '@/actions';
import { BarChartCompare } from '@/components/bar-chart-generic';
import { title } from '@/components/primitives';
import { base64url } from '@/lib/helpers';
import { DomainComparePage } from './domain';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

interface ComparePageProps {
  params: {
    id: string;
  };
}

type Person = {
  id: string;
  name: string;
};

export default async function ComparePage({
  params: { id }
}: ComparePageProps) {
  const people: Person[] = base64url.decode(id);

  try {
    const reports = await Promise.all(
      people.map(async (person) => {
        const report = await getTestResult(person.id);
        if (!report) throw new Error('No report found');
        return {
          name: person.name,
          report
        };
      })
    );

    const categories = reports[0].report.results.map((result) => result.title);

    const series = reports.map(({ name, report }) => {
      return {
        name,
        data: report.results.map((result) => result.score)
      };
    });
    const getNamedFacets = (domain: string) =>
      reports.map((report) => {
        const domainResult = report.report.results.find(
          (result) => result.domain === domain
        );
        return {
          name: report.name,
          facets: domainResult?.facets
        };
      });

    return (
      <>
        <h1 className={title()}>Overview</h1>
        <BarChartCompare max={120} categories={categories} series={series} />
        {reports[0].report.results.map((domain) => (
          <DomainComparePage
            key={domain.domain}
            title={domain.title}
            shortDescription={domain.shortDescription}
            // @ts-ignore
            domain={getNamedFacets(domain.domain)}
          />
        ))}
      </>
    );
  } catch (error) {
    // Handle build-time database errors gracefully
    console.error('Database error during build:', error);
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px]'>
        <h1 className={title()}>Comparison Unavailable</h1>
        <p className='text-gray-600 mt-4'>
          This comparison requires database access which is not available during
          build time.
        </p>
      </div>
    );
  }
}
