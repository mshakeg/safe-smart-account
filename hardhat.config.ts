import type { HardhatUserConfig, HttpNetworkUserConfig, NetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import "hardhat-deploy";
import dotenv from "dotenv";
import yargs from "yargs";
import { getSingletonFactoryInfo, SingletonFactoryInfo } from "@gnosis.pm/safe-singleton-factory";
import "@nomiclabs/hardhat-etherscan";

const argv = yargs
  .option("network", {
    type: "string",
    default: "hardhat",
  })
  .help(false)
  .version(false).argv;

// Load environment variables.
dotenv.config();
const { NODE_URL, INFURA_KEY, MNEMONIC, ETHERSCAN_API_KEY, PK, SOLIDITY_VERSION, SOLIDITY_SETTINGS, CUSTOM_DETERMINISTIC_DEPLOYMENT } = process.env;

const infuraApiKey: string | undefined = process.env.INFURA_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_KEY in a .env file");
}

const DEFAULT_MNEMONIC =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

const sharedNetworkConfig: HttpNetworkUserConfig = {};
if (PK) {
  sharedNetworkConfig.accounts = [PK];
} else {
  sharedNetworkConfig.accounts = {
    mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
  };
}

if (["mainnet", "rinkeby", "kovan", "goerli"].includes(argv.network) && INFURA_KEY === undefined) {
  throw new Error(
    `Could not find Infura key in env, unable to connect to network ${argv.network}`,
  );
}

import "./src/tasks/local_verify"
import "./src/tasks/deploy_contracts"
import "./src/tasks/show_codesize"
import { BigNumber } from "@ethersproject/bignumber";

const primarySolidityVersion = SOLIDITY_VERSION || "0.7.6"
const soliditySettings = !!SOLIDITY_SETTINGS ? JSON.parse(SOLIDITY_SETTINGS) : undefined

enum SupportedChainId {
  ETHEREUM_MAINNET = 1,
  OPTIMISM_MAINNET = 10,
  BSC_MAINNET = 56,
  FUSE_MAINNET = 122,
  POLYGON_MAINNET = 137,
  X1_TESTNET = 195,
  OPBNB_MAINNET = 204,
  FANTOM_MAINNET = 250,
  FANTOM_TESTNET = 4002,
  FANTOM_SONIC = 64165,
  ZKSYNC_TESTNET = 280,
  ZKSYNC_MAINNET = 324,
  HEDERA_MAINNET = 295,
  HEDERA_TESTNET = 296,
  POLYGON_ZKEVM = 1101,
  GANACHE = 1337,
  KAVA_MAINNET = 2222,
  MANTLE_MAINNET = 5000,
  HORIZEN_MAINNET = 7332,
  BASE_MAINNET = 8453,
  EVMOS_MAINNET = 9001,
  ARTHERA_MAINNET = 10242,
  ARTHERA_TESTNET = 10243,
  HARDHAT = 31337,
  ARBITRUM_MAINNET = 42161,
  CELO_MAINNET = 42220,
  AVALANCHE_MAINNET = 43114,
  LINEA_MAINNET = 59144,
  POLYGON_MUMBAI = 80001,
  BLAST_MAINNET = 81457,
  TAIKO_HEKLA = 167009,
  SCROLL_MAINNET = 534352,
  SEPOLIA = 11155111,
  BLAST_SEPOLIA = 168587773,
};

function isValidChainId(value: number | undefined): value is SupportedChainId {
  return value !== undefined && Object.values(SupportedChainId).includes(value);
};

enum CustomNetworks {
  HORIZEN_MAINNET = SupportedChainId.HORIZEN_MAINNET,
  X1_TESTNET = SupportedChainId.X1_TESTNET,
  HEDERA_TESTNET = SupportedChainId.HEDERA_TESTNET,
  HEDERA_MAINNET = SupportedChainId.HEDERA_MAINNET,
  OPBNB_MAINNET = SupportedChainId.OPBNB_MAINNET,
  ARTHERA_MAINNET = SupportedChainId.ARTHERA_MAINNET,
  ARTHERA_TESTNET = SupportedChainId.ARTHERA_TESTNET,
  BLAST_MAINNET = SupportedChainId.BLAST_MAINNET,
  BLAST_SEPOLIA = SupportedChainId.BLAST_SEPOLIA,
};

const ACTIVE_CUSTOM_NETWORK = SupportedChainId.ARTHERA_TESTNET;

