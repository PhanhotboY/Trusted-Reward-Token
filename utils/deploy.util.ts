export function isPublicNetwork(network: string): boolean {
    const testnetList = ['sepolia', 'hardhat', 'localhost'];
    
    return !testnetList.includes(network);
}