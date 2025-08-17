// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {LocalBasePayment} from "../src/LocalBasePayment.sol";

contract LocalBasePaymentTest is Test {
    LocalBasePayment public payment;
    address public business1 = address(0x1);
    address public customer1 = address(0x2);
    string constant BUSINESS_ID = "test-business-1";
    string constant BUSINESS_NAME = "Test Cafe";

    function setUp() public {
        payment = new LocalBasePayment();
    }

    function test_RegisterBusiness() public {
        vm.prank(business1);
        payment.registerBusiness(BUSINESS_ID, BUSINESS_NAME);
        
        LocalBasePayment.Business memory business = payment.getBusinessInfo(BUSINESS_ID);
        assertEq(business.owner, business1);
        assertEq(business.name, BUSINESS_NAME);
        assertTrue(business.isActive);
        assertEq(business.totalReceived, 0);
        assertEq(business.transactionCount, 0);
    }

    function test_PayBusiness() public {
        // First register business
        vm.prank(business1);
        payment.registerBusiness(BUSINESS_ID, BUSINESS_NAME);
        
        // Customer makes payment
        vm.prank(customer1);
        vm.deal(customer1, 1 ether);
        payment.payBusiness{value: 0.1 ether}(BUSINESS_ID);
        
        LocalBasePayment.Business memory business = payment.getBusinessInfo(BUSINESS_ID);
        assertEq(business.totalReceived, 0.1 ether);
        assertEq(business.transactionCount, 1);
        assertEq(payment.getUserTotalSpent(customer1), 0.1 ether);
    }

    function test_WithdrawPayments() public {
        // Register and pay
        vm.prank(business1);
        payment.registerBusiness(BUSINESS_ID, BUSINESS_NAME);
        
        vm.prank(customer1);
        vm.deal(customer1, 1 ether);
        payment.payBusiness{value: 0.1 ether}(BUSINESS_ID);
        
        uint256 initialBalance = business1.balance;
        
        // Withdraw
        vm.prank(business1);
        payment.withdrawPayments(BUSINESS_ID);
        
        assertEq(business1.balance, initialBalance + 0.1 ether);
        
        LocalBasePayment.Business memory business = payment.getBusinessInfo(BUSINESS_ID);
        assertEq(business.totalReceived, 0);
    }

    function test_FailPayInactiveBusiness() public {
        vm.prank(business1);
        payment.registerBusiness(BUSINESS_ID, BUSINESS_NAME);
        
        vm.prank(business1);
        payment.toggleBusinessStatus(BUSINESS_ID);
        
        vm.prank(customer1);
        vm.deal(customer1, 1 ether);
        vm.expectRevert("Business not active");
        payment.payBusiness{value: 0.1 ether}(BUSINESS_ID);
    }
}
