import fetchWrapper from '../helpers/fetch-wrapper';
const GetAll = '/api/datasource/getAllDatasource';
const POST = '/api/datasource/saveDatasource';
const DELETE = '/api/datasource/deleteDataSource';
const TEST = '/api/datasource/testConnection';
const DataDropDown = '/api/datasource/getDatasourceDropDown';
const SCHEMA = '/api/datasource/getOrcleSchemas';
const ALL_SCHEMA = '/api/datasource/getAllOrcleSchemas';
const PROCEDURE = '/api/datasource/getProcedures';
const GENEATESERVICE = '/api/datasource/generateSchema';
const GENEATEDEPLOY= '/api/datasource/generateDeploy';
const GENEATESERVICE_SQLSERVER = '/api/datasource/generateServiceSqlServer';
const GENEATEDEPLOY_SQLSERVER= '/api/datasource/generateDeploySqlServer';
const PROCEDURE_SQLSERVER = '/api/datasource/getProceduresSqlServer';
const GENEATEDEVOPS= '/api/datasource/generateDevops';
const GENEATEDEVOPS_SQLSERVER= '/api/datasource/generateDevopsSqlServer';
const GENEATEBINARY= '/api/datasource/generateBinary';
const FILE_ZIP= '/api/datasource/getFilezip';
const datasource = {
    getAll: async (type) => {
        return await (fetchWrapper.post(`${GetAll}?type=${type}`));
    },
    Save: async (data) => {
        return await (fetchWrapper.post(`${POST}`, data));
    },
    Delete: async (id) => {
        return await (fetchWrapper.post(`${DELETE}?id=${id}`));
    },
    Test: async (data) => {
        return await (fetchWrapper.post(`${TEST}`, data));
    },
    getDatasourceDropDown: async (type) => {
        return await (fetchWrapper.post(`${DataDropDown}?type=${type}`));
    },  getOrcleSchemas: async (database) => {
        return await (fetchWrapper.post(`${SCHEMA}?datasourceName=${database}`));
    },
    getAllOrcleSchemas: async (data) => {
        return await (fetchWrapper.post(`${ALL_SCHEMA}`, data));
    }
    , getProcedures: async (datasourceName,owner) => {
        return await (fetchWrapper.post(`${PROCEDURE}?datasourceName=${datasourceName}&owner=${owner}`));
    },
    generateService: async (data) => {
        return await (fetchWrapper.downloadZip(`${GENEATESERVICE}`, JSON.stringify(data)));
    },
    generateDeploy: async (data) => {
        return await (fetchWrapper.postForm(`${GENEATEDEPLOY}`, JSON.stringify(data)));
    },
    generateDevops: async (data) => {
        return await (fetchWrapper.post(`${GENEATEDEVOPS}`, JSON.stringify(data)));
    },
    getProceduresSqlServer: async (datasourceName) => {
        return await (fetchWrapper.post(`${PROCEDURE_SQLSERVER}?datasourceName=${datasourceName}`));
    }, generateServiceSqlServer: async (data) => {
        return await (fetchWrapper.downloadZip(`${GENEATESERVICE_SQLSERVER}`, JSON.stringify(data)));
    },
    generateDeploySqlServer: async (data) => {
        return await (fetchWrapper.post(`${GENEATEDEPLOY_SQLSERVER}`, JSON.stringify(data)));
    },
    generateDevopsSqlServer: async (data) => {
        return await (fetchWrapper.post(`${GENEATEDEVOPS_SQLSERVER}`, JSON.stringify(data)));
    },  generateBinary: async (data) => {
        return await (fetchWrapper.post(`${GENEATEBINARY}`, JSON.stringify(data)));
    },
    downLoadFileZip: async (id) => {
        return await (fetchWrapper.downloadZip(`${FILE_ZIP}?id=${id}`, null));
    },
}

export default datasource;