export const SAFE_SINGLETON_FACTORIES: Record<CustomNetworks, SingletonFactoryInfo> = {
  [SupportedChainId.HORIZEN_MAINNET]: {
    gasPrice: 500000000000,
    gasLimit: 95383,
    signerAddress: "0xE1CB04A0fA36DdD16a06ea828007E35e1a3cBC37",
    transaction: "0xf8a78085746a528800830174978080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf382396ba06efa20cb1594f958a7976ed88c97ba7bb8304cee81a3102e2e9948b7d45cee7ea0482fa4b926a2920effd569a50757589cee03509631397c6f14970896a66614c8",
    address: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7"
  },
  [SupportedChainId.HEDERA_TESTNET]: {
    gasPrice: 1770000000000,
    gasLimit: 84472,
    signerAddress: "0xE1CB04A0fA36DdD16a06ea828007E35e1a3cBC37",
    transaction: "0xf8a88086019c1c38a400830149f88080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3820273a0643f821328556c0a64ceb550b926d1c35eb38285086042f1856b018e2696d8b2a052291d2b40968efc09c3e395d9e1c9e34437a1502be6031437fe0ba2d100baa9",
    address: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7"
  },
  [SupportedChainId.OPBNB_MAINNET]: {
    gasPrice: 10,
    gasLimit: 95383,
    signerAddress: "0xE1CB04A0fA36DdD16a06ea828007E35e1a3cBC37",
    transaction: "0xf8a2800a830174978080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf38201bca0321c2231ac15b3a45c6e7cca4f6686706ebe4d926fae78c3cb9f2d354d874731a05c4a31c24a88d43af57c77f1020c933e51091f0cd30fd59c40af9a5a5a290c89",
    address: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7"
  },
  [SupportedChainId.HEDERA_MAINNET]: {
    gasPrice: 1190000000000,
    gasLimit: 86279,
    signerAddress: "0x4403B424EA406b9FBB8BF1169e8447f658Cd776b",
    transaction: "0xf8a8808601151186fc00830151078080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3820271a04070bb9d593282a2635991e8f920cc0f28275b6125b45455e8ea8eb5bbdb12c6a0343f63c339dfdebe92bd21210dd4571a9265e96b8562efb5dc330f3392865faa",
    address: "0x30135e8e81AFB9AD45F74DB735D197463A13942a"
  },
  [SupportedChainId.BLAST_SEPOLIA]: {
    gasPrice: 40855527,
    gasLimit: 95392,
    signerAddress: "0x3e9011BA607C6b65eA6451aBA078fEAb506B6A0B",
    transaction: "0xf8a88084026f67e7830174a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3841418e41ea06efc763fe3adebe49fa7b819082cc67c54348903149ca965ee90be53f3676292a00b74d6cfa8e7735cf5b3c215c880e0896c5530eb9d918cf8cdb98686d6429830",
    address: "0x539E6089a484bb27997d43427Cd078E855B4FD8F"
  },
  [SupportedChainId.X1_TESTNET]: {
    gasPrice: 314000000000,
    gasLimit: 98364,
    signerAddress: "0xE1CB04A0fA36DdD16a06ea828007E35e1a3cBC37",
    transaction: "0xf8a78085491bdbc4008301803c8080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf38201aaa0aa36080a28f32ccce845fe4cd192873c2bbf0f0bf5e2680a1c3f6d4fc3c461bfa026789cf52575dbc0a991add41a8a1b58ae02b52f64fd2ad43fb5892676544966",
    address: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7"
  },
  [SupportedChainId.BLAST_MAINNET]: {
    gasPrice: 1000386,
    gasLimit: 95392,
    signerAddress: "0xE1CB04A0fA36DdD16a06ea828007E35e1a3cBC37",
    transaction: "0xf8a680830f43c2830174a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf383027c85a054c684fd47d57e49b6675aedd76da4151c25b4e31ca92b20d4df8681d8637595a06c9d33f6c8350f4efc78cd6bdc90d9e93fd292fac1b7a579b2af9334ffd7ee81",
    address: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7"
  },
  [SupportedChainId.ARTHERA_MAINNET]: {
    gasPrice: 1025035000,
    gasLimit: 95383,
    signerAddress: "0xE1CB04A0fA36DdD16a06ea828007E35e1a3cBC37",
    transaction: "0xf8a680843d18caf8830174978080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3825028a0de6f3bc45e952345ad88400009ef9b9ec311fb08645889dfb7c2721444bc2575a013e8ccc1db5cc615b04563cc96f34e8da9cc737947aaffcf83f6b1569dd83298",
    address: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7"
  },
  [SupportedChainId.ARTHERA_TESTNET]: {
    gasPrice: 1025011000,
    gasLimit: 95383,
    signerAddress: "0xE1CB04A0fA36DdD16a06ea828007E35e1a3cBC37",
    transaction: "0xf8a680843d186d38830174978080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf382502aa02915c3c375c637d40d79c7f084d5e7112f8eaeda5480a6dd8198451697f1009fa0760a90a0193b1280d737508f98738d9bfaa3c8dbdd48c8842e07fab89e3f1750",
    address: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7"
  },
};

const deterministicDeployment = CUSTOM_DETERMINISTIC_DEPLOYMENT == "true" ?
  (network: string) => {
    let info: SingletonFactoryInfo | undefined;

    if (ACTIVE_CUSTOM_NETWORK) {
      info = SAFE_SINGLETON_FACTORIES[ACTIVE_CUSTOM_NETWORK];
    } else {
      info = getSingletonFactoryInfo(parseInt(network));
    }

    if (!info) return undefined
    return {
      factory: info.address,
      deployer: info.signerAddress,
      funding: BigNumber.from(info.gasLimit).mul(BigNumber.from(info.gasPrice)).toString(),
      signedTx: info.transaction
    }
  } : undefined

