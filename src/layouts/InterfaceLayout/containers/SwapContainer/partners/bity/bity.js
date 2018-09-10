export default class Bity {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'https://bity.myetherapi.com';
    this.partnerUrl = options.partnerUrl || 'https://bity.com/api/v1/rate2/';
    this.decimals = 6;
    this.min = 0.01;
    this.max = 3;
    this.postHeaders = {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    };
  }

  async getRate() {
    // const rate = await fetch();
  }

  async getRates() {
    // const rate = await fetch(this.partnerUrl, { method: 'GET' });
  }

  buildOrder() {}

  submitOrder() {}
}
