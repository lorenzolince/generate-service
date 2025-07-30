import fetchWrapper from '../helpers/fetch-wrapper';

const GET_INITIAL = '/api/quote/getInitialPricing';
const QUOTE = '/api/quote/quoteCreditPackage';
const GETCREDITCOSTS = '/api/quote/getCreditCosts';

const creditPricing = {
  getInitialPricing: async () => {
    return await fetchWrapper.post(`${GET_INITIAL}`);
  },

  quotePackage: async (data) => {
    return await fetchWrapper.post(`${QUOTE}`, JSON.stringify(data));
  },
  getCreditCosts: async () => {
    return await fetchWrapper.post(`${GETCREDITCOSTS}`);
  }
};

export default creditPricing;