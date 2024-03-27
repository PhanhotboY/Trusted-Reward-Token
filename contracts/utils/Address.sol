// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library Address {
    function isContract(address addr) internal view returns (bool) {
        /**
         * @notice Without EOA check, this method can be fooled
         * See: https://ethereum.stackexchange.com/a/64340
         *
         * @dev EOA: Externally Owned Account
         */
        // require(tx.origin == msg.sender, "Not EOA");

        uint32 size;
        assembly {
            size := extcodesize(addr)
        }

        return size > 0;
    }

    function isNotZeroAddress(address addr) internal pure returns (bool) {
        return addr != address(0);
    }
}
