// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";

contract LocalBasePayment {
    struct Business {
        address owner;
        string name;
        bool isActive;
        uint256 totalReceived;
        uint256 transactionCount;
    }
    
    mapping(string => Business) public businesses;
    mapping(string => bool) public businessExists;
    mapping(address => uint256) public userSpent;
    
    event BusinessRegistered(string indexed businessId, address indexed owner, string name);
    event PaymentMade(string indexed businessId, address indexed customer, uint256 amount);
    event PaymentWithdrawn(string indexed businessId, address indexed owner, uint256 amount);
    
    modifier onlyBusinessOwner(string memory businessId) {
        require(businesses[businessId].owner == msg.sender, "Not business owner");
        _;
    }
    
    modifier businessActive(string memory businessId) {
        require(businesses[businessId].isActive, "Business not active");
        _;
    }
    
    function registerBusiness(string memory businessId, string memory name) external {
        require(!businessExists[businessId], "Business already exists");
        require(bytes(name).length > 0, "Name cannot be empty");
        
        businesses[businessId] = Business({
            owner: msg.sender,
            name: name,
            isActive: true,
            totalReceived: 0,
            transactionCount: 0
        });
        
        businessExists[businessId] = true;
        
        emit BusinessRegistered(businessId, msg.sender, name);
    }
    
    function payBusiness(string memory businessId) external payable businessActive(businessId) {
        require(msg.value > 0, "Payment must be greater than 0");
        require(businessExists[businessId], "Business does not exist");
        
        Business storage business = businesses[businessId];
        business.totalReceived += msg.value;
        business.transactionCount += 1;
        
        userSpent[msg.sender] += msg.value;
        
        emit PaymentMade(businessId, msg.sender, msg.value);
    }
    
    function withdrawPayments(string memory businessId) external onlyBusinessOwner(businessId) {
        Business storage business = businesses[businessId];
        uint256 amount = business.totalReceived;
        
        require(amount > 0, "No payments to withdraw");
        
        business.totalReceived = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit PaymentWithdrawn(businessId, msg.sender, amount);
    }
    
    function getBusinessInfo(string memory businessId) external view returns (Business memory) {
        require(businessExists[businessId], "Business does not exist");
        return businesses[businessId];
    }
    
    function toggleBusinessStatus(string memory businessId) external onlyBusinessOwner(businessId) {
        businesses[businessId].isActive = !businesses[businessId].isActive;
    }
    
    function getUserTotalSpent(address user) external view returns (uint256) {
        return userSpent[user];
    }
}
