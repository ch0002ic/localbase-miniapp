// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {LocalBasePayment} from "../src/LocalBasePayment.sol";

contract LocalBasePaymentScript is Script {
    LocalBasePayment public localBasePayment;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        localBasePayment = new LocalBasePayment();

        console.log("LocalBasePayment deployed to:", address(localBasePayment));
        console.log("Deployer address:", vm.addr(deployerPrivateKey));
        console.log("Gas used for deployment:", gasleft());

        vm.stopBroadcast();
        
        // Save deployment info
        console.log("==== DEPLOYMENT SUCCESSFUL ====");
        console.log("Contract Address:", address(localBasePayment));
        console.log("Network: Base Sepolia");
        console.log("Verification command:");
        console.log("forge verify-contract", address(localBasePayment), "src/LocalBasePayment.sol:LocalBasePayment --chain base-sepolia");
    }
}
