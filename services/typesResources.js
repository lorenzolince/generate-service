import fetchWrapper from '../helpers/fetch-wrapper';
const databases = '/api/resources/TypeDatabase';
const TypeService = '/api/resources/getTypeService';
const AppServer = '/api/resources/getTypeAppicationServer';
const TOKEN = '/api/resources/generateToken';
const DomainService = '/api/resources/DomainService';
const DEVOPS = `/api/resources/devops`;
const DEPENDENCIES = `/api/resources/dependencies`;
const UPDATEDEPENDENCY = `/api/resources/updateDependency`;
const SAVE_DEVOPS = `/api/resources/saveDevops`;
const DELETE_DEVOPS = `/api/resources/deleteDevops`;
const GETTOKENAPP = `/api/resources/getTokenApp`;
const UPDATETOKENAPPACTIVE = `/api/resources/updateTokenAppActive`;
const DELETETOKENAPP = `/api/resources/deleteTokenApp`;
const CREATETOKENAPP = `/api/resources/createTokenApp`;
const queueTypeService = '/api/resources/queueTypeService';
const producerServiceWith = '/api/resources/producerServiceWith';
const getEventsClient = '/api/resources/getEventsClient';
const PENDING_FILE = '/api/resources/pendingFiles';
const WALLET = '/api/resources/getWallet';
const WALLET_ACTIVE = '/api/resources/activeWallet';
const SIGN_OUT_BACKEND = '/api/resources/singOutBackend';
const typesResources = {
    getTypeDatabase: async () => {
        return await (fetchWrapper.post(`${databases}`));
    },
    getTypeService: async () => {
        return await (fetchWrapper.post(`${TypeService}`));
    },
    getTypeAppicationServer: async () => {
        return await (fetchWrapper.post(`${AppServer}`));
    },
    generateToken: async (data) => {
        return await (fetchWrapper.post(`${TOKEN}`, JSON.stringify(data)));
    },
    getDomain: async () => {
        return await (fetchWrapper.post(`${DomainService}`));
    },
    getDevops: async () => {
        return await (fetchWrapper.post(`${DEVOPS}`));
    },
    saveDevops: async (data) => {
        return await (fetchWrapper.post(`${SAVE_DEVOPS}`, data));
    },
    deleteDevops: async (id) => {
        return await (fetchWrapper.post(`${DELETE_DEVOPS}?id=${id}`));
    },
    getDependencies: async () => {
        return await (fetchWrapper.post(`${DEPENDENCIES}`));
    },
    updateDependency: async (data) => {
        return await (fetchWrapper.post(`${UPDATEDEPENDENCY}`, data));
    },
    getTokenApp: async () => {
        return await (fetchWrapper.post(`${GETTOKENAPP}`));
    },
    updateTokenAppActive: async (id) => {
        return await (fetchWrapper.post(`${UPDATETOKENAPPACTIVE}?id=${id}`));
    },
    createTokenApp: async (data) => {
        return await (fetchWrapper.post(`${CREATETOKENAPP}`, data));
    },
    deleteTokenApp: async (id) => {
        return await (fetchWrapper.post(`${DELETETOKENAPP}?id=${id}`));
    }, getTypeQueueService: async () => {
        return await (fetchWrapper.post(`${queueTypeService}`));
    }, getProducerServiceWith: async () => {
        return await (fetchWrapper.post(`${producerServiceWith}`));
    }, getEventsClient: async (anioMes) => {
        return await (fetchWrapper.post(`${getEventsClient}?anioMes=${anioMes}`));
    },
    getSourceApp: async () => {
        return await ([{ id: 1, description: "DATABASE" }, { id: 2, description: "API_SOURCES" }]);
    },
    getPendingFiles: async () => {
        return await (fetchWrapper.post(`${PENDING_FILE}`));
    },
    getWallet: async () => {
        return await (fetchWrapper.post(`${WALLET}`));
    },
    activeWallet: async (data) => {
        return await (fetchWrapper.post(`${WALLET_ACTIVE}`, JSON.stringify(data)));
    },
      singOutBackend: async () => {
        return await (fetchWrapper.post(`${SIGN_OUT_BACKEND}`, null));
    },
}

export default typesResources;