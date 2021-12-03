// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HV is Ownable{
     IERC20 mof;
    
    struct HVStruct{
     address addr;
     uint256 totalPledge;
     uint256 pending;
    }
    
    mapping(address => HVStruct) hvMap;

     constructor(address _addr) {
         mof = IERC20(_addr);
     }

    function pending(uint _pending) external payable{
        HVStruct storage hVStruct = hvMap[msg.sender];
        require(hVStruct.pending != 0,"Not pending");
         require(hVStruct.pending >= _pending,"pending amount not enouth");
        mof.transfer(msg.sender,hVStruct.pending);
        hvMap[msg.sender].pending -= _pending;
    }

    function getPendingItem() external view returns(HVStruct memory){
        return hvMap[msg.sender];
    }

    function setTotalPledge(address _addr,uint _totalPledge) external onlyOwner {
       if(hvMap[_addr].addr == address(0)) {
         hvMap[_addr]=HVStruct(_addr,_totalPledge,0);

       }else {
            hvMap[_addr].totalPledge += _totalPledge;
       }
    }
   function setpending(address _addr,uint _pending) external onlyOwner {
       hvMap[_addr].pending += _pending;
    }

}