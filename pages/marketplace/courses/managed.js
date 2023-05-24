import { useState } from 'react';
import { withToast } from '@utils/toast';

import { useWeb3 } from '@components/providers';
import { BaseLayout } from '@components/ui/layout';
import { normalizeOwnedCourse } from '@utils/normalize';
import { Button, Message } from '@components/ui/common';
import { MarketHeader } from '@components/ui/marketplace';
import { useAdmin, useManagedCourses } from '@components/hooks/web3';
import { CourseFilter, ManagedCourseCard } from '@components/ui/course';

// BEFORE TX BALANCE -> 85,233893735999999996

// GAS 133009 * 20000000000 -> 2660180000000000 -> 0,00266018

// GAS + VALUE SEND = 0,00266018 + 1 -> 1,00266018

// AFTER TX -> 84,231233556
// AFTER TX -> 84,231233556
//             85,231233556

const VerificationInput = ({ onVerify }) => {
  const [email, setEmail] = useState('');

  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        type="text"
        id="account"
        value={email}
        name="account"
        placeholder="0x2341ab..."
        onChange={({ target: { value } }) => setEmail(value)}
        className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
      />
      <Button
        onClick={() => {
          onVerify(email);
        }}
      >
        Verify
      </Button>
    </div>
  );
};

export default function ManagedCourses() {
  const { web3, contract } = useWeb3();
  const [filters, setFilters] = useState({ state: 'all' });
  const [searchedCourse, setSearchedCourse] = useState(null);
  const [proofedOwnership, setProofedOwnership] = useState({});
  const { account } = useAdmin({ redirectTo: '/marketplace' });
  const { managedCourses } = useManagedCourses(account);

  const verifyCourse = (email, { hash, proof }) => {
    if (!email) {
      return;
    }

    const emailHash = web3.utils.sha3(email);
    const proofToCheck = web3.utils.soliditySha3(
      { type: 'bytes32', value: emailHash },
      { type: 'bytes32', value: hash }
    );

    proofToCheck === proof
      ? setProofedOwnership({
          ...proofedOwnership,
          [hash]: true,
        })
      : setProofedOwnership({
          ...proofedOwnership,
          [hash]: false,
        });
  };

  const changeCourseState = async (courseHash, method) => {
    try {
      const result = await contract.methods[method](courseHash).send({
        from: account.data,
      });
      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const activateCourse = async (courseHash) => {
    withToast(changeCourseState(courseHash, 'activateCourse'));
  };

  const deactivateCourse = async (courseHash) => {
    withToast(changeCourseState(courseHash, 'deactivateCourse'));
  };

  const searchCourse = async (hash) => {
    const re = /[0-9A-Fa-f]{6}/g;

    if (hash && hash.length === 66 && re.test(hash)) {
      const course = await contract.methods.getCourseByHash(hash).call();
      if (course.owner !== '0x0000000000000000000000000000000000000000') {
        const normalized = normalizeOwnedCourse(web3)({ hash }, course);
        setSearchedCourse(normalized);
        return;
      }
    }

    setSearchedCourse(null);
  };

  const renderCard = (course, isSearched) => {
    return (
      <ManagedCourseCard
        key={course.ownedCourseId}
        isSearched={isSearched}
        course={course}
      >
        <VerificationInput
          onVerify={(email) => {
            verifyCourse(email, {
              hash: course.hash,
              proof: course.proof,
            });
          }}
        />
        {proofedOwnership[course.hash] && (
          <div className="mt-2">
            <Message>Verified!</Message>
          </div>
        )}
        {proofedOwnership[course.hash] === false && (
          <div className="mt-2">
            <Message type="danger">Wrong Proof!</Message>
          </div>
        )}
        {course.state === 'purchased' && (
          <div className="mt-2">
            <Button onClick={() => activateCourse(course.hash)} variant="green">
              Activate
            </Button>
            <Button onClick={() => deactivateCourse(course.hash)} variant="red">
              Deactivate
            </Button>
          </div>
        )}
      </ManagedCourseCard>
    );
  };

  if (!account.isAdmin) {
    return null;
  }

  const filteredCourses = managedCourses.data
    ?.filter((course) => {
      if (filters.state === 'all') {
        return true;
      }

      return course.state === filters.state;
    })
    .map((course) => renderCard(course));

  return (
    <>
      <MarketHeader />
      <CourseFilter
        onSearchSubmit={searchCourse}
        onFilterSelect={(value) => setFilters({ state: value })}
      />
      <section className="grid grid-cols-1">
        {searchedCourse && (
          <div>
            <h1 className="text-2xl font-bold p-5">Search</h1>
            {renderCard(searchedCourse, true)}
          </div>
        )}
        <h1 className="text-2xl font-bold p-5">All Courses</h1>
        {filteredCourses}
        {filteredCourses?.length === 0 && (
          <Message type="warning">No courses to display</Message>
        )}
      </section>
    </>
  );
}

// 94.6367 ETH

ManagedCourses.Layout = BaseLayout;
