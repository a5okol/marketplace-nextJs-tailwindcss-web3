import { useState } from 'react';
import { toast } from 'react-toastify';

import { withToast } from '@utils/toast';
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
  const [busyCourseId, setBusyCourseId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isNewPurchase, setIsNewPurchase] = useState(true);
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  const purchaseCourse = async (order, course) => {
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

    setBusyCourseId(course.id);

    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email);
      const proof = web3.utils.soliditySha3(
        { type: 'bytes32', value: emailHash },
        { type: 'bytes32', value: orderHash }
      );
      withToast(_purchaseCourse({ hexCourseId, proof, value }, course));
    } else {
      withToast(_repurchaseCourse({ courseHash: orderHash, value }, course));
    }
  };

  const _purchaseCourse = async ({ hexCourseId, proof, value }, course) => {
    try {
      const result = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });

      ownedCourses.mutate([
        ...ownedCourses.data,
        {
          ...course,
          proof,
          state: 'purchased',
          owner: account.data,
          price: value,
        },
      ]);
      return result;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setBusyCourseId(null);
    }
  };

  const _repurchaseCourse = async ({ courseHash, value }, course) => {
    try {
      const result = await contract.methods
        .repurchaseCourse(courseHash)
        .send({ from: account.data, value });
      const index = ownedCourses.data.findIndex((c) => c.id === course.id);

      if (index >= 0) {
        ownedCourses.data[index].state = 'purchased';
        ownedCourses.mutate(ownedCourses.data);
      } else {
        ownedCourses.mutate();
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setBusyCourseId(null);
    }
  };

  const cleanupModal = () => {
    setSelectedCourse(null);
    setIsNewPurchase(true);
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
                const isBusy = busyCourseId === course.id;

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
                  return (
                    <Button variant="white" disabled={true} size="sm">
                      {hasConnectedWallet ? 'Loading State...' : 'Connect'}
                    </Button>
                  );
                }

                if (owned) {
                  return (
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
                            disabled={isBusy}
                            onClick={() => {
                              setIsNewPurchase(false);
                              setSelectedCourse(course);
                            }}
                            variant="purple"
                          >
                            {isBusy ? (
                              <div className="flex">
                                <Loader size="sm" />
                                <div className="ml-2">In Progress</div>
                              </div>
                            ) : (
                              <div>Fund to Activate</div>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="flex flex-row place-content-between items-end">
                    <div className="text-indigo-600">15.00$</div>
                    <Button
                      size="sm"
                      variant="lightPurple"
                      disabled={!hasConnectedWallet || isBusy}
                      onClick={() => setSelectedCourse(course)}
                    >
                      {isBusy ? (
                        <div className="flex">
                          <Loader size="sm" />
                          <div className="ml-2">In Progress</div>
                        </div>
                      ) : (
                        <div>Purchase</div>
                      )}
                    </Button>
                  </div>
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
          onSubmit={(formData, course) => {
            purchaseCourse(formData, course);
            cleanupModal();
          }}
          onClose={cleanupModal}
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
