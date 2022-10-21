import useSWR from 'swr';

import { normalizeOwnedCourse } from '@utils/normalize';

export const handler = (web3, contract) => (courses, account) => {
  const swrRes = useSWR(
    () => (web3 && contract && account ? `web3/ownedCourses/${account}` : null),
    async () => {
      const ownedCourses = [];
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        if (!course.id) {
          continue;
        }
        const ZERO_ADRESS = '0x0000000000000000000000000000000000000000';
        const hexCourseId = web3.utils.utf8ToHex(course.id);
        const courseHash = web3.utils.soliditySha3(
          { type: 'bytes16', value: hexCourseId },
          { type: 'address', value: account }
        );
        const ownedCourse = await contract.methods
          .getCourseByHash(courseHash)
          .call(); // it will not coast any gas

        if (ownedCourse.owner !== ZERO_ADRESS) {
          const normalized = normalizeOwnedCourse(web3)(course, ownedCourse);
          ownedCourses.push(normalized);
        }
      }
      return ownedCourses;
    }
  );

  return swrRes;
};
