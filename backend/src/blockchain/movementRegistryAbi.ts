/**
 * Expected Solidity interface for the Movement registry contract.
 *
 * You must deploy a contract matching this ABI:
 * - recordMovement(string uniqueKey, bytes32 movementHash)
 * - getMovementHash(string uniqueKey) view returns (bytes32)
 *
 * If your contract uses different parameter order/names, update this ABI
 * (and the calls in `blockchainService.ts`).
 */
export const movementRegistryAbi = [
  'function recordMovement(string uniqueKey, bytes32 movementHash) external returns (bool)',
  'function getMovementHash(string uniqueKey) external view returns (bytes32)',
];

