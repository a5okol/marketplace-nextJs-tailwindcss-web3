import { Hero } from '@components/ui/common';
import { BaseLayout } from '@components/ui/layout';
import { getAllCourses } from '@content/courses/fetcher';
import { CourseList, CourseCard } from '@components/ui/course';

const Home = ({ courses }) => {
  return (
    <>
      <Hero />
      <CourseList courses={courses}>
        {(course) => <CourseCard key={course.id} course={course} />}
      </CourseList>
    </>
  );
};

export function getStaticProps() {
  const { data } = getAllCourses();
  return {
    props: {
      courses: data,
    },
  };
}

Home.Layout = BaseLayout;

export default Home;
