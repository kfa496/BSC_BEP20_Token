// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "./lib/BEP20.sol";

import "../../service/ServicePayer.sol";
import "../../utils/GeneratorCopyright.sol";

/**
 * @title TestBEP20
 * @author BEP20 Generator (https://vittominacori.github.io/bep20-generator)
 * @dev Implementation of the TestBEP20
 */
contract TestBEP20 is BEP20, ServicePayer, GeneratorCopyright("v1.3.0") {

    constructor (
        string memory name,
        string memory symbol,
        address payable feeReceiver
    )
        BEP20(name, symbol)
        ServicePayer(feeReceiver, "TestBEP20")
        payable
    {
        _mint(_msgSender(), 100000e18);
    }
}
