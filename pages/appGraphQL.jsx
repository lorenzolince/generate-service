import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert2/dist/sweetalert2.min.js';

import typesResources from '../services/typesResources';
import dataSources from '../services/datasource';
import AppRest from '../components/AppRest';
import DataGrid from '../components/common/DataGrid';
import Link from 'next/link';
import ApiSourcesGrid from '../components/ApiSourcesGrid';

const appGraphQL = () => {

    const { t, lang } = useTranslation();
    const [appicationServer, setAppicationServe] = useState(null);
    const [datasourceDropDown, setDatasourceDropDown] = useState(null);
    const [typeDataBase, setTypeDataBase] = useState(null);
    const [dataBaseType, setDataBaseType] = useState(null);
    const [schemas, setSchemas] = useState(null);
    const [owner, setOwner] = useState(null);
    const [dataProcedures, setDataProcedures] = useState(null);
    const [dataSourceName, setDataSourceName] = useState(null);
    const [proceduresGenerate, setProceduresGenerate] = useState([]);
    const [appServer, setAppServer] = useState("EMBEDDED");
    const [columnsHiden, setColumnsHiden] = useState(["name", "type", "ResulsetValue", "senderType"]);
    const [devops, setDevops] = useState({});
    const [sources, setSources] = useState("DATABASE");
    const [appicationSources, setAppicationSources] = useState([]);
    const [sourcesData, setSourcesData] = useState([]);
    const [test, setTest] = useState(false);

    const generateSchema = Yup.object().shape({
        name: Yup.string()
            .required(t('common:valRequiredField').replace("[field]", t('common:nameProyect')))
            .test(
                "no-spaces",
                t('common:valNoSpaces'),
                value => !/\s/.test(value)
            )
            .matches(
                /^(?![._])(?!.*[._]$)(?!.*[._]{2})[a-zA-Z0-9._]+(?<![._])$/, // Regex que permite solo letras, números, puntos, guiones bajos y guiones
                t('common:valNoSpecialChars') // Mensaje de error si contiene caracteres especiales
            ),
        domain: Yup.string()
            .required(t('common:valRequiredField').replace("[field]", t('common:domainProyect')))
            .test(
                "no-spaces",
                t('common:valNoSpaces'),
                value => !/\s/.test(value)
            )
            .matches(
                /^(?![._])(?!.*[._]$)(?!.*[._]{2})[a-zA-Z0-9._]+(?<![._])$/, // Regex que permite solo letras, números, puntos, guiones bajos y guiones
                t('common:valNoSpecialChars') // Mensaje de error si contiene caracteres especiales
            ),

    });
    const { register, handleSubmit, reset, setValue, formState, formState: { errors } } = useForm({
        resolver: yupResolver(generateSchema)
    });
    const onClicDelete = async (row, rowIndex) => {
        setSourcesData([])
        row.splice(rowIndex, 1);
        setSourcesData(row)
    }
    const onClicAdd = async (row) => {
        const isRepeated = sourcesData.some(item => item.nameMethod === row.nameMethod)
        if (isRepeated) {
            swal.fire({
                title: t('common:alertTitleRepeted'),
                text: t('common:alertRepetdText'),
                icon: "warning",
                dangerMode: true,
                buttons: false,
                timer: 3500

            })
        }
        if (!isRepeated) {
            let newRow = []
            sourcesData.forEach(function (e, i) {
                newRow.push(e)
            })
            newRow.push({
                sourceType: row.sourceType,
                nameMethod: row.nameMethod,
                senderAuth: row.senderAuth,
                endpoint: row.endpoint,
                typeMethod: row.typeMethod,
                parameterType: row.parameterType,
                host: row.host,
                port: row.port,
                schema: row.schema,
                fileName: row.fileName,
                headers: row.headers
            })

            setSourcesData(newRow)
        }
    }
    const onChangeSources = async (value) => {
        setSources(value)
        setValue("typeDataBase", "")
        setValue("dataSources", "")
        setValue("schema", "")
        setSourcesData([])
        setDatasourceDropDown(null)
        setTypeDataBase(null)
        setSchemas(null)
        setOwner(null)
        setDataProcedures(null)
        setProceduresGenerate([])
    }
    const getDevops = async () => {
        try {
            const response = await typesResources.getDevops();
            return response
        }
        catch (error) {
        }
    }
    const fetchDevops = async () => {
        return Promise.all([
            getDevops()
        ]).then(([data]) => {
            return { data };
        });
    }
    const generateProcedure = async (procedure) => {
        try {
            let inputProcedure = []
            procedure = procedure.filter(item1 =>
                !proceduresGenerate.some(item2 => item1.id === item2.id)
            );
            proceduresGenerate.forEach(function (e, i) {
                inputProcedure.push(e)
            })

            procedure.forEach(function (e) {
                inputProcedure.push(e)
            })
            inputProcedure.forEach(function (e, i) {
                e.ResulsetValue = 0
                if (e.type === "P" || e.type === "PROCEDURE") {
                    e.Resulset = <Link href="#" onClick={(e) => resulsetSp(e, i, inputProcedure)} variant="danger" size="sm" >{e.ResulsetValue}</Link>
                } else {
                    e.Resulset = ""
                }
                e.Delete = <Button onClick={(e) => deleteSp(e, i, inputProcedure)} variant="danger" size="sm" >{t('common:btnDelete')}</Button>

            })

            if (typeDataBase == "SQL_SERVER" || typeDataBase == "MY_SQL") {
                setColumnsHiden(["id", "name", "type", "owner", "packNme", "ResulsetValue", "senderType"])
            } else if (typeDataBase == "POSTGRES") {
                setColumnsHiden(["name", "type", "owner", "packNme", "ResulsetValue", "Resulset", "senderType"])
            } else {
                setColumnsHiden(["id", "name", "ResulsetValue", "Resulset", "senderType"])
            }
            setProceduresGenerate(inputProcedure)
        }
        catch (error) {
            console.log(error)
        }
    }
    const deleteSp = async (e, rowIndex, data) => {
        setProceduresGenerate((prevProcedures) =>
            prevProcedures.filter((_, index) => index !== rowIndex) // Excluye el elemento del índice
        );

    }
    const resulsetSp = async (e, index, data) => {
        swal.fire({
            title: t('appGraphQL:titleAlertResulset'),
            text: t('appGraphQL:textAlertResulset'),
            icon: "success",
            input: "text",
            buttons: true,
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const procedure = []
                data[index].ResulsetValue = result.value
                data.forEach(function (e, i) {
                    procedure.push(e);
                })
                procedure.forEach(function (e, i) {
                    if (e.type === "P" || e.type === "PROCEDURE") {
                        e.Resulset = <Link href="#" onClick={(e) => resulsetSp(e, i, procedure)} variant="danger" size="sm" >{e.ResulsetValue}</Link>
                    } else {
                        e.Resulset = ""
                    }
                    e.Delete = <Button onClick={(e) => deleteSp(e, i, procedure)} variant="danger" size="sm" >{t('common:btnDelete')}</Button>
                })
                setProceduresGenerate(procedure);
            }
        });


    }
    const getDataSources = async (type) => {
        try {
            const response = await dataSources.getDatasourceDropDown(type);
            return response
        }
        catch (error) {
        }
    }

    const getProcedures = async (datasourceName, owner) => {
        try {
            const response = await dataSources.getProcedures(datasourceName, owner);
            return response
        }
        catch (error) {
        }
    }

    const getOrcleSchemas = async (database) => {
        try {
            const response = await dataSources.getOrcleSchemas(database);
            return response
        }
        catch (error) {
        }
    }
    const getTypeDataBase = async () => {
        try {
            const response = await typesResources.getTypeDatabase();
            return response
        }
        catch (error) {
        }
    }
    const getTypeAppicationServer = async () => {
        try {
            const response = await typesResources.getTypeAppicationServer();

            return response
        }
        catch (error) {
        }
    }
    const getAppicationSources = async () => {
        try {
            const response = await typesResources.getSourceApp();
            return response
        }
        catch (error) {
        }
    }
    const onChangeAppService = async (value) => {
        setAppServer(value)
    }
    const onChangeDatabase = async (value) => {
        if (value !== "") {
            if (sources === "DATABASE") {
                let dataSource = await fetchDataSource(value);
                dataSource.data.unshift({ id: "", name: "" });
                setDatasourceDropDown(null)
                setTypeDataBase(null)
                setSchemas(null)
                setOwner(null)
                setDataProcedures(null)
                setProceduresGenerate([])
                setDatasourceDropDown(dataSource.data)
                setTypeDataBase(value)
            } else {
                setTypeDataBase(value)
            }
        } else {
            setDatasourceDropDown(null)
            setTypeDataBase(null)
            setSchemas(null)
            setOwner(null)
            setDataProcedures(null)
            setProceduresGenerate([])

        }
    }
    const onChangeDataSource = async (value, type) => {
        setProceduresGenerate([])
        if (value !== "") {
            if (type === "ORACLE") {
                let schemasList = []
                setDataSourceName(value)
                let schemas = await fetchOrcleSchemas(value);
                schemasList.push({ id: "", description: "" });
                schemas.data.forEach(function (item, index) {
                    schemasList.push({ id: index, description: item });
                });
                setSchemas(schemasList);
            } else {
                setSchemas(null)
                setDataSourceName(value)
                let procedures = await fetchProcedures(value);
                let proceduresChild = [];
                let functionChild = [];
                let data = []
                procedures.data.procedures.forEach(function (item) {
                    proceduresChild.push({
                        id: item.id,
                        label: item.name,
                        value: item.type,
                        disabled: false,
                        children: []
                    });
                });
                procedures.data.functions.forEach(function (item) {
                    functionChild.push({
                        id: item.id,
                        label: item.name,
                        value: item.type,
                        disabled: false,
                        children: []
                    });
                });
                data.push({
                    label: "PROCEDURES",
                    value: "PROCEDURES",
                    disabled: true,
                    children: proceduresChild
                });
                data.push({
                    label: "FUNCTIONS",
                    value: "FUNCTIONS",
                    disabled: true,
                    children: functionChild
                });
                setDataProcedures(data)

            }
        }
    }
    const onChangeSchemas = async (dataSourceName, owner) => {
        setOwner(owner)
        let procedures = await fetchProcedures(dataSourceName, owner);
        let proceduresChild = [];
        let functionChild = [];
        let packagesChild = [];
        let data = []
        procedures.data.procedures.forEach(function (item) {
            proceduresChild.push({
                id: item.id,
                label: item.name,
                value: item.type,
                disabled: false,
                children: []
            });
        });
        procedures.data.functions.forEach(function (item) {
            functionChild.push({
                id: item.id,
                label: item.name,
                value: item.type,
                disabled: false,
                children: []
            });
        });
        procedures.data.packages.forEach(function (item) {
            let pkgProceduresChild = [];
            item.procedure.forEach(function (p) {
                pkgProceduresChild.push({
                    id: p.id,
                    label: p.name,
                    value: "PACKAGE," + p.type + "," + item.name,
                    disabled: false,
                    children: []
                });


            });
            packagesChild.push({
                id: item.id,
                label: item.name,
                value: item.name,
                disabled: true,
                children: pkgProceduresChild
            });
        });

        data.push({
            label: "PROCEDURES",
            value: "PROCEDURES",
            disabled: true,
            children: proceduresChild
        });
        data.push({
            label: "FUNCTIONS",
            value: "FUNCTIONS",
            disabled: true,
            children: functionChild
        });
        data.push({
            label: "PACKAGES",
            value: "PACKAGES",
            disabled: true,
            children: packagesChild
        });
        setDataProcedures(data)
    }
    const onSubmit = async (data) => {
        await generateDataApp(data, "GRAPHQL")
    }
    const onSubmitDeploy = async (data) => {
        await generateDataApp(data, "DEPLOY")
    }
    const onSubmitShema = async (data) => {
        await generateDataApp(data, "GRAHPQL_XSD")

    }
    const onSubmitBinary = async (data) => {
        await generateDataApp(data, "BINARY")
    }
    const generateDataApp = async (data, schema) => {
        let sps = []
        let app = []
        proceduresGenerate.forEach(function (item) {
            sps.push({
                "id": item.id,
                "owner": item.owner,
                "pakagesName": item.packNme,
                "procedureName": item.nameMethod,
                "type": item.typeMethod,
                "typeObject": item.type,
                "resulSetCount": item.ResulsetValue
            })
        })
        sourcesData.forEach(function (item) {
            app.push({
                "sourceType": item.sourceType,
                "nameMethod": item.nameMethod,
                "endpoint": item.endpoint,
                "typeMethod": item.typeMethod,
                "auth": item.senderAuth === "NO_AUTH" ? false : true,
                "parameterType": item.parameterType,
                "schema": item.schema,
                "host": item.host,
                "port": item.port,
                "nameFile": item.fileName,
                "headers": item.headers
            })
        })
        let datagenerate = {
            "datasourceName": data.dataSources,
            "domain": data.domain,
            "jndi": data.jndi ? data.jndi : "",
            "projectName": data.name,
            "sps": sps,
            "appsSrc": app,
            "typeApp": data.applicationService,
            "typeSevice": schema,
            "typeDataBase": typeDataBase,
            "sourceType": sources,
            "test": test
        }
        let generateDocument = {};
        if (schema === "GRAHPQL_XSD") {
            generateDocument = await dataSources.generateService(datagenerate)
            if (generateDocument.status == 200) {
                swal.fire({
                    title: t('common:alertTitleXsd'),
                    text: t('common:alertTextXsd'),
                    icon: "success",
                    timer: 1500,
                    buttons: false,
                }).then(() => {
                    // reloadData();
                });

            } else {
                swal.fire({
                    title: generateDocument.error,
                    html: generateDocument.message,
                    icon: "error",
                }).then(() => {
                });

            }

        }
        else if (schema === "BINARY") {
            datagenerate.typeSevice = "GRAPHQL";
            generateDocument = await dataSources.generateBinary(datagenerate)
            if (generateDocument.status == 200) {
                reloadData();
                reset({ domain: "", name: "", applicationService: "EMBEDDED", appicationSources: "DATABASE", typeDataBase: "", dataSources: "", schema: "" });
                swal.fire({
                    title: t('common:alertBinaryTitle'),
                    text: t('common:alertBinaryText'),
                    icon: "success",
                    buttons: false,
                });
            } else {
                swal.fire({
                    title: generateDocument.error,
                    html: generateDocument.message,
                    icon: "error",
                }).then(() => {
                });

            }
        } else if (schema === "DEVOPS") {
            datagenerate.typeSevice = "GRAPHQL";
            datagenerate.devopName = data.devopName
            generateDocument = await dataSources.generateDevops(datagenerate)
            if (generateDocument.status == 200) {
                reloadData();
                reset({ domain: "", name: "", applicationService: "EMBEDDED", appicationSources: "DATABASE", typeDataBase: "", dataSources: "", schema: "" });
                swal.fire({
                    title: t('common:alertDevOpsTitle'),
                    text: t('common:alertTextDevOps'),
                    icon: "success",
                    timer: 1500,
                    buttons: false,
                });
            } else {
                swal.fire({
                    title: generateDocument.error,
                    html: generateDocument.message,
                    icon: "error",
                }).then(() => {
                });
            }
        }

    }


    const fetchServices = async () => {
        return Promise.all([
            getTypeAppicationServer(),
            getTypeDataBase(),
            getAppicationSources()
        ]).then(([data, dataBase, sources]) => {
            return { data, dataBase, sources };
        });
    }
    const fetchDataSource = async (type) => {
        return Promise.all([
            getDataSources(type)
        ]).then(([data]) => {
            return { data };
        });
    }
    const fetchOrcleSchemas = async (database) => {
        return Promise.all([
            getOrcleSchemas(database)
        ]).then(([data]) => {
            return { data };
        });
    }
    const fetchProcedures = async (database, owner) => {
        return Promise.all([
            getProcedures(database, owner)
        ]).then(([data]) => {
            return { data };
        });
    }

    const reloadData = async () => {
        setDatasourceDropDown(null)
        setTypeDataBase(null)
        setDataBaseType(null)
        setSchemas(null)
        setOwner(null)
        setTest(false)
        setDataProcedures(null)
        setDataSourceName(null)
        setProceduresGenerate([])
        setSourcesData([])
        setSources("DATABASE")
        setValue("appicationSources", "DATABASE");
        let appServer = await fetchServices();
        let applicationService = [];
        let database = [];
        database.push({ id: "", description: "" });
        appServer.data.forEach(function (item, index) {
            applicationService.push({ id: index, description: item });
        });
        appServer.dataBase.forEach(function (item, index) {
            database.push({ id: index, description: item });
        });
        setAppicationServe(applicationService);
        setAppicationSources(appServer.sources);
        setDataBaseType(database);
        let devops = await fetchDevops();
        setDevops(devops.data)
        setAppServer("EMBEDDED")
    }

    const devopsInfo = async (data) => {
        let value = "";

        // Generar `<select>` dinámicamente
        const select = document.createElement('select');
        const option1 = document.createElement('option');
        option1.value = "";
        option1.innerHTML = 'Seleccione una opción';
        select.appendChild(option1);

        devops.filter(d => d.typeAppServer === appServer).forEach(item => {
            let option = document.createElement('option');
            option.innerHTML = item.name;
            option.value = item.name;
            select.appendChild(option);
        });

        // Mostrar alerta con `<select>` dinámico
        swal.fire({
            title: t('appGraphQL:titleAlertDevops'),
            html: `<div id="swal-container"></div>`, // Contenedor donde insertaremos el `<select>`
            showCancelButton: true,
            confirmButtonText: t('common:btnOk'),
            cancelButtonText: t('common:btnCancel'),
            didOpen: () => {
                // 🔥 Insertamos el `<select>` en la alerta después de que se renderiza
                document.getElementById('swal-container').appendChild(select);
                select.onchange = (e) => {
                    value = e.target.value;
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed && value !== "") {
                data.devopName = value;
                await generateDataApp(data, "DEVOPS");
            }
        });
    };

    useEffect(() => {
        reloadData();
    }, []);

    return (
        <>
            <title>{t('appGraphQL:title')}</title>
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <h3>{t('appGraphQL:title')}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 2, offset: 0 }}>
                            <Form.Group>
                                <Form.Label htmlFor="name" >{t('appGraphQL:name')}</Form.Label>
                                <Form.Control name="name"  {...register("name")} className={`form-control ${errors.name ? 'is-invalid' : ''}`} type="text" >
                                </Form.Control>
                                <div className="invalid-feedback">{errors.name?.message}</div>
                            </Form.Group>
                        </Col>
                        <Col md={{ span: 2, offset: 0 }}>
                            <Form.Group>
                                <Form.Label htmlFor="domain" >{t('appGraphQL:domain')}</Form.Label>
                                <Form.Control name="domain"  {...register("domain")} className={`form-control ${errors.domain ? 'is-invalid' : ''}`} type="text" placeholder="com.example.domain">
                                </Form.Control>
                                <div className="invalid-feedback">{errors.domain?.message}</div>
                            </Form.Group>
                        </Col>
                        <Col md={{ span: 2, offset: 0 }}>
                            {
                                appicationServer ?
                                    <Form.Group>
                                        <Form.Label htmlFor={'applicationService'} >{t('appGraphQL:applicationService')}</Form.Label>
                                        <Form.Control name="applicationService"  {...register("applicationService", { onChange: (e) => onChangeAppService(e.target.value) })} id="applicationService" className={`form-control ${errors.applicationService ? 'is-invalid' : ''}`} as="select">
                                            {
                                                appicationServer.map((item) =>
                                                    <option key={item.id} value={item.description}> {item.description} </option>
                                                )
                                            }
                                        </Form.Control>
                                        <div className="invalid-feedback">{errors.applicationService?.message}</div>
                                    </Form.Group>
                                    : null
                            }
                        </Col>
                        <Col md={{ span: 2, offset: 0 }}>
                            {
                                appicationSources ?
                                    <Form.Group>
                                        <Form.Label htmlFor={'appicationSources'} >{t('index:appicationSources')}</Form.Label>
                                        <Form.Control name="appicationSources"  {...register("appicationSources", { onChange: (e) => onChangeSources(e.target.value) })} id="appicationSources" className={`form-control ${errors.appicationSources ? 'is-invalid' : ''}`} as="select">
                                            {
                                                appicationSources.map((item) =>
                                                    <option key={item.id} value={item.description}> {item.description} </option>
                                                )
                                            }
                                        </Form.Control>
                                        <div className="invalid-feedback">{errors.appicationSources?.message}</div>
                                    </Form.Group>
                                    : null
                            }
                        </Col>
                        <Col md={{ span: 2, offset: 1 }}>
                            {
                                dataBaseType ?
                                    <Form.Group>
                                        <Form.Label htmlFor={'typeDataBase'} >{t('appGraphQL:typeDataBase')}</Form.Label>
                                        <Form.Control name="typeDataBase"  {...register("typeDataBase", { onChange: (e) => onChangeDatabase(e.target.value) })} id="typeDataBase" className={`form-control ${errors.typeDataBase ? 'is-invalid' : ''}`} as="select">
                                            {
                                                dataBaseType.map((item) =>
                                                    <option key={item.id} value={item.description}> {item.description} </option>
                                                )
                                            }
                                        </Form.Control>
                                        <div className="invalid-feedback">{errors.typeDataBase?.message}</div>
                                    </Form.Group> : null

                            }
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col md={{ span: 2, offset: 0 }}>
                            {
                                datasourceDropDown ?
                                    <Form.Group>
                                        <Form.Label htmlFor={'dataSources'} >{t('appGraphQL:dataSources')}</Form.Label>
                                        <Form.Control name="dataSources"  {...register("dataSources", { onChange: (e) => onChangeDataSource(e.target.value, typeDataBase) })} id="dataSources" className={`form-control ${errors.dataSources ? 'is-invalid' : ''}`} as="select">
                                            {
                                                datasourceDropDown.map((item) =>
                                                    <option key={item.id} value={item.name}> {item.name} </option>
                                                )
                                            }
                                        </Form.Control>
                                        <div className="invalid-feedback">{errors.dataSources?.message}</div>
                                    </Form.Group> : null

                            }
                        </Col>
                        {(appServer != "EMBEDDED" && appServer != "TOMCAT" && dataBaseType != null) &&
                            <Col md={{ span: 2, offset: 1 }}>

                                <Form.Group>
                                    <Form.Label htmlFor="jndi" >{t('appGraphQL:jndi')}</Form.Label>
                                    <Form.Control name="jndi"  {...register("jndi")} className={`form-control ${errors.port ? 'is-invalid' : ''}`} type="text" placeholder="java:/exampleDs">
                                    </Form.Control>
                                </Form.Group>


                            </Col>
                        }
                        <Col md={{ span: 2, offset: 1 }}>
                            {
                                schemas ?
                                    <Form.Group>
                                        <Form.Label htmlFor={'schema'} >{t('appGraphQL:schema')}</Form.Label>
                                        <Form.Control name="schema"  {...register("schema", { onChange: (e) => onChangeSchemas(dataSourceName, e.target.value) })} id="schema" className={`form-control ${errors.schema ? 'is-invalid' : ''}`} as="select">
                                            {
                                                schemas.map((item) =>
                                                    <option key={item.id} value={item.description}> {item.description} </option>
                                                )
                                            }
                                        </Form.Control>
                                        <div className="invalid-feedback">{errors.schema?.message}</div>
                                    </Form.Group> : null

                            }
                        </Col>
                        {dataProcedures &&
                            <Col md={{ span: 2, offset: 1 }}>
                                <Form.Group>
                                    <Form.Label htmlFor={'procedures'} >{t('appGraphQL:procedures')}</Form.Label>
                                    <AppRest item={dataProcedures} owner={owner} setProcedures={generateProcedure}></AppRest>
                                </Form.Group>
                            </Col>
                        }

                    </Row>
                    <br></br>
                    <Row>
                        {
                            proceduresGenerate.length > 0 && sources === "DATABASE" ?
                                <Col>
                                    <DataGrid data={proceduresGenerate} schemaColumns="index" hiddenColumns={columnsHiden} pagination={true} />
                                </Col>
                                : null

                        }
                        {
                            sources === "API_SOURCES" ?
                                <Col>
                                    <ApiSourcesGrid
                                        data={sourcesData}
                                        schemaColumns="common"
                                        hiddenColumns={["typeMethod", "parameterType", "schema", "host", "port", "sender", "fileInput", "saveFile", "isProducer", "isConsumer", "headers", "senderType"]}
                                        pagination={true}
                                        setParameters={setSourcesData}
                                        onClicAdd={onClicAdd}
                                        onClicDelete={onClicDelete}
                                    >
                                    </ApiSourcesGrid>
                                </Col>
                                : null

                        }
                        <br></br>
                    </Row>
                    {
                        proceduresGenerate.length > 0 || sourcesData.length > 0 ?
                            <Row>
                                <Col>
                                    <Form.Check type="checkbox" checked={test} label={t('common:labelTestApi')}
                                        id={`test-switch`} onChange={(e) => setTest(e.target.checked)} inline
                                    />
                                </Col>
                                <Col >
                                    <Button className="common-button-color" type="submit" disabled={formState.isSubmitting} onClick={handleSubmit(onSubmitBinary)}>
                                        {t('appGraphQL:btntestBinary')}
                                    </Button>
                                </Col>
                                {
                                    <Col>
                                        <Button className="common-button-color" type="submit" disabled={formState.isSubmitting} onClick={handleSubmit(onSubmitShema)}>
                                            {t('appGraphQL:btnGenerateSchena')}
                                        </Button>
                                    </Col>
                                }
                                <Col >
                                    <Button className="common-button-color" type="button" disabled={formState.isSubmitting} onClick={
                                        async () => {
                                            let value = "";

                                            // Generar `<select>` dinámicamente
                                            const select = document.createElement('select');
                                            const option1 = document.createElement('option');
                                            option1.value = "";
                                            option1.innerHTML = 'Seleccione una opción';
                                            select.appendChild(option1);

                                            devops.filter(d => d.typeAppServer === appServer).forEach(item => {
                                                let option = document.createElement('option');
                                                option.innerHTML = item.name;
                                                option.value = item.name;
                                                select.appendChild(option);
                                            });

                                            // Mostrar alerta con `<select>` dinámico
                                            swal.fire({
                                                title: t('appGraphQL:titleAlertDevops'),
                                                html: `<div id="swal-container"></div>`, // Contenedor donde insertaremos el `<select>`
                                                showCancelButton: true,
                                                confirmButtonText: t('common:btnOk'),
                                                cancelButtonText: t('common:btnCancel'),
                                                didOpen: () => {
                                                    // 🔥 Insertamos el `<select>` en la alerta después de que se renderiza
                                                    document.getElementById('swal-container').appendChild(select);
                                                    select.onchange = (e) => {
                                                        value = e.target.value;
                                                    };
                                                }
                                            }).then(async (result) => {
                                                if (result.isConfirmed && value !== "") {
                                                    handleSubmit(async (formData) => {
                                                        formData.devopName = value;
                                                        await generateDataApp(formData, "DEVOPS");
                                                    })();
                                                }
                                            });
                                        }

                                    }>
                                        {t('appGraphQL:btntestDevops')}
                                    </Button>
                                </Col>

                            </Row>
                            : null

                    }
                </Form>
                <br></br>
                <br></br>
            </Container>
        </>
    );

}

export default appGraphQL;
