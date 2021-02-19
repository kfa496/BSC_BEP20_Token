// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "../token/BEP20/lib/IBEP20OperableSpender.sol";

// mock class using IBEP20OperableSpender
contract BEP20OperableSpenderMock is IBEP20OperableSpender {
    bytes4 private _retval;
    bool private _reverts;

    event Approved(
        address sender,
        uint256 amount,
        bytes data,
        uint256 gas
    );

    constructor(bytes4 retval, bool reverts) {
        _retval = retval;
        _reverts = reverts;
    }

    function onApprovalReceived(address sender, uint256 amount, bytes memory data) public override returns (bytes4) {
        require(!_reverts, "BEP20OperableSpenderMock: throwing");
        emit Approved(sender, amount, data, gasleft());
        return _retval;
    }
}
