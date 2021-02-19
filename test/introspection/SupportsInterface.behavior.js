const { makeInterfaceId } = require('@openzeppelin/test-helpers');

const INTERFACES = {
  ERC165: [
    'supportsInterface(bytes4)',
  ],
  BEP20OperableTransfer: [
    'transferAndCall(address,uint256)',
    'transferAndCall(address,uint256,bytes)',
    'transferFromAndCall(address,address,uint256)',
    'transferFromAndCall(address,address,uint256,bytes)',
  ],
  BEP20OperableApprove: [
    'approveAndCall(address,uint256)',
    'approveAndCall(address,uint256,bytes)',
  ],
  BEP20OperableReceiver: [
    'onTransferReceived(address,address,uint256,bytes)',
  ],
  BEP20OperableSpender: [
    'onApprovalReceived(address,uint256,bytes)',
  ],
};

const INTERFACE_IDS = {};
const FN_SIGNATURES = {};
for (const k of Object.getOwnPropertyNames(INTERFACES)) {
  INTERFACE_IDS[k] = makeInterfaceId.ERC165(INTERFACES[k]);
  for (const fnName of INTERFACES[k]) {
    // the interface id of a single function is equivalent to its function signature
    FN_SIGNATURES[fnName] = makeInterfaceId.ERC165([fnName]);
  }
}

function shouldSupportInterfaces (interfaces = []) {
  describe('Contract interface', function () {
    beforeEach(function () {
      this.contractUnderTest = this.mock || this.token;
    });

    for (const k of interfaces) {
      const interfaceId = INTERFACE_IDS[k];
      describe(k, function () {
        describe('ERC165\'s supportsInterface(bytes4)', function () {
          it('should use less than 30k gas', async function () {
            (await this.contractUnderTest.supportsInterface.estimateGas(interfaceId)).should.be.lte(30000);
          });

          it('should claim support', async function () {
            (await this.contractUnderTest.supportsInterface(interfaceId)).should.equal(true);
          });
        });

        for (const fnName of INTERFACES[k]) {
          const fnSig = FN_SIGNATURES[fnName];
          describe(fnName, function () {
            it('should be implemented', function () {
              this.contractUnderTest.abi.filter(fn => fn.signature === fnSig).length.should.equal(1);
            });
          });
        }
      });
    }
  });
}

module.exports = {
  shouldSupportInterfaces,
};
