// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Storage{
    uint8 public a = 7; // 1 byte
    // 0x 0f 01 648faad551af1da6d6556f0e3c41b37b6055bad1 000a 07
    //the most right byte(2 bits) are the value of variable in the storage
  uint16 public b = 10; // 2bytes
  address public c = 0x648FaaD551af1DA6d6556f0E3C41B37B6055bAD1; // 20bytes
  bool d = true; // 1 byte
  //'0x0315' this is the code of true stored in the storage
  uint64 public e = 15; // 8bytes
  // 32 bytes, all values will be stored in slot 0

  uint256 public f = 200; // 32bytes -> slot 1

  uint8 public g = 40; // 1byte -> slot 2

  uint256 public h = 789; // 32bytes -> slot 3


}