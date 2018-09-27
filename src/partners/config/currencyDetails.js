const currencyMasterList = {
  BTC: { name: 'Bitcoin' },
  ETH: { name: 'Ether' },
  CHF: { name: 'Swiss Franc' },
  USD: { name: 'US Dollar' },
  EUR: { name: 'Euro' },
  SNT: { name: 'STATUS' },
  ADX: { name: 'AdEx' },
  OMG: { name: 'OmiseGO' },
  ELF: { name: 'AELF' },
  KNC: { name: 'KyberNetwork' },
  STORJ: { name: 'Storj' },
  PTOY: { name: 'Patientory' },
  TKN: { name: 'TokenCard' },
  FUN: { name: 'Funfair' },
  NMR: { name: 'Numeraire' },
  RCN: { name: 'Ripio Credit Network' },
  VET: { name: 'VeChain' },
  REP: { name: 'Augur', invalidFrom: ['BTC'] },
  POWR: { name: 'Power Ledger' },
  MANA: { name: 'MANA' },
  BAT: { name: 'Basic Attention Token' },
  REQ: { name: 'Request' },
  GTO: { name: 'Gifto' },
  RDN: { name: 'Raiden' },
  APPC: { name: 'AppCoins' },
  ENG: { name: 'Enigma' },
  SALT: { name: 'Salt' },
  BQX: { name: 'Ethos' },
  AST: { name: 'AirSwap' },
  ZIL: { name: 'Zilliqa' },
  DAI: { name: 'DAI' },
  LINK: { name: 'Chain Link' },
  IOST: { name: 'IOStoken' },
  STORM: { name: 'Storm' },
  MOT: { name: 'Olympus Labs' },
  DGX: { name: 'Digix Gold' },
  ABT: { name: 'ArcBlock' },
  ENJ: { name: 'EnjinCoin' },
  AION: { name: 'Aion' },
  AE: { name: 'Aeternity' },
  BLZ: { name: 'Bluezelle' },
  PAL: { name: 'PolicyPal Network' },
  ELEC: { name: 'ElectrifyAsia' },
  BBO: { name: 'Bigbom' }
};

const currencies = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ether' },
  { symbol: 'REP', name: 'Augur' },
  { symbol: 'OMG', name: 'OhMyGod' }
];

const fiat = [
  { symbol: 'CHF', name: 'Swiss Franc' },
  { symbol: 'USD', name: 'US Dollar' },
  { symbol: 'EUR', name: 'Euro' }
];

const changellyCurrencies = [
  'SNT',
  'ADX',
  'OMG',
  'ELF',
  'KNC',
  'DAI',
  'STORJ ',
  'PTOY ',
  'TKN ',
  'FUN ',
  'NMR ',
  'RCN ',
  'VET ',
  'TKN '
];

const bityCurrencies = ['BTC', 'ETH', 'REP'];

const kyberCurrencies = [
  'OMG',
  'KNC',
  'SNT',
  'ELF',
  'POWR',
  'MANA',
  'BAT',
  'REQ',
  'GTO',
  'RDN',
  'APPC',
  'ENG',
  'SALT',
  'BQX',
  'ADX',
  'AST',
  'RCN',
  'ZIL',
  'DAI',
  'LINK',
  'IOST',
  'STORM',
  'MOT',
  'DGX',
  'ABT',
  'ENJ',
  'AION',
  'AE',
  'BLZ',
  'PAL',
  'ELEC',
  'BBO',
  'ETH'
];

export {
  currencyMasterList,
  currencies,
  changellyCurrencies,
  kyberCurrencies,
  bityCurrencies,
  fiat
};