// NOTE: attempting to verify from the cli prgrammatically with npx hardhat verify won't work
// since this config overrides some of the default supported verify networks
// Hence you would verify programmatically with the verify.spec.ts script
const chainNames: Record<SupportedChainId, string> = {
  [SupportedChainId.ETHEREUM_MAINNET]: "mainnet",
  [SupportedChainId.OPTIMISM_MAINNET]: "optimism-mainnet",
  [SupportedChainId.BSC_MAINNET]: "bsc",
  [SupportedChainId.FUSE_MAINNET]: "fuse-mainnet",
  [SupportedChainId.POLYGON_MAINNET]: "polygon-mainnet",
  [SupportedChainId.OPBNB_MAINNET]: "opbnb-mainnet",
  [SupportedChainId.FANTOM_MAINNET]: "fantom-mainnet",
  [SupportedChainId.FANTOM_TESTNET]: "fantom-testnet",
  [SupportedChainId.FANTOM_SONIC]: "fantom-sonic",
  [SupportedChainId.HEDERA_MAINNET]: "hedera-mainnet",
  [SupportedChainId.HEDERA_TESTNET]: "hedera-testnet",
  [SupportedChainId.POLYGON_ZKEVM]: "polygon-zkevm",
  [SupportedChainId.GANACHE]: "ganache",
  [SupportedChainId.MANTLE_MAINNET]: "mantle-mainnet",
  [SupportedChainId.EVMOS_MAINNET]: "evmos-mainnet",
  [SupportedChainId.ARTHERA_MAINNET]: "arthera-mainnet",
  [SupportedChainId.ARTHERA_TESTNET]: "arthera-testnet",
  [SupportedChainId.HARDHAT]: "hardhat",
  [SupportedChainId.AVALANCHE_MAINNET]: "avalanche-mainnet",
  [SupportedChainId.SEPOLIA]: "sepolia",
  [SupportedChainId.ARBITRUM_MAINNET]: "arbitrum-mainnet",
  [SupportedChainId.POLYGON_MUMBAI]: "polygon-mumbai",
  [SupportedChainId.BLAST_MAINNET]: "blast-mainnet",
  [SupportedChainId.TAIKO_HEKLA]: "taiko-hekla",
  [SupportedChainId.SCROLL_MAINNET]: "scroll-mainnet",
  [SupportedChainId.LINEA_MAINNET]: "linea-mainnet",
  [SupportedChainId.HORIZEN_MAINNET]: "horizen-mainnet",
  [SupportedChainId.BASE_MAINNET]: "base-mainnet",
  [SupportedChainId.ZKSYNC_TESTNET]: "zksync-testnet",
  [SupportedChainId.ZKSYNC_MAINNET]: "zksync-mainnet",
  [SupportedChainId.BLAST_SEPOLIA]: "blast-sepolia",
  [SupportedChainId.X1_TESTNET]: "x1-testnet",
  [SupportedChainId.CELO_MAINNET]: "celo-mainnet",
  [SupportedChainId.KAVA_MAINNET]: "kava-mainnet",
};

