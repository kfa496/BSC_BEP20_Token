// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "./lib/BEP20Mintable.sol";
import "./lib/BEP20Burnable.sol";
import "./lib/BEP20Operable.sol";

import "../../utils/TokenRecover.sol";

import "../../service/ServicePayer.sol";

/**
 * @title AmazingBEP20
 * @dev Implementation of the AmazingBEP20
 */
contract AmazingBEP20 is BEP20Mintable, BEP20Burnable, BEP20Operable, TokenRecover, ServicePayer {

    constructor (
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialBalance,
        address payable feeReceiver
    )
      BEP20Operable(name, symbol)
      ServicePayer(feeReceiver, "AmazingBEP20")
      payable
    {
        _setupDecimals(decimals);
        _mint(_msgSender(), initialBalance);
    }

    /**
     * @dev Function to mint tokens.
     *
     * NOTE: restricting access to owner only. See {BEP20Mintable-mint}.
     *
     * @param account The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function _mint(address account, uint256 amount) internal override onlyOwner {
        super._mint(account, amount);
    }

    /**
     * @dev Function to stop minting new tokens.
     *
     * NOTE: restricting access to owner only. See {BEP20Mintable-finishMinting}.
     */
    function _finishMinting() internal override onlyOwner {
        super._finishMinting();
    }
}
