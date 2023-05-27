import { handler as createAccountHook } from './useAccount';
import { handler as createNetworkHook } from './useNetwork';
import { handler as createOwnedCourseHook } from './useOwnedCourse';
import { handler as createOwnedCoursesHook } from './useOwnedCourses';
import { handler as createManagedCoursesHook } from './useManagedCourses';

export const setupHooks = ({ web3, provider, contract }) => {
  return {
    useNetwork: createNetworkHook(web3),
    useAccount: createAccountHook(web3, provider),
    useOwnedCourse: createOwnedCourseHook(web3, contract),
    useOwnedCourses: createOwnedCoursesHook(web3, contract),
    useManagedCourses: createManagedCoursesHook(web3, contract),
  };
};