const fallbackRpcUrls: Record<SupportedChainId, string[]> = {
  [SupportedChainId.ETHEREUM_MAINNET]: [
    "https://eth.llamarpc.com"
  ],
  [SupportedChainId.OPTIMISM_MAINNET]: [
    "https://optimism.llamarpc.com"
  ],
  [SupportedChainId.BSC_MAINNET]: [
    "https://bsc-dataseed.bnbchain.org",
    "https://getblock.io/nodes/bsc",
    "https://binance.llamarpc.com",
    "https://rpc.ankr.com/bsc",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed2.defibit.io",
    "https://bsc-dataseed3.defibit.io",
    "https://bsc-dataseed4.defibit.io",
    "https://bsc-dataseed2.ninicoin.io",
    "https://bsc-dataseed3.ninicoin.io",
    "https://bsc-dataseed4.ninicoin.io",
    "https://bsc-dataseed1.bnbchain.org",
    "https://bsc-dataseed2.bnbchain.org",
    "https://bsc-dataseed3.bnbchain.org",
    "https://bsc-dataseed4.bnbchain.org",
    "https://rpc-bsc.48.club",
    "https://koge-rpc-bsc.48.club",
    "https://endpoints.omniatech.io/v1/bsc/mainnet/public",
    "https://bsc-pokt.nodies.app",
    "https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
    "https://bscrpc.com",
  ],
  [SupportedChainId.FUSE_MAINNET]: [
    "https://rpc.fuse.io",
    "https://fuse-pokt.nodies.app",
    "https://fuse-mainnet.chainstacklabs.com",
    "https://fuse.api.onfinality.io/public",
    "https://fuse.liquify.com",
    "https://fuse.drpc.org",
  ],
  [SupportedChainId.POLYGON_MAINNET]: [
    "https://1rpc.io/matic",
    "https://polygon.drpc.org",
    "https://polygon.llamarpc.com",
    "https://polygon.rpc.blxrbdn.com",
    "https://polygon.meowrpc.com",
    "https://gateway.tenderly.co/public/polygon",
    "https://api.tatum.io/v3/blockchain/node/polygon-mainnet",
    "https://rpc-mainnet.matic.quiknode.pro",
    "https://polygon.blockpi.network/v1/rpc/public",
    "https://polygon.gateway.tenderly.co",
    "https://public.stackup.sh/api/v1/node/polygon-mainnet",
    "https://polygon-bor-rpc.publicnode.com",
    "https://polygon-pokt.nodies.app",
  ],
  [SupportedChainId.OPBNB_MAINNET]: [
    "https://opbnb.publicnode.com"
  ],
  [SupportedChainId.FANTOM_MAINNET]: [
    "https://rpc.fantom.network",
    "https://rpcapi.fantom.network",
    "https://fantom-pokt.nodies.app",
    "https://rpc.ftm.tools",
    "https://rpc.ankr.com/fantom",
    "https://rpc2.fantom.network",
    "https://rpc3.fantom.network",
    "https://fantom-mainnet.public.blastapi.io",
    "https://endpoints.omniatech.io/v1/fantom/mainnet/public",
  ],
  [SupportedChainId.FANTOM_TESTNET]: [
    "https://rpc.testnet.fantom.network",
    "https://endpoints.omniatech.io/v1/fantom/testnet/public",
    "https://rpc.ankr.com/fantom_testnet",
    "https://fantom-testnet.public.blastapi.io",
    "https://fantom-testnet-rpc.publicnode.com",
    "https://fantom.api.onfinality.io/public",
  ],
  [SupportedChainId.FANTOM_SONIC]: [
    "https://rpc.sonic.fantom.network/",
  ],
  [SupportedChainId.HEDERA_MAINNET]: [
    "https://mainnet.hashio.io/api"
  ],
  [SupportedChainId.HEDERA_TESTNET]: [
    "https://testnet.hashio.io/api"
  ],
  [SupportedChainId.POLYGON_ZKEVM]: [
    "https://zkevm-rpc.com",
    "https://rpc.ankr.com/polygon_zkevm",
    "https://1rpc.io/polygon/zkevm",
    "https://polygon-zkevm.drpc.org",
    "https://polygon-zkevm-mainnet.public.blastapi.io",
    "https://polygon-zkevm.blockpi.network/v1/rpc/public",
  ],
  [SupportedChainId.GANACHE]: [
    "http://localhost:8545"
  ],
  [SupportedChainId.MANTLE_MAINNET]: [
    "https://mantle.drpc.org",
    "https://rpc.mantle.xyz",
    "https://mantle-mainnet.public.blastapi.io",
    "https://mantle.publicnode.com",
    "https://rpc.ankr.com/mantle",
    "https://1rpc.io/mantle",
  ],
  [SupportedChainId.EVMOS_MAINNET]: [
    "https://evmos-evm.publicnode.com",
    "https://evmos.lava.build",
    "https://jsonrpc-evmos.mzonder.com",
    "https://json-rpc.evmos.tcnetwork.io",
    "https://rpc-evm.evmos.dragonstake.io",
    "https://evmos-jsonrpc.alkadeta.com",
    "https://evmos-jsonrpc.stake-town.com",
    "https://evm-rpc.evmos.silentvalidator.com",
    "https://evmos-mainnet.public.blastapi.io",
    "https://jsonrpc-evmos-ia.cosmosia.notional.ventures",
    "https://evmos-jsonrpc.theamsolutions.info",
    "https://alphab.ai/rpc/eth/evmos",
    "https://evmos-json-rpc.0base.dev",
    "https://json-rpc-evmos.mainnet.validatrium.club",
    "https://evmos-json-rpc.stakely.io",
    "https://json-rpc.evmos.blockhunters.org",
    "https://evmos-pokt.nodies.app",
    "https://evmosevm.rpc.stakin-nodes.com",
    "https://evmos-json.antrixy.org",
  ],
  [SupportedChainId.ARTHERA_MAINNET]: [
    "https://rpc.arthera.net"
  ],
  [SupportedChainId.ARTHERA_TESTNET]: [
    "https://rpc-test.arthera.net"
  ],
  [SupportedChainId.HARDHAT]: [""],
  [SupportedChainId.AVALANCHE_MAINNET]: [
    "https://avalanche-mainnet-rpc.allthatnode.com",
    "https://rpc.ankr.com/avalanche",
    "https://1rpc.io/avax/c",
    "https://api.avax.network/ext/bc/C/rpc",
    "https://avalanche.public-rpc.com",
    "https://avalanche-c-chain.publicnode.com",
    "https://avalanche.blockpi.network/v1/rpc/public",
    "https://avalanche.drpc.org",
  ],
  [SupportedChainId.SEPOLIA]: [
    "https://1rpc.io/sepolia"
  ],
  [SupportedChainId.ARBITRUM_MAINNET]: [
    "https://arbitrum.llamarpc.com"
  ],
  [SupportedChainId.POLYGON_MUMBAI]: [
    "https://polygon-testnet.public.blastapi.io"
  ],
  [SupportedChainId.BLAST_MAINNET]: [
    "https://rpc.blast.io",
    "https://rpc.ankr.com/blast",
    "https://blast.blockpi.network/v1/rpc/public",
    "https://blast.blockpi.network/v1/rpc/public",
    "https://blast.din.dev/rpc",
    "https://blast.gasswap.org",
    "https://blastl2-mainnet.public.blastapi.io",
  ],
  [SupportedChainId.TAIKO_HEKLA]: [
    "https://rpc.ankr.com/taiko_hekla",
    "https://taiko-hekla.blockpi.network/v1/rpc/public",
    "https://rpc.hekla.taiko.xyz",
    "https://hekla.taiko.tools",
  ],
  [SupportedChainId.SCROLL_MAINNET]: [
    "https://rpc.scroll.io",
    "https://scroll.blockpi.network/v1/rpc/public",
    "https://1rpc.io/scroll",
    "https://scroll.drpc.org",
    "https://scroll-mainnet.rpc.grove.city/v1/a7a7c8e2",
    "https://rpc.ankr.com/scroll",
    "https://scroll-mainnet.chainstacklabs.com",
  ],
  [SupportedChainId.LINEA_MAINNET]: [
    "https://1rpc.io/linea",
    "https://rpc.linea.build",
    "https://linea.blockpi.network/v1/rpc/public",
    "https://linea.decubate.com",
    "https://linea.drpc.org",
  ],
  [SupportedChainId.HORIZEN_MAINNET]: [
    "https://rpc.ankr.com/horizen_eon"
  ],
  [SupportedChainId.BASE_MAINNET]: [
    "https://mainnet.base.org",
    "https://base.blockpi.network/v1/rpc/public",
    "https://1rpc.io/base",
    "https://base-pokt.nodies.app",
    "https://base.meowrpc.com",
    "https://base-mainnet.public.blastapi.io",
    "https://base.gateway.tenderly.co",
    "https://gateway.tenderly.co/public/base",
    "https://rpc.notadegen.com/base",
    "https://base.publicnode.com",
    "https://base.drpc.org",
    "https://endpoints.omniatech.io/v1/base/mainnet/public",
    "https://base.llamarpc.com"
  ],
  [SupportedChainId.ZKSYNC_TESTNET]: [
    "https://sepolia.era.zksync.dev"
  ],
  [SupportedChainId.ZKSYNC_MAINNET]: [
    "https://mainnet.era.zksync.io",
    "https://1rpc.io/zksync2-era",
    "https://zksync-era.blockpi.network/v1/rpc/public",
    "https://zksync.meowrpc.com",
  ],
  [SupportedChainId.BLAST_SEPOLIA]: [
    "https://sepolia.blast.io"
  ],
  [SupportedChainId.X1_TESTNET]: [
    "https://x1testrpc.okx.com",
    "https://x1-testnet.blockpi.network/v1/rpc/public",
  ],
  [SupportedChainId.CELO_MAINNET]: [
    "https://forno.celo.org",
    "https://rpc.ankr.com/celo",
    "https://1rpc.io/celo",
  ],
  [SupportedChainId.KAVA_MAINNET]: [
    "https://evm.kava.io",
    "https://rpc.ankr.com/kava_evm",
    "https://kava.api.onfinality.io/public",
    "https://kava-evm-rpc.publicnode.com",
    "https://kava-pokt.nodies.app",
    "https://evm.kava.chainstacklabs.com",
    "https://evm.kava-rpc.com",
  ],
};

