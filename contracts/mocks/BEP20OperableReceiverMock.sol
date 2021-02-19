// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "../token/BEP20/lib/IBEP20OperableReceiver.sol";

// mock class using IBEP20OperableReceiver
contract BEP20OperableReceiverMock is IBEP20OperableReceiver {
    bytes4 private _retval;
    bool private _reverts;

    event Received(
        address operator,
        address sender,
        uint256 amount,
        bytes data,
        uint256 gas
    );

    constructor(bytes4 retval, bool reverts) {
        _retval = retval;
        _reverts = reverts;
    }

    function onTransferReceived(address operator, address sender, uint256 amount, bytes memory data) public override returns (bytes4) {
        require(!_reverts, "BEP20OperableReceiverMock: throwing");
        emit Received(operator, sender, amount, data, gasleft());
        return _retval;
    }
}
