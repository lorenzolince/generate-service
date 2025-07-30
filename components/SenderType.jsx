import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert2/dist/sweetalert2.min.js';

import protobuf from 'protobufjs';


const SenderType = ({ item, producerWithSender, currenQuue, rowIndex, addOutSenderQueue, domain }) => {
    const { t, lang } = useTranslation();
    const [error, setError] = useState(false);
    const [authSmb, setAuthSmb] = useState("");
    const [typeServer, setTypeServer] = useState("");
    const hiddenFileInput = useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const file = event.target.files[0];

        if (file) {
            const extension = file.name.split('.').pop().toLowerCase();

            if (extension.toLowerCase() === "xsd") {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const fileContent = e.target.result;
                    const base64String = btoa(fileContent);
                    if (validateXML(fileContent)) {
                        setValue("attachXsd", base64String)
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
                        setValue("attachXsd", "")
                        setValue("fileName", "")
                        event.target.value = '';
                    }
                };

                reader.onerror = function (error) {
                    console.error('Error al leer el archivo:', error);
                };

                reader.readAsText(file); // Lee el archivo como texto
            } else {
                setValue("attachXsd", null)
                swal.fire({
                    title: t('common:alertXsdTitle'),
                    text: t('common:alertXsdText'),
                    icon: "warning",
                    dangerMode: true,
                    buttons: false,
                    timer: 3500

                })
                console.log('El Archivo debe ser un XSD');

            }
        } else {
            console.log('No se seleccionó ningún archivo');
        }

    };
    const handleChangeProto = event => {
        const file = event.target.files[0];

        if (file) {
            setValue("fileNameProto", file.name)
            const extension = file.name.split('.').pop().toLowerCase();

            if (extension.toLowerCase() === "proto") {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const fileContent = e.target.result;
                    const base64String = btoa(fileContent);
                    if (validateProtoContent(fileContent)) {
                        setValue("attachProto", base64String)
                        setValue("senderPath", "proto")
                        setValue("fileNameProto", file.name)
                    } else {
                        swal.fire({
                            title: t('common:valFormatFileTitle'),
                            text: t('common:valFormatFile'),
                            icon: "warning",
                            dangerMode: true,
                            buttons: false,
                            timer: 3500

                        })
                        setValue("attachProto", "")
                        setValue("fileNameProto", "")
                        event.target.value = '';
                    }

                };

                reader.onerror = function (error) {
                    console.error('Error al leer el archivo:', error);
                };

                reader.readAsText(file); // Lee el archivo como texto
            } else {
                setValue("attachProto", null)
                swal.fire({
                    title: t('common:alertProtoTitle'),
                    text: t('common:alertProtoText'),
                    icon: "warning",
                    dangerMode: true,
                    buttons: false,
                    timer: 3500

                })
                console.log('El Archivo debe ser un PROTO');

            }
        } else {
            console.log('No se seleccionó ningún archivo');
        }

    };

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }

    //Validaciones
    const senderSchema = Yup.object().shape({

        attachXsd: typeServer === 'SOAP' ? Yup.string().required(t('common:valRequiredField').replace("[field]", t('common:attachXsd'))) : null,
        senderPath: (typeServer !== "QUEUE" && typeServer !== "ACTIVE_MQ" && typeServer !== "KAFKA" && typeServer !== "MAIL") ? Yup.string().required(t('common:valRequiredField').replace("[field]", t('common:senderPath'))) : null,
        nameQueue: (typeServer === "QUEUE" || typeServer === "ACTIVE_MQ" || typeServer === "KAFKA" && typeServer !== "MAIL") ? Yup.string().required(t('common:valRequiredField').replace("[field]", t('common:senderQueue'))) : null,
        senderEndpoint: typeServer === 'GRAPHQL' ? Yup.string().required(t('common:valRequiredField').replace("[field]", t('common:senderEndpoint'))) : null,
        senderNameRequest: typeServer === 'GRAPHQL' ? Yup.string().required(t('common:valRequiredField').replace("[field]", t('common:senderNameRequest'))) : null,
        senderEndpointWebSocket: typeServer === 'WEBSOCKET' ? Yup.string().required(t('common:valRequiredField').replace("[field]", t('common:senderEndpointWebSocket'))) : null,

    });

    const { register, handleSubmit, reset, setValue, getValues, formState, formState: { errors } } = useForm({
        resolver: yupResolver(senderSchema)
    });

    const setAddressSchema = async (item) => {
        setTypeServer("")
        reset({ fileNameProto: "", attachXsd: "", senderPath: "", nameQueue: "", fileName: "", senderEndpoint: "", multiSender: "", senderNameRequest: "", senderEndpointWebSocket: "", senderType: "", authType: "NO_AUTH" })
        // console.log(item);
        // console.log(domain);
    }

    const openModal = (e) => {
        setShow(true);
    }

    const onSubmit = async (data) => {
        // console.log(data);
        if (data.senderType === "QUEUE" || data.senderType === "ACTIVE_MQ" || data.senderType === "KAFKA"|| data.senderType === "RABBIT_MQ") {
            data.senderPath = data.nameQueue
            data.senderEndpoint = data.multiSender
        }
        if (data.senderType === "SOAP") {
            data.senderNameRequest = data.attachXsd
            data.senderEndpoint = data.fileName
        }
        if (data.senderType === "WEBSOCKET") {
            data.senderEndpoint = data.senderEndpointWebSocket
        }
        if (data.senderType === "SFTP" || data.senderType === "FILE" || data.senderType === "MAIL") {
            data.senderEndpoint = data.senderEndpointSftp
        }
        if (data.senderType === "GRPC") {
            data.senderNameRequest = data.attachProto
            data.senderEndpoint = data.fileNameProto
        }
        console.log(data);
        addOutSenderQueue(rowIndex, data)
        handleClose();

    }



    const onChangeType = (selectedValue) => {
        // console.log(selectedValue);
        reset({ fileNameProto: "", attachXsd: "", senderPath: "", nameQueue: "", fileName: "", senderEndpoint: "", senderNameRequest: "", senderEndpointWebSocket: "", senderType: selectedValue, authType: "NO_AUTH" })
        setValue("senderType", selectedValue)
        setTypeServer(selectedValue)
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
    useEffect(() => {

    }, []);

    return (<div>
        <Container>
            <Row>
                <Col></Col>
                <Col md="auto">
                    <Button onClick={(e) => openModal(e)} variant="success" size="sm" >{t('common:btnAdd')}</Button>
                </Col>
            </Row>
        </Container>
        <Modal show={show} onEnter={() => setAddressSchema(item)} onHide={() => setShow(false)} dialogClassName="modal-90w" size="lg" aria-labelledby="example-custom-modal-styling-title" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    {t('common:sender')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <Form onSubmit={handleSubmit(onSubmit)} onReset={reset}> */}
                <Row>
                    <Col md={{ span: 4, offset: 4 }}>
                        {
                            producerWithSender ?
                                <Form.Group>
                                    <Form.Label htmlFor={'senderType'} >{t('queue:applicationType')}</Form.Label>
                                    <Form.Control name="senderType"  {...register("senderType", { onChange: (e) => onChangeType(e.target.value) })} id="senderType" className={`form-control ${errors.senderType ? 'is-invalid' : ''}`} as="select">
                                        <option key={-1} value={""}> {""} </option>
                                        {
                                            producerWithSender.map((item) =>
                                                <option key={item.id} value={item.description}> {item.description} </option>
                                            )
                                        }
                                        <option key={(producerWithSender.length + 1)} value={"MAIL"}>MAIL</option>
                                        <option key={(producerWithSender.length + 2)} value={"QUEUE"}>{currenQuue}</option>
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderType?.message}</div>
                                </Form.Group>
                                : null
                        }
                    </Col>
                </Row>
                <br></br>
                {(typeServer === "REST") &&
                    <>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'authType'} >{t('common:senderAuth')}</Form.Label>
                                    <Form.Control name="authType"  {...register("authType", { onChange: (e) => setValue("authType", e.target.value) })} id="authType" className={`form-control ${errors.authType ? 'is-invalid' : ''}`} as="select">
                                        {
                                            ["NO_AUTH", "BASIC_AUTH", "BEARER_TOKEN"].map((item) =>
                                                <option key={item} value={item}> {item} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.authType?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="senderPath" >{t('common:senderPath')}</Form.Label>
                                    <Form.Control name="senderPath" {...register("senderPath")} className={`form-control ${errors.senderPath ? 'is-invalid' : ''}`} type="text" placeholder={t('common:senderPathExample')}>
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderPath?.message}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                }
                {(typeServer === "QUEUE" || typeServer === "ACTIVE_MQ" || typeServer === "KAFKA") &&
                    <>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="nameQueue" >{t('common:senderQueue')}</Form.Label>
                                    <Form.Control name="nameQueue" {...register("nameQueue")} className={`form-control ${errors.nameQueue ? 'is-invalid' : ''}`} type="text" placeholder={t('common:senderQueueExample')}>
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.nameQueue?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'multiSender'} >{t('common:multiSender')}</Form.Label>
                                    <Form.Control name="multiSender"  {...register("multiSender", { onChange: (e) => setValue("multiSender", e.target.value) })} id="multiSender" className={`form-control ${errors.multiSender ? 'is-invalid' : ''}`} as="select">
                                        {
                                            [ "NO", "YES"].map((item) =>
                                                <option key={item} value={item}> {item} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.multiSender?.message}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                }
                {typeServer === "GRAPHQL" &&
                    <>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'authType'} >{t('common:senderAuth')}</Form.Label>
                                    <Form.Control name="authType"  {...register("authType", { onChange: (e) => setValue("authType", e.target.value) })} id="authType" className={`form-control ${errors.authType ? 'is-invalid' : ''}`} as="select">
                                        {
                                            ["NO_AUTH", "BASIC_AUTH", "BEARER_TOKEN"].map((item) =>
                                                <option key={item} value={item}> {item} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.authType?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="senderPath" >{t('common:senderPath')}</Form.Label>
                                    <Form.Control name="senderPath" {...register("senderPath")} className={`form-control ${errors.senderPath ? 'is-invalid' : ''}`} type="text" placeholder={t('common:senderPathExampleGraphQL')}>
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderPath?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="senderEndpoint" >{t('common:senderEndpoint')}</Form.Label>
                                    <Form.Control name="senderEndpoint" {...register("senderEndpoint")} className={`form-control ${errors.senderEndpoint ? 'is-invalid' : ''}`} type="text" placeholder="ExampleGraphQL">
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderEndpoint?.message}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="senderNameRequest" >{t('common:senderNameRequest')}</Form.Label>
                                    <Form.Control name="senderNameRequest" {...register("senderNameRequest")} className={`form-control ${errors.senderNameRequest ? 'is-invalid' : ''}`} type="text" placeholder="request" >
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderNameRequest?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'senderQueryOrMutation'} >{t('common:senderQueryOrMutation')}</Form.Label>
                                    <Form.Control name="senderQueryOrMutation"  {...register("senderQueryOrMutation", { onChange: (e) => setValue("senderQueryOrMutation", e.target.value) })} id="senderQueryOrMutation" className={`form-control ${errors.senderQueryOrMutation ? 'is-invalid' : ''}`} as="select">
                                        {
                                            ["QUERY", "MUTATION"].map((item) =>
                                                <option key={item} value={item}> {item} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderQueryOrMutation?.message}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                }{typeServer === "SOAP" &&
                    <>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'authType'} >{t('common:senderAuth')}</Form.Label>
                                    <Form.Control name="authType"  {...register("authType", { onChange: (e) => setValue("authType", e.target.value) })} id="authType" className={`form-control ${errors.authType ? 'is-invalid' : ''}`} as="select">
                                        {
                                            ["NO_AUTH", "BASIC_AUTH", "ENVELOPE_HEADER_AUTH", "SOAP_ACTION"].map((item) =>
                                                <option key={item} value={item}> {item} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.authType?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="senderPath" >{t('common:senderPath')}</Form.Label>
                                    <Form.Control name="senderPath" {...register("senderPath")} className={`form-control ${errors.senderPath ? 'is-invalid' : ''}`} type="text" placeholder={t('common:senderPathExample')}>
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderPath?.message}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'senderNameRequest'} >{t('common:attachXsd')}</Form.Label>
                                </Form.Group>
                                <Form.Group>
                                    <Button
                                        variant="secondary"
                                        onClick={handleClick}
                                    >
                                        Upload file
                                    </Button>
                                    <Form.Control
                                        name='attachXsd'
                                        type="file"
                                        {...register("attachXsd")}
                                        onChange={handleChange}     // ADDED
                                        ref={hiddenFileInput}
                                        className={`common-file  form-control ${errors.attachXsd ? 'is-invalid' : ''}`}
                                    />
                                    <div className="invalid-feedback">{errors.attachXsd?.message}</div>
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
                    </>
                } {(typeServer === "WEBSOCKET") &&
                    <>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'authType'} >{t('common:senderAuth')}</Form.Label>
                                    <Form.Control name="authType"  {...register("authType", { onChange: (e) => setValue("authType", e.target.value) })} id="authType" className={`form-control ${errors.authType ? 'is-invalid' : ''}`} as="select">
                                        {
                                            ["NO_AUTH", "BASIC_AUTH", "BEARER_TOKEN"].map((item) =>
                                                <option key={item} value={item}> {item} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.authType?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="senderPath" >{t('common:senderPath')}</Form.Label>
                                    <Form.Control name="senderPath" {...register("senderPath")} className={`form-control ${errors.senderPath ? 'is-invalid' : ''}`} type="text" placeholder={t('common:senderPathExampleWebSocket')}>
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderPath?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="senderEndpointWebSocket" >{t('common:senderEndpointWebSocket')}</Form.Label>
                                    <Form.Control name="senderEndpointWebSocket" {...register("senderEndpointWebSocket")} className={`form-control ${errors.senderEndpoint ? 'is-invalid' : ''}`} type="text" placeholder={t('common:senderEndpointWebSocketExample')}>
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderEndpoint?.message}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                }
                {typeServer === "SFTP" &&
                    <>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'authType'} >{t('common:senderAuth')}</Form.Label>
                                    <Form.Control name="authType"  {...register("authType", { onChange: (e) => setValue("authType", e.target.value) })} id="authType" className={`form-control ${errors.authType ? 'is-invalid' : ''}`} as="select">
                                        {
                                            ["BASIC_AUTH", "AUTH_RSA_KEY"].map((item) =>
                                                <option key={item} value={item}> {item} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.authType?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'senderEndpointSftp'} >{t('common:senderEndpointSftp')}</Form.Label>
                                    <Form.Control name="senderEndpointSftp"  {...register("senderEndpointSftp", { onChange: (e) => setValue("senderEndpointSftp", e.target.value) })} id="senderEndpointSftp" className={`form-control ${errors.senderEndpointSftp ? 'is-invalid' : ''}`} as="select">
                                        {
                                            [{ id: "FILE", description: "DEFAULT_JSON" },
                                            { id: "TXT", description: "SAVE_TEXT" },
                                            { id: "CSV", description: "SAVE_CSV" },
                                            { id: "HTML", description: "SAVE_HTML" },
                                            { id: "XLSX", description: "SAVE_EXCEL" },
                                            { id: "PDF", description: "SAVE_PDF" }
                                            ].map((item) =>
                                                <option key={item.id} value={item.id}> {item.description} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderEndpointSftp?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="senderPath" >{t('common:senderRemoteSftp')}</Form.Label>
                                    <Form.Control name="senderPath" {...register("senderPath")} className={`form-control ${errors.senderPath ? 'is-invalid' : ''}`} type="text" placeholder={t('common:senderPathExampleSftp')}>
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderPath?.message}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                } {typeServer === "FILE" &&
                    <>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'authType'} >{t('common:fileType')}</Form.Label>
                                    <Form.Control name="authType"  {...register("authType", { onChange: (e) => { setValue("authType", e.target.value); setAuthSmb(e.target.value) } })} id="authType" className={`form-control ${errors.authType ? 'is-invalid' : ''}`} as="select">
                                        {
                                            [{id:"",description:"FILE"},{id:"BASIC_AUTH",description:"SMB"}].map((item) =>
                                                <option key={item.id} value={item.id}> {item.description} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.authType?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'senderEndpointSftp'} >{t('common:senderEndpointSftp')}</Form.Label>
                                    <Form.Control name="senderEndpointSftp" id="senderEndpointSftp" className={`form-control ${errors.senderEndpointSftp ? 'is-invalid' : ''}`} as="select">
                                        {
                                            [{ id: "FILE", description: "DEFAULT_JSON" },
                                            { id: "TXT", description: "SAVE_TEXT" },
                                            { id: "CSV", description: "SAVE_CSV" },
                                            { id: "HTML", description: "SAVE_HTML" },
                                            { id: "XLSX", description: "SAVE_EXCEL" },
                                            { id: "PDF", description: "SAVE_PDF" }
                                            ].map((item) =>
                                                <option key={item.id} value={item.id}> {item.description} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderEndpointSftp?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="senderPath" >{t('common:senderRemoteSftp')}</Form.Label>
                                    <Form.Control name="senderPath" {...register("senderPath")} className={`form-control ${errors.senderPath ? 'is-invalid' : ''}`} type="text" placeholder={authSmb === "BASIC_AUTH" ? t('common:senderPathExampleSmb') : t('common:senderPathExampleSftp')}>
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderPath?.message}</div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                }
                {typeServer === "MAIL" &&
                    <>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'senderEndpointSftp'} >{t('common:senderEndpointSftp')}</Form.Label>
                                    <Form.Control name="senderEndpointSftp"  {...register("senderEndpointSftp", { onChange: (e) => setValue("senderEndpointSftp", e.target.value) })} id="senderEndpointSftp" className={`form-control ${errors.senderEndpointSftp ? 'is-invalid' : ''}`} as="select">
                                        {
                                            [{ id: "FILE", description: "DEFAULT_JSON" },
                                            { id: "TXT", description: "SAVE_TEXT" },
                                            { id: "CSV", description: "SAVE_CSV" },
                                            { id: "HTML", description: "SAVE_HTML" },
                                            { id: "XLSX", description: "SAVE_EXCEL" },
                                            { id: "PDF", description: "SAVE_PDF" }
                                            ].map((item) =>
                                                <option key={item.id} value={item.id}> {item.description} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.senderEndpointSftp?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Control name="senderPath" value={"."} {...register("senderPath")} type="text" hidden>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                }
                {typeServer === "GRPC" &&
                    <>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'authType'} >{t('common:senderAuth')}</Form.Label>
                                    <Form.Control name="authType"  {...register("authType", { onChange: (e) => setValue("authType", e.target.value) })} id="authType" className={`form-control ${errors.authType ? 'is-invalid' : ''}`} as="select">
                                        {
                                            ["NO_AUTH", "BASIC_AUTH", "BEARER_TOKEN"].map((item) =>
                                                <option key={item} value={item}> {item} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.authType?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor={'senderNameRequest'} >{t('common:attachProto')}</Form.Label>
                                </Form.Group>
                                <Form.Group>
                                    <Button
                                        variant="secondary"
                                        onClick={handleClick}
                                    >
                                        Upload file
                                    </Button>
                                    <Form.Control
                                        name='attachProto'
                                        type="file"
                                        {...register("attachProto")}
                                        onChange={handleChangeProto}     // ADDED
                                        ref={hiddenFileInput}
                                        className={` common-file  form-control ${errors.attachProto ? 'is-invalid' : ''}`}
                                    />
                                    <div className="invalid-feedback">{errors.attachProto?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="fileNameProto" >{t('common:fileName')}</Form.Label>
                                    <Form.Control name="fileNameProto" {...register("fileNameProto")} id="fileNameProto" className={`form-control ${errors.fileNameProto ? 'is-invalid' : ''}`} readOnly type="text" >
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.fileNameProto?.message}</div>
                                </Form.Group>

                            </Col>
                        </Row>
                    </>
                }
                {/* </Form> */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t('common:btnCancel')}
                </Button>
                {/* onClick={handleClose} */}
                <Button variant="primary" type="submit" disabled={formState.isSubmitting} onClick={handleSubmit(onSubmit)}>
                    {t('common:btnInsert')}
                </Button>
            </Modal.Footer>
        </Modal>
    </div>)
}

export default SenderType;