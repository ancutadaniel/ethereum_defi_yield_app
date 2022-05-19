// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Dai.sol";
import "./Dacether.sol";

contract TokenFarm {
    address public owner;
    string public name = "Token Farm";    

    Dacether public dacether;
    Dai public dai;

    // track the stakers address
    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaking;
    mapping(address => bool) public isStaking;

    event Received(address, uint);

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this!");    
        _;
    }
    
    constructor(Dacether _dacether, Dai _dai) {
        owner = msg.sender;
        // store a reference to the dai token and the dacether token stored to the network
        dacether = _dacether;
        dai = _dai;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    // 1. Stakes Tokens (Deposit)
    function stakeTokens(uint _amount) public  {
        // require amount greter than 0
        require(_amount > 0, 'amount should be greater than 0'); 
        // transfer dai to this contract for staking
        dai.transferFrom(msg.sender, address(this), _amount); 
        // update staking balance       
        stakingBalance[msg.sender] += _amount;
        // add user to stakers array only if they haven't staked already
        require(!hasStaking[msg.sender], 'Already staking');
        stakers.push(msg.sender);
        // update staking balance
        isStaking[msg.sender] = true;
        hasStaking[msg.sender] = true;

    }

    // 2. Unstakes Tokens (Withdraw)
    function unstackedTokens() public {
        require(stakingBalance[msg.sender] > 0, 'can not unstake');
        // get balance
        uint amount = stakingBalance[msg.sender];
        // transfer to the user
        dai.transfer(msg.sender, amount);

        stakingBalance[msg.sender] = 0;
       
        isStaking[msg.sender] = false;
        hasStaking[msg.sender] = false;
    }
    
    // 3. Issuing Tokens (call by owner)
    function issueTokens() public onlyOwner {
        // for each staker issue token
        for(uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint amount = stakingBalance[recipient];
            if(amount > 0) dacether.transfer(recipient, amount);
        }
    }
}