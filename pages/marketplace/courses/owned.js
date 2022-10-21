import { useRouter } from 'next/router';

import { BaseLayout } from '@components/ui/layout';
import { Button, Message } from '@components/ui/common';
import { OwnedCourseCard } from '@components/ui/course';
import { getAllCourses } from '@content/courses/fetcher';
import { MarketHeader } from '@components/ui/marketplace';
import { useAccount, useOwnedCourses } from '@components/hooks/web3';

export default function OwnedCourses({ courses }) {
  const router = useRouter();
  const { account } = useAccount();
  const { ownedCourses } = useOwnedCourses(courses, account.data);
  return (
    <>
      <MarketHeader />
      <section className="grid grid-cols-1">
        {ownedCourses.data?.map((course) => (
          <OwnedCourseCard key={course.id} course={course}>
            <Button onClick={() => router.push(`/courses/${course.slug}`)}>
              Watch the course
            </Button>
          </OwnedCourseCard>
        ))}
      </section>
    </>
  );
}

export function getStaticProps() {
  const { data } = getAllCourses();
  return {
    props: {
      courses: data,
    },
  };
}

OwnedCourses.Layout = BaseLayout;
