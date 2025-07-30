import React, { useState, useRef } from 'react';
import { Form, Button, Container, Row, Col, Table, Pagination } from "react-bootstrap";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { TrashFill, FilePlusFill } from 'react-bootstrap-icons';
import swal from 'sweetalert2/dist/sweetalert2.min.js';

import Modal from "react-bootstrap/Modal";
import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { buildSchema, validateSchema } from 'graphql';
import protobuf from 'protobufjs';
import ParametersGrid from './ParametersGrid';


const ApiSourcesGrid = ({ data, schemaColumns, hiddenColumns, onClicAdd, pagination, onClicDelete, setParameters, size = "sm" }) => {
    const [typeServer, setTypeServer] = useState("REST_FULL");
    const [httpHeaders, setHttpHeaders] = useState([]);


    const onClicDeleteHeaders = async (row, rowIndex) => {
        setHttpHeaders([])
        row.splice(rowIndex, 1);
        setHttpHeaders(row)
    }
    const onClicAddHeaders = async (row) => {
        row.push({
            parameterName: "",
            parameterValue: ""
        })
        setHttpHeaders(row)
    }
    const setDataSourcesSchema = async () => {
        setTypeServer("REST_FULL")
        reset({ nameMethod: "", sourceType: "REST_FULL", senderAuth: "NO_AUTH", endpoint: "", fileName: "", typeMethod: "POST", parameterType: "JSON", host: "", port: "", schema: "" })
    }

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const onSubmit = async (dataIn) => {

        if (dataIn.sourceType === "GRPC") {
            dataIn.endpoint = dataIn.host + ":" + dataIn.port
        }

        if (dataIn.schema === "") {
            console.log("se reqiere schema")
            swal.fire({
                title: t('common:alertSourceFileTitle'),
                text: t('common:alertSourceFiñeTxt'),
                icon: "warning",
                dangerMode: true,
                buttons: false,
                timer: 3500

            })
        }
        dataIn.headers = httpHeaders
        setHttpHeaders([])
        if (dataIn.schema !== "") {
            // console.log(dataIn)
            onClicAdd(dataIn);
            setShow(false);
        }
    }
    if (data === undefined) return null
    const { t, lang } = useTranslation();
    const passengerTitle = t(`${schemaColumns}:apiInfo`)
    const header = {
        sourceType: null,
        nameMethod: null,
        senderAuth: null,
        endpoint: null,
        typeMethod: null,
        parameterType: null,
        host: null,
        port: null,
        schema: null,
        fileName: null,
        isProducer: null,
        isConsumer: null,
        fileInput: null,
        senderType: null,
        saveFile: null,
        sender: null,
        header: null,
        Delete: null
    }
    const dataSourcesSchema = Yup.object().shape({
        nameMethod: Yup.string()
            .required(t('common:valRequiredField').replace("[field]", t('common:nameMethod')))
            .test(
                "no-spaces",
                t('common:valNoSpaces'),
                value => !/\s/.test(value)
            )
            .matches(
                /^(?![._])(?!.*[._]$)(?!.*[._]{2})[a-zA-Z0-9._]+(?<![._])$/, // Regex que permite solo letras, números, puntos, guiones bajos y guiones
                t('common:valNoSpecialChars') // Mensaje de error si contiene caracteres especiales
            ),

        endpoint: typeServer !== "DATABASE" ? Yup.string()
            .required(t('common:valRequiredField').replace("[field]", t('common:endpoint')))
            .test(
                "no-spaces",
                t('common:valNoSpaces'),
                value => !/\s/.test(value)
            ) : null,
        host: typeServer === "GRPC" ? Yup.string()
            .required(t('common:valRequiredField').replace("[field]", t('common:host'))).test(
                "no-spaces",
                t('common:valNoSpaces'),
                value => !/\s/.test(value)
            ).matches(
                /^(?![._-])(?!.*[._-]$)(?!.*[._-]{2})[a-zA-Z0-9._-]+(?<![._-])$/, // Regex que permite solo letras, números, puntos y guiones
                t('common:valNoSpecialChars') // Mensaje de error si contiene caracteres especiales
            ) : null,
        port: typeServer === "GRPC" ? Yup.string()
            .required(t('common:valRequiredField').replace("[field]", t('common:port'))).test(
                "no-spaces",
                t('common:valNoSpaces'),
                value => !/\s/.test(value)
            ).matches(
                /^[0-9]+$/, // Regex que permite solo números
                t('common:valOnlyNumber') // Mensaje de error si contiene caracteres especiales
            ) : null,
    });
    const { register, handleSubmit, reset, setValue, getValues, formState, formState: { errors } } = useForm({
        resolver: yupResolver(dataSourcesSchema)
    });
    const hiddenFileInput = useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const onChangeType = (value) => {
        setValue("sourceType", value)
        setTypeServer(value)
    }
    const handleChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const extension = file.name.split('.').pop().toLowerCase();

            if ((extension.toLowerCase() === "proto" && typeServer === "GRPC")
                || (extension.toLowerCase() === "xsd" && typeServer === "SOAP")
                || (extension.toLowerCase() === "json" && (typeServer === "REST_FULL" || typeServer === "DATABASE"))
                || (extension.toLowerCase() === "graphqls" && typeServer === "GRAPHQL")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    //  console.log(file.name)
                    const fileContent = e.target.result;

                    if (typeServer === "SOAP") {
                        if (validateXML(fileContent)) {
                            const base64String = btoa(fileContent);
                            setValue("schema", base64String)
                            setValue("fileName", file.name)
                        } else {
                            swal.fire({
                                title: t('common:valFormatFileTitle'),
                                text: t('common:valFormatFile'),
                                icon: "warning",
                                dangerMode: true,
                                buttons: false,
                                timer: 3500

                            })
                            setValue("schema", "")
                            setValue("fileName", "")
                            event.target.value = '';
                        }
                    } else if (typeServer === "REST_FULL" || typeServer === "DATABASE") {
                        if (isValidJSON(fileContent)) {
                            const base64String = btoa(fileContent);
                            setValue("schema", base64String)
                            setValue("fileName", file.name)
                        } else {
                            swal.fire({
                                title: t('common:valFormatFileTitle'),
                                text: t('common:valFormatFile'),
                                icon: "warning",
                                dangerMode: true,
                                buttons: false,
                                timer: 3500

                            })
                            setValue("schema", "")
                            setValue("fileName", "")
                            event.target.value = '';
                        }
                    } else if (typeServer === "GRAPHQL") {
                        if (validateGraphqlSchema(fileContent)) {
                            const base64String = btoa(fileContent);
                            setValue("schema", base64String)
                            setValue("fileName", file.name)
                        } else {
                            swal.fire({
                                title: t('common:valFormatFileTitle'),
                                text: t('common:valFormatFile'),
                                icon: "warning",
                                dangerMode: true,
                                buttons: false,
                                timer: 3500

                            })
                            setValue("schema", "")
                            setValue("fileName", "")
                            event.target.value = '';
                        }
                    } else if (typeServer === "GRPC") {
                        if (validateProtoContent(fileContent)) {
                            const base64String = btoa(fileContent);
                            setValue("schema", base64String)
                            setValue("fileName", file.name)
                        } else {
                            swal.fire({
                                title: t('common:valFormatFileTitle'),
                                text: t('common:valFormatFile'),
                                icon: "warning",
                                dangerMode: true,
                                buttons: false,
                                timer: 3500

                            })
                            setValue("schema", "")
                            setValue("fileName", "")
                            event.target.value = '';
                        }
                    }
                };

                reader.onerror = function (error) {
                    console.error('Error al leer el archivo:', error);
                };

                reader.readAsText(file); // Lee el archivo como texto
            } else {
                swal.fire({
                    title: t('common:alertSourceXsdTitle'),
                    text: t('common:alertSourceXsdTxt'),
                    icon: "warning",
                    dangerMode: true,
                    buttons: false,
                    timer: 3500

                })
                console.log('El Archivo debe ser un XSD ,JSON OR PROTO');
                setValue("schema", "")
                setValue("fileName", "")
                event.target.value = '';
            }
        } else {
            console.log('No se seleccionó ningún archivo');
        }

    };
    const onChangeText = async (e, rowIndex, columnName, value) => {
        setParameters(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnName]: value.trim(),
                    }
                }
                return row
            })
        );

    }
    const addNewRow = async () => {
        setShow(true);
    }
    const onChangeDelete = async (e, rowIndex) => {
        let dataList = []
        const rows = table.getRowModel().rows;
        rows.forEach(item => {
            delete item.original.Delete
            dataList.push(item.original)
        })
        onClicDelete(dataList, rowIndex);
    }

    function validateXML(xmlString) {
        try {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlString, "application/xml");

            // Comprobar si hay errores de sintaxis
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                throw new Error("Error: XML mal formado");
            }

            console.log("XML válido");
            return true;
        } catch (e) {
            console.error(e.message);
            return false;
        }
    }
    function isValidJSON(jsonString) {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
    function validateGraphqlSchema(schemaString) {
        try {
            const schema = buildSchema(schemaString);
            const errors = validateSchema(schema);
            if (errors.length > 0) {
                console.error(errors);
                return false;
            }
        } catch (e) {
            console.log("error  validateSchema: ", e);
            return false;
        }
        return true;
    }
    // Función para validar el contenido del archivo .proto
    function validateProtoContent(protoContent) {
        try {

            protobuf.parse(protoContent, { keepCase: true }, (error, root) => {
                console.log("error: ", error);
                if (error) {
                    console.error('Error al cargar el contenido .proto:', error);
                    return;
                }

            });
            return true
        } catch (e) {
            console.error(e);
            return false;
        }
    }



    // Validar 

    const [paginationState, setPaginationState] = useState({
        pageIndex: 0,
        pageSize: pagination ? 10 : (data.length + 1) * 100
    });

    const [globalFilter, setGlobalFilter] = useState("");

    const getColumns = (data) => {
        // Ajuste de datos antes de crear las columnas
        data.forEach(item => {
            item.Delete = item.binOrder ? "Delete" : " ";
        });

        const items = Object.keys(header);

        return items.map(elem => ({
            header: elem !== "Delete" && !hiddenColumns.includes(elem) ? t(`${schemaColumns}:${elem}`) : "Delete",
            accessorKey: elem,
        }));
    };

    const table = useReactTable({
        data,
        columns: getColumns(data),
        state: {
            pagination: paginationState,
            globalFilter: globalFilter,
            columnVisibility: hiddenColumns.reduce((acc, col) => ({ ...acc, [col]: false }), {}),
        },
        onPaginationChange: setPaginationState,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <Container >

            <Table striped bordered hover size={size} responsive="sm">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className='common-table'>
                                    {header.column.id === "Delete" ?
                                        <FilePlusFill onClick={addNewRow} color="green" size={30} cursor={'pointer'} /> :
                                        header.column.columnDef.header
                                    }
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                const columname = cell.column.id;
                                const columnId = `${columname}${row.index}`;
                                const value = cell.getValue();

                                return (
                                    <td key={cell.id}>
                                        {columname === "endpoint" && (
                                            <Form.Group>
                                                <Form.Control size="sm" name={columnId} value={value}
                                                    onChange={e => onChangeText(e, row.index, columname, e.target.value)}
                                                    type="text" />
                                            </Form.Group>
                                        )}
                                        {["fileName", "nameMethod", "sourceType"].includes(columname) && (
                                            <Form.Group>
                                                <Form.Control size="sm" name={columnId} value={value}
                                                    readOnly type="text" />
                                            </Form.Group>
                                        )}
                                        {columname === "senderAuth" && (
                                            <Form.Group>
                                                <Form.Control size="sm" name={columnId} value={value}
                                                    onChange={e => onChangeText(e, row.index, columname, e.target.value)}
                                                    as="select">
                                                    {["NO_AUTH", "AUTH"].map(item => (
                                                        <option key={item} value={item}>{item}</option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                        )}
                                        {columname === "Delete" && (
                                            <Form.Group>
                                                <TrashFill name={columnId} onClick={e => onChangeDelete(e, row.index)} color="red" size={30} cursor={'pointer'} />
                                            </Form.Group>
                                        )}
                                        {["isProducer", "isConsumer", "fileInput", "saveFile", "sender", "senderType"].includes(columname) && cell.getValue()}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Row hidden={!pagination}>
                <Col></Col>
                <Col md="auto">
                    <Form.Label size="sm">Página:</Form.Label>{' '}
                    <Form.Label size="sm"><strong>{paginationState.pageIndex + 1} De {table.getPageCount()}</strong></Form.Label>{' '}
                    <Form.Label htmlFor="irA" size="sm">| Ir a:</Form.Label>{' '}
                </Col>
                <Col md="auto">
                    <Form.Control name="irA" size="sm" type="number" min="1" max={table.getPageCount()} defaultValue={paginationState.pageIndex + 1}
                        className='common-table-pagination.number' onChange={e => setPaginationState(prev => ({ ...prev, pageIndex: Number(e.target.value) - 1 }))}
                    />
                </Col>
                <Col md="auto">
                    <Form.Control name="selectPage" size="sm" as="select" value={paginationState.pageSize}
                        className='common-table-pagination.selectPage' onChange={e => setPaginationState(prev => ({ ...prev, pageSize: Number(e.target.value) }))}>
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Ver {pageSize}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
                <Col md="auto">
                    <Pagination size="sm">
                        <Pagination.First onClick={() => setPaginationState(prev => ({ ...prev, pageIndex: 0 }))} disabled={paginationState.pageIndex === 0} />
                        <Pagination.Prev onClick={() => setPaginationState(prev => ({ ...prev, pageIndex: Math.max(prev.pageIndex - 1, 0) }))} disabled={paginationState.pageIndex === 0} />
                        <Pagination.Next onClick={() => setPaginationState(prev => ({ ...prev, pageIndex: Math.min(prev.pageIndex + 1, table.getPageCount() - 1) }))} disabled={paginationState.pageIndex >= table.getPageCount() - 1} />
                        <Pagination.Last onClick={() => setPaginationState(prev => ({ ...prev, pageIndex: table.getPageCount() - 1 }))} disabled={paginationState.pageIndex >= table.getPageCount() - 1} />
                    </Pagination>
                </Col>
            </Row>
            <Modal show={show} onEnter={() => setDataSourcesSchema()} onHide={() => setShow(false)} dialogClassName="modal-90w" size="lm" aria-labelledby="example-custom-modal-styling-title" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        {t('common:apiInfo')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                      <a
                            href="/schemas_examples.zip"
                            download
                            className="download-link"
                            title={t('common:templateButonTitle')}
                        >
                            {t('common:templateButon')}
                        </a>
                        <br></br>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="nameMethod" >{t('common:nameMethod')}</Form.Label>
                                <Form.Control name="nameMethod" {...register("nameMethod")} placeholder='ExampleNameOperation' id="nameMethod" className={`form-control ${errors.nameMethod ? 'is-invalid' : ''}`} type="text" >
                                </Form.Control>
                                <div className="invalid-feedback">{errors.nameMethod?.message}</div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>

                            <Form.Group>
                                <Form.Label htmlFor="sourceType" >{t('common:sourceType')}</Form.Label>
                                <Form.Control name="sourceType" {...register("sourceType", { onChange: (e) => onChangeType(e.target.value) })} as="select">
                                    {
                                        [{ id: "REST_FULL", description: "REST_FUL" }, { id: "GRAPHQL", description: "GRAPHQL" }, { id: "SOAP", description: "SOAP" }, { id: "GRPC", description: "GRPC" }, { id: "DATABASE", description: "DATABASE" }].map((item) =>
                                            <option key={item.id} value={item.id}> {item.description} </option>
                                        )
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        {typeServer !== "DATABASE" && <Col>
                            <Form.Group>
                                <Form.Label htmlFor="senderAuth" >{t('common:senderAuth')}</Form.Label>
                                <Form.Control size="sm" name={"senderAuth"}  {...register("senderAuth")} as="select">
                                    {
                                        ["NO_AUTH", "AUTH"].map((item) =>
                                            <option key={item} value={item}> {item} </option>
                                        )
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        }
                    </Row>
                    {
                        typeServer == "DATABASE" &&
                        <Row>
                            <Col>
                                <div className="download-container">
                                    <h5>{t('common:toolTitle')}</h5>
                                    <a
                                        href="/schema-util.zip"
                                        download
                                        className="download-button"
                                        title={t('common:toolButonTitle')}
                                    >
                                        {t('common:toolButon')}
                                    </a>
                                </div>

                            </Col>
                        </Row>
                    }
                    {typeServer === "GRPC" &&
                        <Row>

                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="host" >{t('common:host')}</Form.Label>
                                    <Form.Control name="host" {...register("host", { onChange: (e) => setValue("endpoint", e.target.value) })} placeholder='localhost' id="host" className={`form-control ${errors.host ? 'is-invalid' : ''}`} type="text" >
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.host?.message}</div>
                                </Form.Group>

                            </Col>


                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="port" >{t('common:port')}</Form.Label>
                                    <Form.Control name="port" {...register("port")} placeholder='9091' id="port" className={`form-control ${errors.port ? 'is-invalid' : ''}`} type="text" >
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.port?.message}</div>
                                </Form.Group>

                            </Col>
                        </Row>
                    }
                    {typeServer === "REST_FULL" &&
                        <Row>

                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="parameterType" >{t('common:parameterType')}</Form.Label>
                                    <Form.Control size="sm" name={"parameterType"}  {...register("parameterType")} as="select">
                                        {
                                            [{ id: "JSON", description: "BODY" }, { id: "QUERY", description: "QUERY PARAMETERS" }].map((item) =>
                                                <option key={item.id} value={item.id}> {item.description} </option>
                                            )

                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="typeMethod" >{t('common:typeMethod')}</Form.Label>
                                    <Form.Control size="sm" name={"typeMethod"}  {...register("typeMethod")} as="select">
                                        {
                                            ["POST", "GET"].map((item) =>
                                                <option key={item} value={item}> {item} </option>
                                            )
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    }
                    {
                        (typeServer !== "GRPC" && typeServer !== "DATABASE") &&
                        <Row>

                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="endpoint" >{t('common:endpoint')}</Form.Label>
                                    <Form.Control name="endpoint" {...register("endpoint")} placeholder='http://localhost:8080/api/...' id="endpoint" className={`form-control ${errors.endpoint ? 'is-invalid' : ''}`} type="text" >
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.endpoint?.message}</div>
                                </Form.Group>

                            </Col>
                        </Row>
                    }

                    {
                        typeServer !== "DATABASE" && <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="header" >{t('common:header')}</Form.Label>
                                    <ParametersGrid
                                        data={httpHeaders}
                                        schemaColumns="devops"
                                        hiddenColumns={[]}
                                        pagination={true}
                                        setParameters={setHttpHeaders}
                                        onClicAdd={onClicAddHeaders}
                                        onClicDelete={onClicDeleteHeaders}
                                    >
                                    </ParametersGrid>
                                </Form.Group>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="schema" >{t('common:schema')} {typeServer === "GRPC" ? "Proto" : typeServer === "SOAP" ? "XSD" : typeServer === "GRAPHQL" ? "graphqls" : "JSON"} </Form.Label>
                                <br />
                                <Button
                                    variant="secondary"
                                    onClick={handleClick}
                                >
                                    Upload file
                                </Button>
                                <Form.Control
                                    name={"schema"}
                                    {...register("schema")}
                                    type="file"
                                    onChange={(e) => handleChange(e)}
                                    ref={hiddenFileInput}
                                    className='common-file'
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="fileName" >{t('common:fileName')}</Form.Label>
                                <Form.Control name="fileName" {...register("fileName")} id="fileName" className={`form-control ${errors.fileName ? 'is-invalid' : ''}`} readOnly type="text" >
                                </Form.Control>
                                <div className="invalid-feedback">{errors.fileName?.message}</div>
                            </Form.Group>

                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t('common:btnCancel')}
                    </Button>
                    {/* onClick={handleClose} */}
                    <Button variant="primary" type="submit" onClick={handleSubmit(onSubmit)}>
                        {t('common:btnInsert')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default ApiSourcesGrid;