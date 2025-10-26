// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract BFVaultDemo is ERC20, AccessControl, Ownable {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    mapping(address user => uint256 approvedAmount) public approvedAmounts;
    mapping(address user => uint256 borrowedAmount) public borrowedAmounts;
    mapping(address user => uint256 repaidAmount) public repaidAmounts;

    error CantBorrowMoreThanApproved(uint256 approvedAmount, uint256 borrowedAmount, uint256 requestedAmount);
    error CantRepayMoreThanBorrowed(uint256 borrowedAmount, uint256 repaidAmount, uint256 requestedAmount);

    event ApprovedAmountUpdated(address indexed user, uint256 amount);
    event BorrowedAmountUpdated(address indexed user, uint256 amount);
    event RepaidAmountUpdated(address indexed user, uint256 amount);

    constructor() ERC20("Mock Stablecoin", "MCS") Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function decimals() public view override returns (uint8) {
        return 6;
    }

    function approveAmount(address user, uint256 amount) public onlyRole(MANAGER_ROLE) {
        approvedAmounts[user] = amount;
        emit ApprovedAmountUpdated(user, amount);
    }

    function borrow(address user, uint256 amount) public onlyRole(MANAGER_ROLE) {
        uint256 approvedAmount = approvedAmounts[user];
        uint256 borrowedAmount = borrowedAmounts[user];

        require(approvedAmount >= amount, CantBorrowMoreThanApproved(approvedAmount, borrowedAmount, amount));

        borrowedAmounts[user] += amount;
        _mint(user, amount);
        emit BorrowedAmountUpdated(user, amount);
    }

    function repay(address user, uint256 amount) public {
        uint256 borrowedAmount = borrowedAmounts[user];
        uint256 repaidAmount = repaidAmounts[user];

        require(
            borrowedAmount >= repaidAmount + amount, CantRepayMoreThanBorrowed(borrowedAmount, repaidAmount, amount)
        );

        repaidAmounts[user] += amount;
        _burn(user, amount);
        emit RepaidAmountUpdated(user, amount);
    }
}
