// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {BFVaultDemo} from "../src/BFVaultDemo.sol";

contract BFVaultDemoScript is Script {
    BFVaultDemo public bfVaultDemo;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        bfVaultDemo = new BFVaultDemo();

        vm.stopBroadcast();
    }
}
