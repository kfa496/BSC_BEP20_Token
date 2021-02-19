const { BN, ether } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeBEP20 } = require('./behaviours/BEP20.behaviour');

const { shouldBehaveLikeGeneratorCopyright } = require('../../utils/GeneratorCopyright.behaviour');

const HelloBEP20 = artifacts.require('HelloBEP20');
const ServiceReceiver = artifacts.require('ServiceReceiver');

contract('HelloBEP20', function ([owner, other, thirdParty]) {
  const _name = 'HelloBEP20';
  const _symbol = 'BEP20';
  const _decimals = new BN(18);
  const _initialSupply = ether('100000');

  const fee = 0;

  const version = 'v1.4.0';

  beforeEach(async function () {
    this.serviceReceiver = await ServiceReceiver.new({ from: owner });
    // not to set any price means it doesn't require any fee
    // await this.serviceReceiver.setPrice('HelloBEP20', fee);
  });

  context('creating valid token', function () {
    beforeEach(async function () {
      this.token = await HelloBEP20.new(
        _name,
        _symbol,
        this.serviceReceiver.address,
        {
          from: owner,
          value: fee,
        },
      );
    });

    describe('once deployed', function () {
      it('total supply should be equal to 100k', async function () {
        (await this.token.totalSupply()).should.be.bignumber.equal(_initialSupply);
      });

      it('owner balance should be equal to 100k', async function () {
        (await this.token.balanceOf(owner)).should.be.bignumber.equal(_initialSupply);
      });
    });
  });

  context('HelloBEP20 token behaviours', function () {
    beforeEach(async function () {
      this.token = await HelloBEP20.new(
        _name,
        _symbol,
        this.serviceReceiver.address,
        {
          from: owner,
          value: fee,
        },
      );
    });

    context('like a BEP20', function () {
      shouldBehaveLikeBEP20(_name, _symbol, _decimals, _initialSupply, [owner, other, thirdParty]);
    });

    context('like a GeneratorCopyright', function () {
      beforeEach(async function () {
        this.instance = this.token;
      });

      shouldBehaveLikeGeneratorCopyright(version);
    });
  });
});
