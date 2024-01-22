import type { HardhatUserConfig, HttpNetworkUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import "hardhat-deploy";
import dotenv from "dotenv";
import yargs from "yargs";
import { getSingletonFactoryInfo, SingletonFactoryInfo } from "@gnosis.pm/safe-singleton-factory";

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

enum CustomNetworks {
  HORIZEN_MAINNET = 7332,
  HORIZEN_TESTNET = 1663,
  HEDERA_TESTNET = 296,
  HEDERA_MAINNET = 295,
  OPBNB_MAINNET = 204,
}

const ACTIVE_CUSTOM_NETWORK = CustomNetworks.OPBNB_MAINNET;

export const SAFE_SINGLETON_FACTORIES: Record<CustomNetworks, SingletonFactoryInfo> = {
  [CustomNetworks.HORIZEN_TESTNET]: {
    gasPrice: 20000000000,
    gasLimit: 95383,
    signerAddress: "0xE1CB04A0fA36DdD16a06ea828007E35e1a3cBC37",
    transaction: "0xf8a7808504a817c800830174978080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3820d22a084ff7eceb3f2c5cc6f4a47bb3bfe91bd777b4a58f9b96a58f23838142830214aa00756107df56ba531041782af89a89c018d96d4cad20d7bee0f05b75cc3778e1b",
    address: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7"
  },
  [CustomNetworks.HORIZEN_MAINNET]: {
    gasPrice: 500000000000,
    gasLimit: 95383,
    signerAddress: "0xE1CB04A0fA36DdD16a06ea828007E35e1a3cBC37",
    transaction: "0xf8a78085746a528800830174978080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf382396ba06efa20cb1594f958a7976ed88c97ba7bb8304cee81a3102e2e9948b7d45cee7ea0482fa4b926a2920effd569a50757589cee03509631397c6f14970896a66614c8",
    address: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7"
  },
  [CustomNetworks.HEDERA_TESTNET]: {
    gasPrice: 2200000000000,
    gasLimit: 100000,
    signerAddress: "0x13D65d7fA66A2970eE8862ba8633D064B43Bf091",
    transaction: "0xf8a8808602003a37f000830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3820273a02c2dc95853f2d9809a846eb31ce58e2061c20f3699ebbf1f641c4e2a818f6940a078feaec02b382bb4e0b610dba69f8643a6f6b1f1dec60e0d7ff079b568438472",
    address: "0xAfb3D5C0cd6a610F87365ce1BF8Eb6A0AA985988"
  },
  [CustomNetworks.OPBNB_MAINNET]: {
    gasPrice: 10,
    gasLimit: 95383,
    signerAddress: "0xE1CB04A0fA36DdD16a06ea828007E35e1a3cBC37",
    transaction: "0xf8a2800a830174978080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf38201bca0321c2231ac15b3a45c6e7cca4f6686706ebe4d926fae78c3cb9f2d354d874731a05c4a31c24a88d43af57c77f1020c933e51091f0cd30fd59c40af9a5a5a290c89",
    address: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7"
  },
  [CustomNetworks.HEDERA_MAINNET]: {
    gasPrice: 1160000000000,
    gasLimit: 86279,
    signerAddress: "0xC30220fc19e2db669eaa3fa042C07b28F0c10737",
    transaction: "0xf8a88086010e15635000830151078080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3820272a0cbb4ed8ba208385a8cc9e58f1ddee69eda8cf94b86b85748b17c5b45a626f7c1a033cda078898e9c13e4ef123173d0f8dd24bf7416b4c291768a0a3b170d9c8fda",
    address: "0xBF60A8e623D4E776F6FFA94d8bB7Ef7c22E057A1"
  }
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
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 100000000,
      gas: 100000000
    },
    mainnet: {
      ...sharedNetworkConfig,
      url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    },
    xdai: {
      ...sharedNetworkConfig,
      url: "https://xdai.poanetwork.dev",
    },
    ewc: {
      ...sharedNetworkConfig,
      url: `https://rpc.energyweb.org`,
    },
    rinkeby: {
      ...sharedNetworkConfig,
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
    },
    goerli: {
      ...sharedNetworkConfig,
      url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
    },
    kovan: {
      ...sharedNetworkConfig,
      url: `https://kovan.infura.io/v3/${INFURA_KEY}`,
    },
    polygon: {
      ...sharedNetworkConfig,
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
    },
    volta: {
      ...sharedNetworkConfig,
      url: `https://volta-rpc.energyweb.org`,
    },
    bsc: {
      ...sharedNetworkConfig,
      url: `https://bsc-dataseed.binance.org/`,
    },
    arbitrum: {
      ...sharedNetworkConfig,
      url: `https://arb1.arbitrum.io/rpc`,
    },
    fantomTestnet: {
      ...sharedNetworkConfig,
      url: `https://rpc.testnet.fantom.network/`,
    },
    hederaTestnet: {
      ...sharedNetworkConfig,
      url: `https://testnet.hashio.io/api`,
    },
    hederaMainnet: {
      ...sharedNetworkConfig,
      url: `https://mainnet.hashio.io/api`,
      timeout: 120_000
    },
    opbnb: {
      ...sharedNetworkConfig,
      url: `https://opbnb.publicnode.com`,
    },
    horizenGobi: {
      ...sharedNetworkConfig,
      url: "https://gobi-rpc.horizenlabs.io/ethv1"
    },
    horizenMainnet: {
      ...sharedNetworkConfig,
      url: "https://rpc.ankr.com/horizen_eon"
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
      opbnb: ETHERSCAN_API_KEY!
    },
    customChains: [
      {
        network: "opbnb",
        chainId: 204,
        urls: {
          apiURL: "https://api-opbnb.bscscan.com/api",
          browserURL: "https://opbnb.bscscan.com/",
        },
      },
    ],
  },
};
if (NODE_URL) {
  userConfig.networks!!.custom = {
    ...sharedNetworkConfig,
    url: NODE_URL,
  }
}
export default userConfig
