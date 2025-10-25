// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {BFVaultDemo} from "../src/BFVaultDemo.sol";

contract BFVaultDemoTest is Test {
    BFVaultDemo public bfVaultDemo;
    address public alice = makeAddr("alice");

    function setUp() public {
        bfVaultDemo = new BFVaultDemo();
    }

    function test_Mint() public {
        bfVaultDemo.mint(alice, 1000000000000000000000000);
        assertEq(bfVaultDemo.balanceOf(alice), 1000000000000000000000000);
    }

    function test_SelfMint() public {
        bfVaultDemo.selfMint(1000000000000000000000000);
        assertEq(bfVaultDemo.balanceOf(address(this)), 1000000000000000000000000);
    }
}