const defaultRpcUrls: Record<SupportedChainId, string> = {
  [SupportedChainId.ETHEREUM_MAINNET]: fallbackRpcUrls[SupportedChainId.ETHEREUM_MAINNET][0],
  [SupportedChainId.OPTIMISM_MAINNET]: fallbackRpcUrls[SupportedChainId.OPTIMISM_MAINNET][0],
  [SupportedChainId.BSC_MAINNET]: fallbackRpcUrls[SupportedChainId.BSC_MAINNET][0],
  [SupportedChainId.POLYGON_MAINNET]: fallbackRpcUrls[SupportedChainId.POLYGON_MAINNET][0],
  [SupportedChainId.FUSE_MAINNET]: fallbackRpcUrls[SupportedChainId.FUSE_MAINNET][0],
  [SupportedChainId.OPBNB_MAINNET]: fallbackRpcUrls[SupportedChainId.OPBNB_MAINNET][0],
  [SupportedChainId.FANTOM_MAINNET]: fallbackRpcUrls[SupportedChainId.FANTOM_MAINNET][0],
  [SupportedChainId.FANTOM_TESTNET]: fallbackRpcUrls[SupportedChainId.FANTOM_TESTNET][0],
  [SupportedChainId.FANTOM_SONIC]: fallbackRpcUrls[SupportedChainId.FANTOM_SONIC][0],
  [SupportedChainId.HEDERA_MAINNET]: fallbackRpcUrls[SupportedChainId.HEDERA_MAINNET][0],
  [SupportedChainId.HEDERA_TESTNET]: fallbackRpcUrls[SupportedChainId.HEDERA_TESTNET][0],
  [SupportedChainId.POLYGON_ZKEVM]: fallbackRpcUrls[SupportedChainId.POLYGON_ZKEVM][0],
  [SupportedChainId.GANACHE]: fallbackRpcUrls[SupportedChainId.GANACHE][0],
  [SupportedChainId.MANTLE_MAINNET]: fallbackRpcUrls[SupportedChainId.MANTLE_MAINNET][0],
  [SupportedChainId.EVMOS_MAINNET]: fallbackRpcUrls[SupportedChainId.EVMOS_MAINNET][0],
  [SupportedChainId.ARTHERA_MAINNET]: fallbackRpcUrls[SupportedChainId.ARTHERA_MAINNET][0],
  [SupportedChainId.ARTHERA_TESTNET]: fallbackRpcUrls[SupportedChainId.ARTHERA_TESTNET][0],
  [SupportedChainId.HARDHAT]: fallbackRpcUrls[SupportedChainId.HARDHAT][0],
  [SupportedChainId.AVALANCHE_MAINNET]: fallbackRpcUrls[SupportedChainId.AVALANCHE_MAINNET][0],
  [SupportedChainId.SEPOLIA]: fallbackRpcUrls[SupportedChainId.SEPOLIA][0],
  [SupportedChainId.ARBITRUM_MAINNET]: fallbackRpcUrls[SupportedChainId.ARBITRUM_MAINNET][0],
  [SupportedChainId.POLYGON_MUMBAI]: fallbackRpcUrls[SupportedChainId.POLYGON_MUMBAI][0],
  [SupportedChainId.BLAST_MAINNET]: fallbackRpcUrls[SupportedChainId.BLAST_MAINNET][0],
  [SupportedChainId.TAIKO_HEKLA]: fallbackRpcUrls[SupportedChainId.TAIKO_HEKLA][0],
  [SupportedChainId.SCROLL_MAINNET]: fallbackRpcUrls[SupportedChainId.SCROLL_MAINNET][0],
  [SupportedChainId.LINEA_MAINNET]: fallbackRpcUrls[SupportedChainId.LINEA_MAINNET][0],
  [SupportedChainId.HORIZEN_MAINNET]: fallbackRpcUrls[SupportedChainId.HORIZEN_MAINNET][0],
  [SupportedChainId.BASE_MAINNET]: fallbackRpcUrls[SupportedChainId.BASE_MAINNET][0],
  [SupportedChainId.ZKSYNC_TESTNET]: fallbackRpcUrls[SupportedChainId.ZKSYNC_TESTNET][0],
  [SupportedChainId.ZKSYNC_MAINNET]: fallbackRpcUrls[SupportedChainId.ZKSYNC_MAINNET][0],
  [SupportedChainId.BLAST_SEPOLIA]: fallbackRpcUrls[SupportedChainId.BLAST_SEPOLIA][0],
  [SupportedChainId.X1_TESTNET]: fallbackRpcUrls[SupportedChainId.X1_TESTNET][0],
  [SupportedChainId.CELO_MAINNET]: fallbackRpcUrls[SupportedChainId.CELO_MAINNET][0],
  [SupportedChainId.KAVA_MAINNET]: fallbackRpcUrls[SupportedChainId.KAVA_MAINNET][0],
};

