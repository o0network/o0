// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.27;

import {Script, console} from "forge-std/Script.sol";
import {EthDonations} from "../src/EthDonations.sol";

contract EthDonationsScript is Script {
    EthDonations public d;
    address public owner = 0x2FF6a90161E0aBF3e374c7B577d62d1cfE631c5C;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        d = new EthDonations(1000 ether, block.timestamp + 90 days, owner);

        vm.stopBroadcast();
    }
}
