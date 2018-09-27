import {
  changellyCurrencies,
  kyberCurrencies,
  bityCurrencies,
  currencyMasterList
} from './config';

export default class CurrencyFilter {
  constructor() {
    console.log(currencyMasterList); // todo remove dev item
    console.log(changellyCurrencies); // todo remove dev item
    console.log(kyberCurrencies); // todo remove dev item
    console.log(bityCurrencies); // todo remove dev item
    // this.currentRatesArray = [];
    this.partnerSets = {};
    // this.currentRatesMap = new Map();
    this.exchangeSupportedMap = new Map();
    this.exchangeSupportedMap.set('bity', this.buildPairList(bityCurrencies));
    this.exchangeSupportedMap.set('kyber', this.buildPairList(kyberCurrencies));
    this.exchangeSupportedMap.set(
      'changelly',
      this.buildPairList(changellyCurrencies)
    );

    this.partnerSets['bity'] = this.buildPairList(bityCurrencies);
    this.partnerSets['kyber'] = this.buildPairList(kyberCurrencies);
    this.partnerSets['changelly'] = this.buildPairList(changellyCurrencies);

    this.exchangeSupportedMap.set('bity', this.buildPairList(bityCurrencies));
    this.exchangeSupportedMap.set('kyber', this.buildPairList(kyberCurrencies));
    this.exchangeSupportedMap.set(
      'changelly',
      this.buildPairList(changellyCurrencies)
    );
  }

  buildRateMap() {}

  buildPairList(tokens) {
    const map = new Map();
    // const forRates = [];
    tokens.forEach(_token => {
      const innerTokens = tokens.map(val => [val, -1]);
      innerTokens.splice(innerTokens.indexOf([_token.symbol, -1]), 1);
      map.set(_token.symbol, new Map(innerTokens));
    });
    return map;
  }

  idCounterPairs(from) {
    const counterPairList = new Set();
    if (this.partnerSets['bity'].has(from)) {
      for (const prop of this.partnerSets['bity'].get(from)) {
        // let entryKeys = this.partnerSets['bity'].get(from).keys()
        counterPairList.add({
          symbol: prop[0],
          name: currencyMasterList[prop[0]].name
        });
      }
    }
    if (this.partnerSets['kyber'].has(from)) {
      for (const prop of this.partnerSets['kyber'].get(from)) {
        // let entryKeys = this.partnerSets['bity'].get(from).keys()
        counterPairList.add({
          symbol: prop[0],
          name: currencyMasterList[prop[0]].name
        });
      }
    }
    if (this.partnerSets['changelly'].has(from)) {
      for (const prop of this.partnerSets['changelly'].get(from)) {
        // let entryKeys = this.partnerSets['bity'].get(from).keys()
        counterPairList.add({
          symbol: prop[0],
          name: currencyMasterList[prop[0]].name
        });
      }
    }
    return Array.from(counterPairList.values());
  }

  // addRateEntry(pair, from, to, rate, source) {
  //   console.log(pair, from, to); // todo remove dev item
  //   currentRates.push({
  //     pair: pair,
  //     from: from,
  //     to: to,
  //     rate: rate,
  //     source: source
  //   });
  // }
}