const infuraSupportedNetworks: Partial<Record<SupportedChainId, boolean>> = {
  [SupportedChainId.ETHEREUM_MAINNET]: true,
  [SupportedChainId.BASE_MAINNET]: false,
  [SupportedChainId.POLYGON_MAINNET]: true,
  [SupportedChainId.OPTIMISM_MAINNET]: true,
  [SupportedChainId.ARBITRUM_MAINNET]: true,
  [SupportedChainId.AVALANCHE_MAINNET]: true,
};

// TODO: import ChainConfig | CustomChain from hardhat-verify
interface ChainConfig {
  network: string;
  chainId: number;
  urls: {
    apiURL: string;
    browserURL: string;
  };
};

interface ChainConfigMinimal {
  urls: {
    apiURL: string;
    browserURL: string;
  };
};

// Only need to specify etherscanConfig for a chain if it's not supported by default:
// npx hardhat verify --list-networks
// for configs of already supported networks(with different chainNames) look inside: @nomiclabs/hardhat-etherscan/src/ChainConfig.ts
const etherscanConfig: Partial<Record<SupportedChainId, ChainConfigMinimal>> = {
  [SupportedChainId.BASE_MAINNET]: {
    urls: {
      apiURL: "https://api.basescan.org/api",
      browserURL: "https://basescan.org/",
    },
  },
  [SupportedChainId.FUSE_MAINNET]: {
    urls: { // a blockscout explorer
      apiURL: "https://explorer.fuse.io/api",
      browserURL: "https://explorer.fuse.io",
    },
  },
  [SupportedChainId.EVMOS_MAINNET]: {
    urls: {
      apiURL: "https://escan.live/api",
      browserURL: "https://escan.live"
    },
  },
  [SupportedChainId.ARTHERA_MAINNET]: {
    urls: {
      apiURL: "https://explorer.arthera.net/api",
      browserURL: "https://explorer.arthera.net"
    },
  },
  [SupportedChainId.ARTHERA_TESTNET]: {
    urls: {
      apiURL: "https://explorer-test.arthera.net/api",
      browserURL: "https://explorer-test.arthera.net"
    },
  },
  [SupportedChainId.CELO_MAINNET]: {
    urls: {
      apiURL: "https://api.celoscan.io/api",
      browserURL: "https://celoscan.io/",
    },
  },
  [SupportedChainId.BLAST_MAINNET]: {
    urls: {
      apiURL: "https://api.blastscan.io/api",
      browserURL: "https://blastscan.io/",
    },
  },
  [SupportedChainId.KAVA_MAINNET]: {
    urls: {
      apiURL: "https://kavascan.com/api",
      browserURL: "https://kavascan.com/",
    },
  },
  [SupportedChainId.SCROLL_MAINNET]: {
    urls: {
      apiURL: "https://api.scrollscan.com/api",
      browserURL: "https://scrollscan.com/",
    },
  },
  [SupportedChainId.MANTLE_MAINNET]: {
    // urls: {
    //   apiURL: "https://api.routescan.io/v2/network/mainnet/evm/5000/etherscan",
    //   browserURL: "https://mantlescan.info"
    urls: {
      apiURL: "https://explorer.mantle.xyz/api",
      browserURL: "https://explorer.mantle.xyz/"
    }
  },
  [SupportedChainId.POLYGON_ZKEVM]: {
    urls: {
      apiURL: "https://api-zkevm.polygonscan.com/api",
      browserURL: "https://zkevm.polygonscan.com"
    },
  },
  [SupportedChainId.LINEA_MAINNET]: {
    urls: {
      apiURL: "https://api.lineascan.build/api",
      browserURL: "https://lineascan.build/"
    },
  },
  [SupportedChainId.OPBNB_MAINNET]: {
    urls: {
      apiURL: `https://open-platform.nodereal.io/${process.env.NODEREAL_API_KEY}/op-bnb-mainnet/contract/`,
      browserURL: "https://opbnbscan.com/",
    },
  },
  [SupportedChainId.FANTOM_MAINNET]: {
    urls: {
      apiURL: "https://api.ftmscan.com/api",
      browserURL: "https://ftmscan.com",
    },
  },
  [SupportedChainId.X1_TESTNET]: {
    urls: {
      apiURL: "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET",
      browserURL: "https://www.oklink.com/xlayer-test"
    },
  },
  [SupportedChainId.TAIKO_HEKLA]: {
    urls: { // a routescan explorer
      apiURL: "https://api.routescan.io/v2/network/testnet/evm/167009/etherscan",
      browserURL: "https://hekla.taikoscan.network/"
    },
  },
};

