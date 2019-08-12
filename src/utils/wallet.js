import BigNum from 'bignumber.js';

export default class WalletUtils {
  static convertTokensToVesting({ tokens, balance, supply }) {
    const { decs, amount } = WalletUtils.checkAsset(tokens);

    WalletUtils.checkDecsValue({ decs, requiredValue: 3 });

    // const { balance, supply } = await WalletUtils.getVestingSupplyAndBalance();

    return WalletUtils.convertAssetToString({
      sym: 'GOLOS',
      amount: WalletUtils.calculateConvertAmount({
        baseRaw: amount,
        multiplierRaw: supply,
        dividerRaw: balance,
      }),
      decs: 6,
    });
  }

  static convertVestingToToken({ vesting, type, balance, supply }) {
    const { decs, amount } = WalletUtils.checkAsset(vesting);

    // WalletUtils.checkDecsValue({ decs, requiredValue: 6 });

    // const { balance, supply } = await WalletUtils.getVestingSupplyAndBalance();
    const resultString = WalletUtils.convertAssetToString({
      sym: 'GOLOS',
      amount: WalletUtils.calculateConvertAmount({
        baseRaw: amount,
        multiplierRaw: balance,
        dividerRaw: supply,
      }),
      decs: 3,
    });

    if (type === 'string') {
      return resultString;
    }
    return WalletUtils.parseAsset(resultString);
  }

  static checkAsset(asset) {
    if (typeof asset !== 'string') {
      return;
    }

    const parts = asset.split(' ');

    const amountString = parts[0].replace('.', '');
    const decsString = parts[0].split('.')?.[1] || '';

    const sym = parts[1];
    const amount = parseInt(amountString, 10);
    const decs = decsString.length;

    return { sym, amount, decs };
  }

  static checkDecsValue({ decs, requiredValue }) {
    if (decs !== requiredValue) {
      console.error(`convert: invalid argument ${decs}. decs must be equal ${requiredValue}`);
      throw { code: 805, message: 'Wrong arguments' };
    }
  }

  static convertAssetToString({ sym, amount, decs }) {
    const divider = new BigNum(10).pow(decs);
    const leftPart = new BigNum(amount).div(divider).toString();

    return `${leftPart} ${sym}`;
  }

  static calculateConvertAmount({ baseRaw, multiplierRaw, dividerRaw }) {
    const base = new BigNum(baseRaw);
    const multiplier = new BigNum(multiplierRaw);
    const divider = new BigNum(dividerRaw);

    return base
      .times(multiplier)
      .div(divider)
      .dp(0)
      .toString();
  }

  static parseAsset(asset) {
    if (!asset) {
      throw new Error('Asset is not defined');
    }
    const [quantityRaw, sym] = asset.split(' ');
    const quantity = new BigNum(asset);
    return {
      quantityRaw,
      quantity,
      sym,
    };
  }
}
