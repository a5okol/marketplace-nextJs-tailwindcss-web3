// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketplace {
  enum State {
    Purchased,
    Activated,
    Deactivated
  }

  struct Course {
    uint id; // 32
    uint price; // 32
    bytes32 proof; // 32
    address owner; // 20
    State state; // 1
  }

  bool public isStopped = false;

  modifier onlyWhenNotStopped {
    require(!isStopped);
    _; //  is used inside a modifier to specify when the function should be executed. A modifier is a piece of code that manipulates the execution of a function. The _; instruction can be called before and after the call of the function.
  }

  modifier onlyWhenStopped {
    require(isStopped);
    _;
  }

  receive() external payable {}

  function withdraw(uint amount)
    external
    onlyOwner
  {
    (bool success, ) = owner.call{value: amount}(""); 
    require(success, "Transfer failed."); // require for fanction! if success is false, then status is Transfer failed
  }

  function emergencyWithdraw()
    external
    onlyWhenStopped
    onlyOwner
  {
    (bool success, ) = owner.call{value: address(this).balance}("");
    require(success, "Transfer failed."); // require for fanction! if success is false, then status is Transfer failed
  }

  function selfDestruct() 
    external
    onlyWhenStopped
    onlyOwner
  { // destract the contract and send all the money to the owner
    selfdestruct(owner);
  }

  function stopContract()
    external
    onlyOwner
  {
    isStopped = true;
  }

  function resumeContract()
    external
    onlyOwner
  {
    isStopped = false;
  }

  // mapping of courseHash to Course data
  mapping(bytes32 => Course) private ownedCourses;

  // mapping of courseID to courseHash
  mapping(uint => bytes32) private ownedCourseHash;

  // number of all courses + id of the course
  uint private totalOwnedCourses;

  address payable private owner;

  constructor() {
    setContractOwner(msg.sender);
  }

  /// Course has invalid state!
  error InvalidState();

  /// Course is not created!
  error CourseIsNotCreated();

  /// Course has already a Owner!
  error CourseHasOwner();

  /// Sender is not course owner!
  error SenderIsNotCourseOwner();

  /// Only owner has an access!
  error OnlyOwner();

  modifier onlyOwner() {
    if (msg.sender != getContractOwner()) {
      revert OnlyOwner();
    }
    _;
  }

  function purchaseCourse(
    bytes16 courseId, // 0x00000000000000000000000000003130
    bytes32 proof // 0x0000000000000000000000000000313000000000000000000000000000003130
  )
    external
    payable
    onlyWhenNotStopped
  {
    // course id - 10
    // 0x00000000000000000000000000003130 // - value of the 10 in hexdecimal format (ASCII to HEX) (16 bytes)
    // 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
    // 000000000000000000000000000031305B38Da6a701c568545dCfcB03FcB875f56beddC4
    // keccak256 - c4eaa3558504e2baa2669001b43f359b8418b44a4477ff417b4b007d7cc86e37
              // - c4eaa3558504e2baa2669001b43f359b8418b44a4477ff417b4b007d7cc86e37
    bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender)); // u need to use encodePacked if you want to hash multiple values

    if (hasCourseOwnership(courseHash)) {
      revert CourseHasOwner();
    }

    uint id = totalOwnedCourses++;

    ownedCourseHash[id] = courseHash;
    ownedCourses[courseHash] = Course({
      id: id,
      proof: proof,
      price: msg.value,
      owner: msg.sender,
      state: State.Purchased
    });
  }

  function repurchaseCourse(bytes32 courseHash)
    external
    payable
    onlyWhenNotStopped
  {
    if (!isCourseCreated(courseHash)) {
      revert CourseIsNotCreated();
    }

    if (!hasCourseOwnership(courseHash)) {
      revert SenderIsNotCourseOwner();
    }

    Course storage course = ownedCourses[courseHash];

    if (course.state != State.Deactivated) {
      revert InvalidState();
    }

    course.state = State.Purchased;
    course.price = msg.value;
  }

  function activateCourse(bytes32 courseHash)
    external
    onlyOwner
    onlyWhenNotStopped
  {
    if (!isCourseCreated(courseHash)) {
      revert CourseIsNotCreated();
    }

    Course storage course = ownedCourses[courseHash];

    if (course.state != State.Purchased) {
      revert InvalidState();
    }

    course.state = State.Activated;
  }

  function deactivateCourse(bytes32 courseHash)
    external
    onlyWhenNotStopped
    onlyOwner
  {
    if (!isCourseCreated(courseHash)) {
      revert CourseIsNotCreated();
    }

    Course storage course = ownedCourses[courseHash];

    if (course.state != State.Purchased) {
      revert InvalidState();
    }

    // after the comma comes data, but we don't need it here
    // here we return the ethers to the owner
    (bool success, ) = course.owner.call{value: course.price}(""); 

    require(success, "Transfer failed!");

    course.state = State.Deactivated;
    course.price = 0;
  }

  function transferOwnership(address newOwner)
    external
    onlyOwner
  {
    setContractOwner(newOwner);
  }

  function getCourseCount()
    external
    view
    returns (uint)
  {
    return totalOwnedCourses;
  }

  function getCourseHashAtIndex(uint index)
    external
    view
    returns (bytes32)
  {
    return ownedCourseHash[index];
  }

  function getCourseByHash(bytes32 courseHash)
    external
    view
    returns (Course memory)
  {
    return ownedCourses[courseHash];
  }

  function getContractOwner()
    public
    view
    returns (address)
  {
    return owner;
  }

  function setContractOwner(address newOwner) private {
    owner = payable(newOwner);
  }

  function isCourseCreated(bytes32 courseHash)
    private
    view
    returns (bool)
  {
    return ownedCourses[courseHash].owner != 0x0000000000000000000000000000000000000000;
  }

  function hasCourseOwnership(bytes32 courseHash)
    private
    view
    returns (bool)
  {
    return ownedCourses[courseHash].owner == msg.sender;
  }
}
