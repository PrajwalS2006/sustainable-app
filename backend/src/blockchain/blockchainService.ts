import { ethers } from 'ethers';
import { movementRegistryAbi } from './movementRegistryAbi';

export type BlockchainMode = 'ethereum' | 'mock';

function getBlockchainMode(): BlockchainMode {
  const mode = (process.env.BLOCKCHAIN_MODE || '').toLowerCase();
  if (mode === 'mock' || mode === 'ethereum') return mode as BlockchainMode;

  // Auto-detect: if required env vars exist -> ethereum, otherwise mock.
  const required = ['BLOCKCHAIN_RPC_URL', 'BLOCKCHAIN_PRIVATE_KEY', 'BLOCKCHAIN_CONTRACT_ADDRESS'];
  const hasAll = required.every((k) => !!process.env[k]);
  return hasAll ? 'ethereum' : 'mock';
}

function ensureEthereumConfig() {
  const required = ['BLOCKCHAIN_RPC_URL', 'BLOCKCHAIN_PRIVATE_KEY', 'BLOCKCHAIN_CONTRACT_ADDRESS'] as const;
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required blockchain env var: ${key}`);
    }
  }
}

export async function recordMovementOnChain(params: {
  uniqueKey: string;
  movementHash: string; // bytes32 hex: 0x....
}): Promise<{ txHash: string; blockNumber?: number; chainId?: number; onChainVerified: boolean }> {
  const blockchainMode = getBlockchainMode();

  if (blockchainMode === 'mock') {
    // In mock mode we still return a txHash placeholder. Controller handles persistence.
    return { txHash: 'mock', onChainVerified: true };
  }

  ensureEthereumConfig();

  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL as string;
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY as string;
  const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS as string;

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, movementRegistryAbi, signer);

  const confirmations = process.env.BLOCKCHAIN_CONFIRMATIONS ? Number(process.env.BLOCKCHAIN_CONFIRMATIONS) : 1;

  const tx = await contract.recordMovement(params.uniqueKey, params.movementHash);
  const receipt = await tx.wait(confirmations);

  const rawChainId = (await provider.getNetwork()).chainId;
  // `chainId` can be bigint depending on ethers/provider version.
  const chainId = typeof rawChainId === 'bigint' ? Number(rawChainId) : (rawChainId as number);
  const verified = await verifyMovementOnChain({
    uniqueKey: params.uniqueKey,
    expectedMovementHash: params.movementHash,
  });

  return {
    txHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    chainId,
    onChainVerified: verified,
  };
}

export async function verifyMovementOnChain(params: {
  uniqueKey: string;
  expectedMovementHash: string;
}): Promise<boolean> {
  const blockchainMode = getBlockchainMode();
  if (blockchainMode === 'mock') return true;

  ensureEthereumConfig();

  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL as string;
  const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS as string;

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, movementRegistryAbi, provider);

  const onChainHash = await contract.getMovementHash(params.uniqueKey);
  // Unset mapping value is typically 0x000..; treat that as unverified.
  const zero = '0x' + '0'.repeat(64);
  if (!onChainHash || onChainHash === zero) return false;

  return String(onChainHash).toLowerCase() === String(params.expectedMovementHash).toLowerCase();
}

