import { useState } from 'react';

import { Button } from '@components/ui/common';
import { OrderModal } from '@components/ui/order';
import { BaseLayout } from '@components/ui/layout';
import { useWalletInfo } from '@components/hooks/web3';
import { getAllCourses } from '@content/courses/fetcher';
import { MarketHeader } from '@components/ui/marketplace';
import { CourseList, CourseCard } from '@components/ui/course';

export default function Marketplace({ courses }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { canPurchaseCourse } = useWalletInfo();

  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
      <CourseList courses={courses}>
        {(course) => (
          <CourseCard
            key={course.id}
            course={course}
            disabled={!canPurchaseCourse}
            Footer={() => (
              <div className="mt-4">
                <Button
                  variant="lightPurple"
                  disabled={!canPurchaseCourse}
                  onClick={() => setSelectedCourse(course)}
                >
                  Purchase
                </Button>
              </div>
            )}
          />
        )}
      </CourseList>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
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

Marketplace.Layout = BaseLayout;