// Utility type to extract and enforce keys from etherscanConfig
type EnforcedApiKeys<T extends object> = {
  [P in keyof T]: string;
} & Partial<Record<SupportedChainId, string>>;

const dummyApiKey = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";

const etherscanApiKeys: EnforcedApiKeys<typeof etherscanConfig> = {
  // required SupportedChainId since specified in etherscanConfig
  [SupportedChainId.BASE_MAINNET]: process.env.BASESCAN_API_KEY || "",
  [SupportedChainId.EVMOS_MAINNET]: process.env.ESCAN_API_KEY || "",
  [SupportedChainId.ARTHERA_MAINNET]: dummyApiKey,
  [SupportedChainId.ARTHERA_TESTNET]: dummyApiKey,
  [SupportedChainId.CELO_MAINNET]: process.env.CELOSCAN_API_KEY || "",
  [SupportedChainId.BLAST_MAINNET]: process.env.BLASTSCAN_API_KEY || "",
  [SupportedChainId.KAVA_MAINNET]: process.env.KAVASCAN_API_KEY || "",
  [SupportedChainId.SCROLL_MAINNET]: process.env.SCROLLSCAN_API_KEY || "",
  [SupportedChainId.MANTLE_MAINNET]: process.env.MANTLESCAN_API_KEY || "",
  [SupportedChainId.POLYGON_ZKEVM]: process.env.ZKEVMSCAN_API_KEY || "",
  [SupportedChainId.LINEA_MAINNET]: process.env.LINEASCAN_API_KEY || "",
  [SupportedChainId.OPBNB_MAINNET]: process.env.OPBNBSCAN_API_KEY || "",
  [SupportedChainId.FANTOM_MAINNET]: process.env.FTMSCAN_API_KEY || "",
  [SupportedChainId.X1_TESTNET]: dummyApiKey, // no api key required
  [SupportedChainId.TAIKO_HEKLA]: dummyApiKey, // no api key required
  [SupportedChainId.FUSE_MAINNET]: dummyApiKey, // no api key required

  // extra optional SupportedChainId
  [SupportedChainId.ARBITRUM_MAINNET]: process.env.ARBISCAN_API_KEY || "",
  [SupportedChainId.AVALANCHE_MAINNET]: process.env.SNOWTRACE_API_KEY || "",
  [SupportedChainId.BSC_MAINNET]: process.env.BSCSCAN_API_KEY || "",
  [SupportedChainId.ETHEREUM_MAINNET]: process.env.ETHERSCAN_API_KEY || "",
  [SupportedChainId.OPTIMISM_MAINNET]: process.env.OPTIMISM_API_KEY || "",
  [SupportedChainId.POLYGON_MAINNET]: process.env.POLYGONSCAN_API_KEY || "",
  [SupportedChainId.POLYGON_MUMBAI]: process.env.POLYGONSCAN_API_KEY || "",
  [SupportedChainId.SEPOLIA]: process.env.ETHERSCAN_API_KEY || "",
};

