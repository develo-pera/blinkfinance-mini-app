// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract BFVaultDemo is ERC20 {
    constructor() ERC20("Mock Stablecoin", "MCS") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function selfMint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    function decimals() public view override returns (uint8) {
        return 6;
    }
}
