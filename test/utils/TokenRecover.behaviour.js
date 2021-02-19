const { BN, expectRevert } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeOwnable } = require('../access/Ownable.behavior');

const BEP20Mock = artifacts.require('BEP20Mock');

function shouldBehaveLikeTokenRecover ([owner, thirdParty]) {
  describe('recoverBEP20', function () {
    const amount = new BN(100);

    const name = 'TEST';
    const symbol = 'TEST';

    beforeEach(async function () {
      this.anotherBEP20 = await BEP20Mock.new(name, symbol, this.instance.address, amount, { from: owner });
    });

    describe('if owner is calling', function () {
      it('should recover any BEP20', async function () {
        (await this.anotherBEP20.balanceOf(this.instance.address)).should.be.bignumber.equal(amount);
        (await this.anotherBEP20.balanceOf(owner)).should.be.bignumber.equal(new BN(0));

        await this.instance.recoverBEP20(this.anotherBEP20.address, amount, { from: owner });

        (await this.anotherBEP20.balanceOf(this.instance.address)).should.be.bignumber.equal(new BN(0));
        (await this.anotherBEP20.balanceOf(owner)).should.be.bignumber.equal(amount);
      });
    });

    describe('if third party is calling', function () {
      it('reverts', async function () {
        await expectRevert(
          this.instance.recoverBEP20(this.anotherBEP20.address, amount, { from: thirdParty }),
          'Ownable: caller is not the owner',
        );
      });
    });
  });

  context('testing ownership', function () {
    beforeEach(async function () {
      this.ownable = this.instance;
    });

    shouldBehaveLikeOwnable(owner, [thirdParty]);
  });
}

module.exports = {
  shouldBehaveLikeTokenRecover,
};
