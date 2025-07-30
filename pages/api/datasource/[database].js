import fetchWrapper from '../../../helpers/fetch-wrapper';
import { getToken } from "next-auth/jwt"
const API_ENDPOINT = process.env.API_ENDPOINT;
const GetAll = `${API_ENDPOINT}/api/database/getAllDatasource`;
const DATA_SOURCE = `${API_ENDPOINT}/api/database/getDatasourceDropDown`;
const SCHEMA = `${API_ENDPOINT}/api/database/getOrcleSchemas`;
const ALL_SCHEMA = `${API_ENDPOINT}/api/database/getAllOrcleSchemas`;
const PROCEDURE = `${API_ENDPOINT}/api/generate/getProcedures`;
const POST = `${API_ENDPOINT}/api/database/saveDatasource`;
const DELETE = `${API_ENDPOINT}/api/database/deleteDataSource`;
const TEST = `${API_ENDPOINT}/api/database/testConnection`;
const GENERATE = `${API_ENDPOINT}/api/generate/generateSchema`;
const DEPLOY = `${API_ENDPOINT}/api/generate/deployService`;
const GENEATEDEVOPS = `${API_ENDPOINT}/api/generate/generateDevops`;
const BINARY = `${API_ENDPOINT}/api/generate/generateBinary`;
const FILE_ZIP = `${API_ENDPOINT}/api/generate/getFileZip`;
const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req, res) {
  const { database, type, id, datasourceName, owner } = req.query
  if (req.method === 'POST') {
    // Process a GET request
    try {
      let result = ""
      const session = await getToken({ req, secret })
      let clientToken = session.user.accessToken
      let headers = {
        Authorization: "Bearer " + clientToken, "Content-Type": "application/json"
      }

      switch (database) {
        case "getAllDatasource":
          result = await (fetchWrapper.post(`${GetAll}?type=${type}`, null, headers));
          res.status(200).json(result);
          break;
        case "saveDatasource":
          result = await (fetchWrapper.post(`${POST}`, req.body, headers));
          res.status(200).json(result);
          break;
        case "deleteDataSource":
          result = await (fetchWrapper.post(`${DELETE}?id=${id}`, null, headers));
          res.status(200).json(result);
          break;
        case "testConnection":
          result = await (fetchWrapper.post(`${TEST}`, req.body, headers));
          res.status(200).json(result);
          break;
        case "getDatasourceDropDown":
          result = await (fetchWrapper.post(`${DATA_SOURCE}?type=${type}`, null, headers));
          res.status(200).json(result);
          break;
        case "getOrcleSchemas":
          result = await (fetchWrapper.post(`${SCHEMA}?datasourceName=${datasourceName}`, null, headers));
          res.status(200).json(result);
          break;
        case "getAllOrcleSchemas":
          result = await (fetchWrapper.post(`${ALL_SCHEMA}`, req.body, headers));
          res.status(200).json(result);
          break;
        case "getProcedures":
          result = await (fetchWrapper.post(`${PROCEDURE}?datasourceName=${datasourceName}&owner=${owner}`, null, headers));
          res.status(200).json(result);
          break;
        case "generateSchema":
          console.log("-------------------  generateSchema -------------------------")
          const controller = new AbortController();
          req.on('close', () => {
            console.warn("generateService --> Cliente cerró conexión, abortando petición hacia el servidor...");
            controller.abort();  // cancelas la petición hacia el otro servidor
          });
          result = await (fetchWrapper.downloadServerHeaders(`${GENERATE}`, JSON.stringify(req.body), headers, controller));
          if (result.status == 200) {
            const blob = await result.blob();
            const contentType =
              result.headers.get("content-type") || "application/octet-stream";
            const contentLength = result.headers.get("content-length") || blob.size;
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            console.log("disposition : ", result.headers.get('content-disposition'))
            res
              .status(200)
              .setHeader('Content-Disposition', result.headers.get('content-disposition'))
              .setHeader("Content-Type", contentType)
              .setHeader("Content-Length", contentLength)
              .send(buffer);
          } else {
            console.log("-------------------Fallo  generateSchema -------------------------")
            result.text().then(text => {
              if (text) {
                const data = JSON.parse(text);
                console.log("data", data)
                res.status(data.status).json({ data })
              } else {
                const data = {
                  message: result.statusText,
                  error: result.statusText,
                  timestamp: new Date(),
                  status: result.status
                };
                res.status(data.status).json({ data })
              }
            })

          }
          break;
        case "getFilezip":
          console.log("-------------------  getFilezip -------------------------", `${FILE_ZIP}/${id}`)
          const controllerFile = new AbortController();
          req.on('close', () => {
            console.warn("generateService --> Cliente cerró conexión, abortando petición hacia el servidor...");
            controllerFile.abort();  // cancelas la petición hacia el otro servidor
          });
          result = await (fetchWrapper.downloadServerHeaders(`${FILE_ZIP}/${id}`, null, headers, controllerFile));
          if (result.status == 200) {
            const blob = await result.blob();
            const contentType =
              result.headers.get("content-type") || "application/octet-stream";
            const contentLength = result.headers.get("content-length") || blob.size;
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            console.log("disposition : ", result.headers.get('content-disposition'))
            res
              .status(200)
              .setHeader('Content-Disposition', result.headers.get('content-disposition'))
              .setHeader("Content-Type", contentType)
              .setHeader("Content-Length", contentLength)
              .send(buffer);
          } else {
            console.log("-------------------Fallo  getFilezip -------------------------")
            result.text().then(text => {
              if (text) {
                const data = JSON.parse(text);
                console.log("data", data)
                res.status(data.status).json({ data })
              } else {
                const data = {
                  message: result.statusText,
                  error: result.statusText,
                  timestamp: new Date(),
                  status: result.status
                };
                res.status(data.status).json({ data })
              }
            })
          }
          break;
        case "generateDeploy":
          console.log("---------------------  generateDeploy -----------------------------")
          const controller2 = new AbortController();
          req.on('close', () => {
            console.warn("generateDeploy --> Cliente cerró conexión, abortando petición hacia el servidor...");
            controller2.abort();  // cancelas la petición hacia el otro servidor
          });
          result = await (fetchWrapper.downloadServerHeaders(`${DEPLOY}`, JSON.stringify(req.body), headers, controller2));
          if (result.status == 200) {
            res.status(200).json(result);
          } else {
            console.log("-------------------Fallo generateDeploy -------------------------")
            result.text().then(text => {
              if (text) {
                const data = JSON.parse(text);
                console.log("data", data)
                res.status(data.status).json({ data })
              } else {
                const data = {
                  message: result.statusText,
                  error: result.statusText,
                  timestamp: new Date(),
                  status: result.status
                };
                res.status(data.status).json({ data })
              }
            })
          }
          break;
        case "generateDevops":
          console.log("---------------------  generateDevops -----------------------------")
          console.log("URL:  ->  ", GENEATEDEVOPS)
          result = await (fetchWrapper.posServer(`${GENEATEDEVOPS}`, req.body, headers));
          if (result.status == 200) {
           res.status(200).json({ status: result.status });
          } else {
            console.log("-------------------Fallo generateDevops -------------------------")
            result.text().then(text => {
              if (text) {
                const data = JSON.parse(text);
                console.log("data", data)
                res.status(data.status).json(data)
              } else {
                const data = {
                  message: "INTERNAL_SERVER_ERROR",
                  error: "INTERNAL_SERVER_ERROR",
                  timestamp: new Date(),
                  status: result.status
                };
                res.status(data.status).json(data)
              }
            })
          }
          break;
        case "generateBinary":
          console.log("---------------------  generateBinary -----------------------------")
          result = await (fetchWrapper.posServer(`${BINARY}`, req.body, headers));
           if (result.status == 200) {
           res.status(200).json({ status: result.status });
          } else {
            console.log("-------------------Fallo generateDevops -------------------------")
            result.text().then(text => {
              if (text) {
                const data = JSON.parse(text);
                console.log("data", data)
                res.status(data.status).json(data)
              } else {
                const data = {
                  message: "INTERNAL_SERVER_ERROR",
                  error: "INTERNAL_SERVER_ERROR",
                  timestamp: new Date(),
                  status: result.status
                };
                res.status(data.status).json(data)
              }
            })
          }
          break;
        default:
          console.warn("-------------------Database api not found -------------------------", database)
          res.status(404).json({ error: 'api not found', message: 'api not found' })
          break;
      }
    } catch (err) {
      res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: err.message })
    }
  }
}