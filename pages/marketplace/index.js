import { useState } from 'react';

import { useWeb3 } from '@components/providers';
import { OrderModal } from '@components/ui/order';
import { BaseLayout } from '@components/ui/layout';
import { Button, Loader } from '@components/ui/common';
import { getAllCourses } from '@content/courses/fetcher';
import { MarketHeader } from '@components/ui/marketplace';
import { CourseList, CourseCard } from '@components/ui/course';
import { useOwnedCourses, useWalletInfo } from '@components/hooks/web3';

export default function Marketplace({ courses }) {
  const { web3, contract, requireInstall } = useWeb3();
  const { hasConnectedWallet, isConnecting, account } = useWalletInfo();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isNewPurchase, setIsNewPurchase] = useState(true);
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  const purchaseCourse = async (order) => {
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);

    // hex course ID:
    // 0x31343130343734000000000000000000

    // address
    // 0xf8929048D74164582E5FA0897fC654CbF0c096C6

    // 31343130343734000000000000000000f8929048D74164582E5FA0897fC654CbF0c096C6

    const orderHash = web3.utils.soliditySha3(
      // Sha3 - is keccak256
      { type: 'bytes16', value: hexCourseId },
      { type: 'address', value: account.data }
    );

    // Order Hash
    // 2e0b409e2bf77ce6466df3990199f3a7377f305fef2c55556a8cae5decbdd0e5

    // const emailHash = web3.utils.sha3(order.email);

    // test@gmail.com
    // af257bcc3cf653863a77012256c927f26d8ab55c5bea3751063d049d0538b902

    // const proof = web3.utils.soliditySha3(
    //   { type: 'bytes32', value: emailHash },
    //   { type: 'bytes32', value: orderHash }
    // );

    // Proof Hash
    // af257bcc3cf653863a77012256c927f26d8ab55c5bea3751063d049d0538b9022e0b409e2bf77ce6466df3990199f3a7377f305fef2c55556a8cae5decbdd0e5

    // proof:
    // b13bdad9cb08b53405c63b05f052a842ec6ab91f6f4239355ff359eb5532b29f

    const value = web3.utils.toWei(String(order.price));

    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email);
      const proof = web3.utils.soliditySha3(
        { type: 'bytes32', value: emailHash },
        { type: 'bytes32', value: orderHash }
      );
      _purchaseCourse(hexCourseId, proof, value);
    } else {
      _repurchaseCourse(orderHash, value);
    }
  };

  const _purchaseCourse = async (hexCourseId, proof, value) => {
    try {
      const result = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });
      console.log(result);
    } catch {
      console.error('Purchase course: Operation has failed.');
    }
  };

  const _repurchaseCourse = async (courseHash, value) => {
    try {
      const result = await contract.methods
        .repurchaseCourse(courseHash)
        .send({ from: account.data, value });
      console.log(result);
    } catch {
      console.error('Purchase course: Operation has failed.');
    }
  };

  return (
    <>
      <MarketHeader />
      <CourseList courses={courses}>
        {(course) => {
          const owned = ownedCourses.lookup[course.id];
          return (
            <CourseCard
              key={course.id}
              course={course}
              state={owned?.state}
              disabled={!hasConnectedWallet}
              Footer={() => {
                if (requireInstall) {
                  return (
                    <Button size="sm" disabled={true} variant="lightPurple">
                      Install
                    </Button>
                  );
                }

                if (isConnecting) {
                  return (
                    <Button size="sm" disabled={true} variant="lightPurple">
                      <Loader size="sm" />
                    </Button>
                  );
                }

                if (!ownedCourses.hasInitialResponse) {
                  return <div style={{ height: '42px' }}></div>;
                }

                if (owned) {
                  return (
                    <>
                      <div className="flex">
                        <Button
                          onClick={() => alert('You are owner of this course.')}
                          disabled={false}
                          size="sm"
                          variant="white"
                        >
                          Purchased &#10004;
                        </Button>
                        {owned.state === 'deactivated' && (
                          <div className="ml-1">
                            <Button
                              size="sm"
                              disabled={false}
                              onClick={() => {
                                setIsNewPurchase(false);
                                setSelectedCourse(course);
                              }}
                              variant="purple"
                            >
                              Fund to Activate
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  );
                }

                return (
                  <Button
                    onClick={() => setSelectedCourse(course)}
                    size="sm"
                    disabled={!hasConnectedWallet}
                    variant="lightPurple"
                  >
                    Purchase
                  </Button>
                );
              }}
            />
          );
        }}
      </CourseList>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          isNewPurchase={isNewPurchase}
          onSubmit={purchaseCourse}
          onClose={() => {
            setSelectedCourse(null);
            setIsNewPurchase(true);
          }}
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
