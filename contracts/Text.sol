// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Test{


    function test(uint num) external pure returns(uint data){
    assembly{
        let _num := 4
        let _fmp := mload(0x40) //mload ->memory load, fmp->free memory pointer, 
        //all the code of solidity is loaded into the memory that you can check at Ethereum IDE

        //offset is that you can specify or intrupt the default location of storying data i.e
        
    }
    assembly{
        //memory store: sore 0x42 on the location of 0x40
        mstore(0x40, 0xd2)
    }

    uint8[3] memory items = [1,2,3];

    //offset is that you can specify or intrupt the default location of storying data i.e
    assembly{
        let hel := 'hello'
        mstore(add(0x90,0x20),hel)
        data := mload(add(0x90,0x20))
    }

        return data;
    }
}