// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet{
  uint public noOfFunders;
  mapping(address=>bool) private funders;
  //lookup table, to prevent duplications
  mapping(uint=>address) private lutFunders;

  modifier limitWithdraw(uint withdrawAmount){
    require(withdrawAmount <= 1000000000000000000,"Amount should be less than .1 ether");
    //this under score is the function onwhich you are puting this condition/modifier
    _;
  }

  // //payable means, this function can be used to send the funds
  function addFunds() external payable {
    address addressOfSender = msg.sender;
    if(!funders[addressOfSender]){
      uint index = noOfFunders++;
      funders[addressOfSender] =true;
      lutFunders[index] =addressOfSender;
    }
  }

  function getFunderAtIndex(uint8 index) public view returns(address)  {
      return lutFunders[index];
  }
  function getAllFunders() external view returns(address[] memory) {
    address[] memory _funders = new address[](noOfFunders);
    for (uint256 index = 0; index < noOfFunders; index++) {
      _funders[index] = lutFunders[index];
    }
    return _funders;
  }
  function withdraw(uint withdrawAmount) external limitWithdraw(withdrawAmount){
      payable(msg.sender).transfer(withdrawAmount);
  }

  function test1() external view onlyOwner {
  }
  function test2() external view onlyOwner {
  }

  //private: can only be accessable inside the contract
  //internal: can only be accessable inside the contract & as well in derived smart contract
  // //receive is a function that is called when a trx occured, but you dont specify any function to call
  receive() external payable {}

  function emitLog() public override pure returns(bytes32) {
    return "Hello World";
  }
}
//pure, view - read-only call, no gas free

//veiw: it indicates that func will not change the storage in any way
//pure: it indicates that func will not even read the storage

//Transactions (can generate state changes) and require gas fee
// read-only call, no gas free

//public and external differs in terms of gas usage.
// Public use more gas than the latter when used with large arrays of data. This is due to the fact that Solidity copies arguments to memory on a public function 
// External read from calldata which is cheaper than memory allocation.

 //Calldata is a temporary data location in Solidity. It acts like memory, in terms of its dependence on the function's execution.
 // The variables stored in calldata are only available inside the function they were declared in. On top of that, calldata variables are not modifiable.

//to talk to the nod on the network you need to make json-rpc call