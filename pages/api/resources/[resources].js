import fetchWrapper from '../../../helpers/fetch-wrapper';
import { getToken } from "next-auth/jwt"
const API_ENDPOINT = process.env.API_ENDPOINT;
const databases = `${API_ENDPOINT}/api/database/TypeDatabase`;
const TypeService = `${API_ENDPOINT}/api/database/getTypeService`;
const AppServer = `${API_ENDPOINT}/api/database/getTypeAppicationServer`;
const TOKEN = `${API_ENDPOINT}/api/client/token`;
const CLIENT = `${API_ENDPOINT}/api/client/client`;
const DEVOPS = `${API_ENDPOINT}/api/client/devops`;
const SAVE_DEVOPS = `${API_ENDPOINT}/api/client/saveDevops`;
const DELETE_DEVOPS = `${API_ENDPOINT}/api/client/deleteDevops`;
const DEPENDENCIES = `${API_ENDPOINT}/api/client/dependencies`;
const UPDATEDEPENDENCY = `${API_ENDPOINT}/api/client/updateDependency`;
const getTokenApp = `${API_ENDPOINT}/api/client/getTokenApp`;
const updateTokenAppActive = `${API_ENDPOINT}/api/client/updateTokenAppActive`;
const DELETETOKENAPP = `${API_ENDPOINT}/api/client/deleteTokenApp`;
const createTokenApp = `${API_ENDPOINT}/api/client/createTokenApp`;
const queueTypeService = `${API_ENDPOINT}/api/database/TypeQueueService`;
const producerServiceWith = `${API_ENDPOINT}/api/database/ProducerServiceWith`;
const getEventsClient = `${API_ENDPOINT}/api/client/getEventsClient`;
const PENDING_FILE = `${API_ENDPOINT}/api/generate/pendingFiles`;
const WALLET = `${API_ENDPOINT}/api/client/getWallet`;
const WALLET_ACTIVE = `${API_ENDPOINT}/api/client/activeWallet`;
const SIGN_OUT_BACKEND = `${API_ENDPOINT}/api/auth/signOut`;
const secret = process.env.NEXTAUTH_SECRET
export default async function handler(req, res) {
  const { resources, id, anioMes } = req.query
  if (req.method === 'POST') {
    // Process a GET request
    try {
      let result = ""
      console.log("resources:", resources)
      const session = await getToken({ req, secret })
      let clientToken = session ? session.user.accessToken : null
      let headers = {
        Authorization: "Bearer " + clientToken, "Content-Type": "application/json"
      }
      switch (resources) {
        case "TypeDatabase":
          result = await (fetchWrapper.post(`${databases}`, null, headers));
          res.status(200).json(result);
          break;
        case "getTypeService":
          console.log(req.body)
          result = await (fetchWrapper.post(`${TypeService}`, null, headers));
          res.status(200).json(result);
          break;
        case "getTypeAppicationServer":

          result = await (fetchWrapper.post(`${AppServer}`, null, headers));
          res.status(200).json(result);
          break;
        case "generateToken":
          result = await (fetchWrapper.post(`${TOKEN}`, JSON.stringify(req.body), headers));
          res.status(200).json(result);
          break;
        case "getClinet":
          console.log("CLIENT:  " + CLIENT)
          result = await (fetchWrapper.post(`${CLIENT}`, null, headers));
          res.status(200).json(result);
          break;
        case "devops":
          console.log("DEVOPS:  " + DEVOPS)
          result = await (fetchWrapper.post(`${DEVOPS}`, null, headers));
          res.status(200).json(result);
          break;
        case "saveDevops":
          console.log("SAVE_DEVOPS:  " + SAVE_DEVOPS)
          result = await (fetchWrapper.post(`${SAVE_DEVOPS}`, req.body, headers));
          res.status(200).json(result);
          break;
        case "deleteDevops":
          console.log("DELETE_DEVOPS:  " + DELETE_DEVOPS)
          result = await (fetchWrapper.post(`${DELETE_DEVOPS}?id=${id}`, null, headers));
          res.status(200).json(result);
          break;
        case "dependencies":
          console.log("DEPENDENCIES:  " + DEPENDENCIES)
          result = await (fetchWrapper.post(`${DEPENDENCIES}`, null, headers));
          res.status(200).json(result);
          break;
        case "updateDependency":
          console.log("UPDATEDEPENDENCY:  " + UPDATEDEPENDENCY)
          result = await (fetchWrapper.post(`${UPDATEDEPENDENCY}`, JSON.stringify(req.body), headers));
          res.status(200).json(result);
          break;
        case "getTokenApp":
          console.log("getTokenApp:  " + getTokenApp)
          result = await (fetchWrapper.post(`${getTokenApp}`, null, headers));
          res.status(200).json(result);
          break;
        case "updateTokenAppActive":
          console.log("updateTokenAppActive:  " + updateTokenAppActive)
          result = await (fetchWrapper.post(`${updateTokenAppActive}?id=${id}`, null, headers));
          res.status(200).json(result);
          break;
        case "deleteTokenApp":
          console.log("deleteTokenApp:  " + DELETETOKENAPP)
          result = await (fetchWrapper.post(`${DELETETOKENAPP}?id=${id}`, null, headers));
          res.status(200).json(result);
          break;
        case "createTokenApp":
          console.log("createTokenApp:  " + createTokenApp)
          result = await (fetchWrapper.post(`${createTokenApp}`, JSON.stringify(req.body), headers));
          res.status(200).json(result);
          break;
        case "queueTypeService":
          console.log(req.body)
          result = await (fetchWrapper.post(`${queueTypeService}`, null, headers));
          res.status(200).json(result);
          break;
        case "producerServiceWith":
          console.log(req.body)
          result = await (fetchWrapper.post(`${producerServiceWith}`, null, headers));
          res.status(200).json(result);
          break;
        case "getEventsClient":
          console.log("getEventsClient:  " + `${getEventsClient}?anioMes=${anioMes}`)
          result = await (fetchWrapper.post(`${getEventsClient}?anioMes=${anioMes}`, null, headers));
          res.status(200).json(result);
          break;
        case "pendingFiles":
          console.log("PENDING_FIL:  " + PENDING_FILE)
          result = await (fetchWrapper.post(`${PENDING_FILE}`, null, headers));
          res.status(200).json(result);
          break;
        case "getWallet":
          console.log("WALLET:  " + WALLET)
          result = await (fetchWrapper.post(`${WALLET}`, null, headers));
          res.status(200).json(result);
          break;
        case "singOutBackend":
          console.log("singOutBackend:  " + SIGN_OUT_BACKEND)
          result = await (fetchWrapper.post(`${SIGN_OUT_BACKEND}`, null, headers));
          res.status(200).json(result);
          break;
        case "singOutBackendForce":
          console.log("singOutBackendForce:  " + SIGN_OUT_BACKEND)
           const token = req.body.token;
          headers = {
            Authorization: "Bearer " + token, "Content-Type": "application/json"
          }
          result = await (fetchWrapper.post(`${SIGN_OUT_BACKEND}`, null, headers));
          res.status(200).json(result);
          break;
        case "activeWallet":
          const request = JSON.parse(req.body);
          console.log("WALLET_ACTIVE:  " + request)
          result = await (fetchWrapper.post(`${WALLET_ACTIVE}?id=${request.id}&active=${request.active}`, null, headers));
          if (result === true) {
            res.status(200).json({ status: 200, message: "ok" });
          } else {
            console.log("-------------------Fallo  activeWallet -------------------------", result.message)
            const data = {
              message: result.message,
              error: result.error,
              timestamp: new Date(),
              status: result.status
            };
            res.status(data.status).json(data)
          }
          break;
        default:
          console.warn("------------------- Resources api not found -------------------------", resources)
          res.status(404).json({ error: 'api not found', message: 'api not found' })
          break;

      }
    } catch (err) {
      res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: err.message })
    }
  }
}