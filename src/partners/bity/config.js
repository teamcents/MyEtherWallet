const bityCurrencies = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin'
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ether'
  },
  REP: {
    symbol: 'REP',
    name: 'Augur',
    invalidFrom: ['BTC']
  }
};

export { bityCurrencies };
