import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import index_en from './locales/en/index.json';
import appGraphQL_es from './locales/es/appGraphQL.json';
import appGraphQL_en from './locales/en/appGraphQL.json';
import index_es from './locales/es/index.json';
import appModule_en from './locales/en/appModule.json';
import appModule_es from './locales/es/appModule.json';
import appSoap_en from './locales/en/appSoap.json';
import appSoap_es from './locales/es/appSoap.json';
import datasourceOra_en from './locales/en/datasourceOra.json';
import datasourceOra_es from './locales/es/datasourceOra.json';
import datasourceSqlServer_en from './locales/en/datasourceSqlServer.json';
import datasourceSqlServer_es from './locales/es/datasourceSqlServer.json';
import devops_en from './locales/en/devops.json';
import devops_es from './locales/es/devops.json';
import tokenApp_en from './locales/en/tokenApp.json';
import tokenApp_es from './locales/es/tokenApp.json';
import common_en from './locales/en/common.json';
import common_es from './locales/es/common.json';
import queue_en from './locales/en/queue.json';
import queue_es from './locales/es/queue.json';
import appWebSocket_en from './locales/en/appWebSocket.json';
import appWebSocket_es from './locales/es/appWebSocket.json';
import events_en from './locales/en/events.json';
import events_es from './locales/es/events.json';
import sftp_en from './locales/en/sftp.json';
import sftp_es from './locales/es/sftp.json';
import file_en from './locales/en/file.json';
import file_es from './locales/es/file.json';
import grpc_en from './locales/en/grpc.json';
import grpc_es from './locales/es/grpc.json';
import job_en from './locales/en/job.json';
import job_es from './locales/es/job.json';
import creditPricing_en from './locales/en/creditPricing.json';
import creditPricing_es from './locales/es/creditPricing.json'; 

i18n.use(initReactI18next).init({
  resources: {
    en: {
      index:index_en,
      appGraphQL:appGraphQL_en,
      appModule: appModule_en,
      appSoap: appSoap_en,
      datasourceOra: datasourceOra_en,
      datasourceSqlServer: datasourceSqlServer_en,
      devops: devops_en,
      tokenApp: tokenApp_en,
      common: common_en,
      queue: queue_en,
      appWebSocket: appWebSocket_en,
      events: events_en,
      sftp: sftp_en,
      file: file_en,
      grpc: grpc_en,
      job: job_en,
      creditPricing: creditPricing_en
      
    },
    es: {
      index:index_es,
      appGraphQL:appGraphQL_es,
      appModule: appModule_es,
      appSoap: appSoap_es,
      datasourceOra: datasourceOra_es,
      datasourceSqlServer: datasourceSqlServer_es,
      devops: devops_es,
      tokenApp: tokenApp_es,
      common: common_es,
      queue: queue_es,
      appWebSocket: appWebSocket_es,
      events: events_es,
      sftp: sftp_es,
      file: file_es,
      grpc: grpc_es,
      job: job_es,
      creditPricing: creditPricing_es
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;