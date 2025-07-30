import fetchWrapper from '../../../helpers/fetch-wrapper';
import { getToken } from "next-auth/jwt";

const API_ENDPOINT = process.env.API_ENDPOINT;
const GET_INITIAL_PRICING = `${API_ENDPOINT}/api/creditPricing/getInitialPricing`;
const QUOTE = `${API_ENDPOINT}/api/creditPricing/quote`;
const GETCREDITCOSTS = `${API_ENDPOINT}/api/creditPricing/getCreditCosts`;

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const { quote } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method allowed' });
  }

  try {
    const session = await getToken({ req, secret });
    const token = session?.user?.accessToken;

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    let result;

    switch (quote) {
      case 'getInitialPricing':
        console.log("Fetching initial pricing:", GET_INITIAL_PRICING);
        result = await fetchWrapper.post(GET_INITIAL_PRICING, null, headers);
        res.status(200).json(result);
        break;

      case 'quoteCreditPackage':
         console.log("Fetching initial pricing:",  req.body);
        result = await fetchWrapper.post(QUOTE, req.body, headers);
        res.status(200).json(result);
        break;
   case 'getCreditCosts':
        result = await fetchWrapper.post(GETCREDITCOSTS, null, headers);
        res.status(200).json(result);
        break;
      default:
        console.warn('⛔ Operation not found:', operation);
        res.status(404).json({ error: 'api not found', message: 'Invalid operation' });
        break;
    }
  } catch (err) {
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: err.message });
  }
}