// Runtime check to ensure all required keys are present
// Build/compile time check with a type to enforce this doesn't seem possible
function verifyConfigIntegrity(config: Partial<Record<SupportedChainId, ChainConfigMinimal>>, apiKeys: Record<SupportedChainId, string>) {
  for (const key in config) {
    if (!(key in apiKeys)) {
      throw new Error(`Explorer API key for ${SupportedChainId[key as any]} is missing`);
    }
  }
};

// Call this function at the start of your application
verifyConfigIntegrity(etherscanConfig, etherscanApiKeys as Record<SupportedChainId, string>);

function getChainUrl(chainId: SupportedChainId): string {
  // Check if the chainId has a custom URL in infuraSupportedNetworks
  if (infuraSupportedNetworks[chainId]) {
    return `https://${chainNames[chainId]}.infura.io/v3/${infuraApiKey}`;
  }

  return defaultRpcUrls[chainId];
};

function getChainConfig(chainId: SupportedChainId): NetworkUserConfig {
  const jsonRpcUrl = getChainUrl(chainId);

  return {
    // accounts: {
    //   count: 10,
    //   mnemonic,
    //   path: "m/44'/60'/0'/0",
    // },
    ...sharedNetworkConfig,
    chainId,
    url: jsonRpcUrl,
    timeout: 60_000 // added as the default timeout isn't sufficient for Hedera
  };
};

const chainConfigs = Object.entries(chainNames).reduce((config, [chainIdString, chainName]) => {
  const chainId = Number(chainIdString);
  if (isValidChainId(chainId)) {
    config[chainName] = getChainConfig(chainId);
    return config;
  } else {
    throw new Error("Invalid chainId");
  }
}, {} as Record<string, NetworkUserConfig>);

const chainVerifyApiKeys = Object.entries(chainNames).reduce((config, [chainIdString, chainName]) => {
  const chainId = Number(chainIdString);
  if (isValidChainId(chainId)) {
    config[chainName] = etherscanApiKeys[chainId] || "";
    return config;
  } else {
    throw new Error("Invalid chainId");
  }
}, {} as Record<string, string>);

const chainConfigsArray: ChainConfig[] = Object.entries(etherscanConfig).reduce((acc, [chainIdString, config]) => {
  const chainId = Number(chainIdString) as SupportedChainId;
  const networkName = chainNames[chainId];
  // Construct the ChainConfig object if URLs are provided
  if (config?.urls) {
    const chainConfig: ChainConfig = {
      network: networkName,
      chainId,
      urls: config.urls,
    };
    acc.push(chainConfig);
  }
  return acc;
}, [] as ChainConfig[]);

const userConfig: HardhatUserConfig = {
  paths: {
    artifacts: "build/artifacts",
    cache: "build/cache",
    deploy: "src/deploy",
    sources: "contracts",
  },
  solidity: {
    compilers: [
      { version: primarySolidityVersion, settings: soliditySettings },
      { version: "0.6.12" },
      { version: "0.5.17" },
    ]
  },
  networks: {
    ...chainConfigs,
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 100000000,
      gas: 100000000
    },
  },
  deterministicDeployment,
  namedAccounts: {
    deployer: 0,
  },
  mocha: {
    timeout: 2000000,
  },
  etherscan: {
    apiKey: {
      ...chainVerifyApiKeys
    },
    customChains: chainConfigsArray
  },
  sourcify: {
    enabled: true
  }
};
if (NODE_URL) {
  userConfig.networks!!.custom = {
    ...sharedNetworkConfig,
    url: NODE_URL,
  }
}
export default userConfig
