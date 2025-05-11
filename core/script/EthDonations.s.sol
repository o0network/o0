// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {EthDonations} from "../src/EthDonations.sol";

contract EthDonationsScript is Script {
    EthDonations public d;
    address public owner = 0xE73EaFBf9061f26Df4f09e08B53c459Df03E2b66;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        d = new EthDonations(1000 ether, block.timestamp + 90 days, owner);

        vm.stopBroadcast();
    }
}
