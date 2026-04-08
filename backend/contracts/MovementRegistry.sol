// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Minimal movement registry used by the backend.
 *
 * Off-chain:
 *  - backend computes a deterministic movementHash (sha256/canonical JSON)
 *  - backend submits (uniqueKey, movementHash) to the chain
 *
 * On-chain:
 *  - each uniqueKey is recorded exactly once (tamper-proof uniqueness)
 *  - getMovementHash allows the backend/frontend to verify authenticity
 */
contract MovementRegistry {
    // uniqueKeyHash => movementHash
    mapping(bytes32 => bytes32) public movementHashByKey;

    event MovementRecorded(bytes32 indexed keyHash, bytes32 movementHash, address indexed signer, uint256 timestamp);

    function _keyHash(string calldata uniqueKey) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(uniqueKey));
    }

    /**
     * Record a movement hash.
     * @dev uniqueKey must be recorded once; calling again will revert.
     */
    function recordMovement(string calldata uniqueKey, bytes32 movementHash) external returns (bool) {
        bytes32 keyHash = _keyHash(uniqueKey);
        require(movementHashByKey[keyHash] == bytes32(0), "already recorded");
        require(movementHash != bytes32(0), "invalid movementHash");

        movementHashByKey[keyHash] = movementHash;
        emit MovementRecorded(keyHash, movementHash, msg.sender, block.timestamp);
        return true;
    }

    /**
     * Verify what hash the chain recorded for a given movement uniqueKey.
     */
    function getMovementHash(string calldata uniqueKey) external view returns (bytes32) {
        return movementHashByKey[_keyHash(uniqueKey)];
    }
}

