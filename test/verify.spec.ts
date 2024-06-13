import { network, run } from "hardhat";

// For more details on programmatic verification in hardhat see:
// https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#using-programmatically
describe("Verify All Contracts via Etherscan", async function () {

    const isHardhat = network.name === "hardhat";

    const requisiteData: {
        SimulateTxAccessor: string;
        GnosisSafeProxyFactory: string;
        DefaultCallbackHandler: string;
        CompatibilityFallbackHandler: string;
        CreateCall: string;
        MultiSend: string;
        MultiSendCallOnly: string;
        SignMessageLib: string;
        GnosisSafeL2: string;
        GnosisSafe: string;
    } = {
        SimulateTxAccessor: "",
        GnosisSafeProxyFactory: "",
        DefaultCallbackHandler: "",
        CompatibilityFallbackHandler: "",
        CreateCall: "",
        MultiSend: "",
        MultiSendCallOnly: "",
        SignMessageLib: "",
        GnosisSafeL2: "",
        GnosisSafe: "",
    };

  before(async () => {

    if (isHardhat) {
      throw new Error(`To verify on a specific etherscan(not hardhat) specify "--network" cmd flag`);
    }

    // validate all requisite data and populate requisite data in allData before attempting to proceed with steps

    const {
        SimulateTxAccessor,
        GnosisSafeProxyFactory,
        DefaultCallbackHandler,
        CompatibilityFallbackHandler,
        CreateCall,
        MultiSend,
        MultiSendCallOnly,
        SignMessageLib,
        GnosisSafeL2,
        GnosisSafe,
    } = requisiteData;

    if (!SimulateTxAccessor) {
      throw new Error(`Undefined SimulateTxAccessor`);
    }

    if (!GnosisSafeProxyFactory) {
      throw new Error(`Undefined GnosisSafeProxyFactory`);
    }

    if (!DefaultCallbackHandler) {
      throw new Error(`Undefined DefaultCallbackHandler`);
    }

    if (!CompatibilityFallbackHandler) {
      throw new Error(`Undefined CompatibilityFallbackHandler`);
    }

    if (!CreateCall) {
      throw new Error(`Undefined CreateCall`);
    }

    if (!MultiSend) {
      throw new Error(`Undefined MultiSend`);
    }

    if (!MultiSendCallOnly) {
      throw new Error(`Undefined MultiSendCallOnly`);
    }

    if (!SignMessageLib) {
      throw new Error(`Undefined SignMessageLib`);
    }

    if (!GnosisSafeL2) {
      throw new Error(`Undefined GnosisSafeL2`);
    }

    if (!GnosisSafe) {
      throw new Error(`Undefined GnosisSafe`);
    }

  });

  after(async () => {
    console.log("requisiteData:", requisiteData);
  });

  let shouldSkip = false;
  beforeEach(function () {
    if (shouldSkip) {
      this.skip();
    }
  });

  it("should verify SimulateTxAccessor", async () => {
    await run("verify:verify", {
        contract: "contracts/accessors/SimulateTxAccessor.sol:SimulateTxAccessor",
        address: requisiteData.SimulateTxAccessor,
    });
  });

  it("should verify GnosisSafeProxyFactory", async () => {
    await run("verify:verify", {
        contract: "contracts/proxies/GnosisSafeProxyFactory.sol:GnosisSafeProxyFactory",
        address: requisiteData.GnosisSafeProxyFactory,
    });
  });

  it("should verify DefaultCallbackHandler", async () => {
    await run("verify:verify", {
        contract: "contracts/handler/DefaultCallbackHandler.sol:DefaultCallbackHandler",
        address: requisiteData.DefaultCallbackHandler,
    });
  });

  it("should verify CompatibilityFallbackHandler", async () => {
    await run("verify:verify", {
        contract: "contracts/handler/CompatibilityFallbackHandler.sol:CompatibilityFallbackHandler",
        address: requisiteData.CompatibilityFallbackHandler,
    });
  });

  it("should verify CreateCall", async () => {
    await run("verify:verify", {
        contract: "contracts/libraries/CreateCall.sol:CreateCall",
        address: requisiteData.CreateCall,
    });
  });

  it("should verify MultiSend", async () => {
    await run("verify:verify", {
        contract: "contracts/libraries/MultiSend.sol:MultiSend",
        address: requisiteData.MultiSend,
    });
  });

  it("should verify MultiSendCallOnly", async () => {
    await run("verify:verify", {
        contract: "contracts/libraries/MultiSendCallOnly.sol:MultiSendCallOnly",
        address: requisiteData.MultiSendCallOnly,
    });
  });

  it("should verify SignMessageLib", async () => {
    await run("verify:verify", {
        contract: "contracts/libraries/SignMessageLib.sol:SignMessageLib",
        address: requisiteData.SignMessageLib,
    });

  });

  it("should verify GnosisSafeL2", async () => {
    await run("verify:verify", {
        contract: "contracts/GnosisSafeL2.sol:GnosisSafeL2",
        address: requisiteData.GnosisSafeL2,
    });
  });

  it("should verify GnosisSafe", async () => {
    await run("verify:verify", {
        contract: "contracts/GnosisSafe.sol:GnosisSafe",
        address: requisiteData.GnosisSafe,
    });
  });

});
