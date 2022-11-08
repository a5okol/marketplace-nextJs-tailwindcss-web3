import useSWR from 'swr';

import { createCourseHash } from '@utils/hash';
import { normalizeOwnedCourse } from '@utils/normalize';

export const handler = (web3, contract) => (course, account) => {
  const swrRes = useSWR(
    () =>
      web3 && contract && account.data && account.isAdmin
        ? `web3/managedCourses/${account.data}`
        : null,
    async () => {
      const courseHash = createCourseHash(web3)(course.id, account);
      const ownedCourse = await contract.methods
        .getCourseByHash(courseHash)
        .call();

      if (ownedCourse.owner === '0x0000000000000000000000000000000000000000') {
        return null;
      }
      return normalizeOwnedCourse(web3)(course, ownedCourse);
    }
  );

  return swrRes;
};
