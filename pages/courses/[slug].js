import { useWeb3 } from '@components/providers';
import { BaseLayout } from '@components/ui/layout';
import { Message, Modal } from '@components/ui/common';
import { getAllCourses } from '@content/courses/fetcher';
import { useAccount, useOwnedCourse } from '@components/hooks/web3';
import { CourseHero, Curriculum, Keypoints } from '@components/ui/course';

const Course = ({ course }) => {
  const { isLoading } = useWeb3();
  const { account } = useAccount();
  const { ownedCourse } = useOwnedCourse(course, account.data);
  const courseState = ownedCourse.data?.state;
  // const courseState = "deactivated"

  const isLocked =
    !courseState ||
    courseState === 'purchased' ||
    courseState === 'deactivated';

  return (
    <>
      <div className="py-4">
        <CourseHero
          title={course.title}
          image={course.coverImage}
          hasOwner={!!ownedCourse.data}
          description={course.description}
        />
      </div>
      <Keypoints points={course.wsl} />
      {courseState && (
        <div className="max-w-5xl mx-auto">
          {courseState === 'purchased' && (
            <Message type="warning">
              Course is purchased and waiting for the activation. Process can
              take up to 24 hours.
              <i className="block font-normal">
                In case of any questions, please contact info@eincode.com
              </i>
            </Message>
          )}
          {courseState === 'activated' && (
            <Message type="success">
              Eincode wishes you happy watching of the course.
            </Message>
          )}
          {courseState === 'deactivated' && (
            <Message type="danger">
              Course has been deactivated, due the incorrect purchase data. The
              functionality to watch the course has been temporaly disabled.
              <i className="block font-normal">
                Please contact info@eincode.com
              </i>
            </Message>
          )}
        </div>
      )}
      <Curriculum
        locked={isLocked}
        isLoading={isLoading}
        courseState={courseState}
      />
      <Modal />
    </>
  );
};

export function getStaticPaths() {
  const { data } = getAllCourses();

  return {
    paths: data.map((c) => ({
      params: {
        slug: c.slug,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const { data } = getAllCourses();
  const course = data.filter((c) => c.slug === params.slug)[0];

  return {
    props: {
      course,
    },
  };
}

Course.Layout = BaseLayout;

export default Course;
