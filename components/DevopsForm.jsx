import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert2/dist/sweetalert2.min.js';

import typesResources from '../services/typesResources';
import ParametersGrid from './ParametersGrid';
import { SortUpAlt } from 'react-bootstrap-icons';

const DevopsForm = ({ item, parametersApp, applicationService, reloadData }) => {
    const addMode = item != null ? false : true;
    const [parameters, setParameters] = useState(parametersApp != null ? parametersApp : []);
    const [authType, setAuthType] = useState([]);
    const { t, lang } = useTranslation();

    const [error, setError] = useState(false);

    const devopsSchema = Yup.object().shape({
        name: Yup.string().required(t('common:valRequiredField').replace("[field]", t('devops:name'))),
        url: Yup.string().required(t('common:valRequiredField').replace("[field]", t('devops:url'))),
        method: Yup.string().required(t('common:valRequiredField').replace("[field]", t('devops:method'))),
        parameterType: Yup.string().required(t('common:valRequiredField').replace("[field]", t('devops:parameterType'))),
        userName: authType === "BASIC_AUTH" ? Yup.string().required(t('common:valRequiredField').replace("[field]", t('devops:userName'))) : null,
        password: authType === "BASIC_AUTH" ? Yup.string().required(t('common:valRequiredField').replace("[field]", t('devops:password'))) : null,
        tokenValue: authType === "TOKEN" ? Yup.string().required(t('common:valRequiredField').replace("[field]", t('devops:tokenValue'))) : null,

    });
    const { register, handleSubmit, reset, setValue, formState, formState: { errors } } = useForm({
        resolver: yupResolver(devopsSchema)
    });

    const setDevopsSchema = async (addMode, item) => {
        if (!addMode) {
            delete item.Update;
            delete item.Delete;
            setAuthType(item.authType)
            for (var field in item) {
                if (item.hasOwnProperty(field)) {
                    setValue(field, item[field]);
                }
            }
        }
    }
    const onChangeType = (authType) => {
        setValue("authType", authType)
        setAuthType(authType)
    }
    const onClicDelete = async (row, rowIndex) => {
        setParameters([])
        row.splice(rowIndex, 1);
        setParameters(row)
    }
    const onClicAdd = async (row) => {
        row.push({
            parameterName: "",
            parameterValue: ""
        })
        setParameters(row)
    }
    const saveDevops = async (dataIn) => {
        try {
            const response = await typesResources.saveDevops(dataIn)
            return response
        }
        catch (error) {
        }
    }
    const fetchsaveDevops = async (dataIn) => {
        return Promise.all([
            saveDevops(dataIn)
        ]).then(([data]) => {
            return { data };
        });
    }
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const openModal = (e) => {
        setShow(true);
    }
    const onSubmit = async (dataIn) => {
        dataIn.parameters = parameters
        const response = await fetchsaveDevops(JSON.stringify(dataIn));
        console.log(response);
        if (response.data.status === 200) {
            swal.fire({
                title: dataIn.id == 0 ? t('devops:alertTitleSave') : t('devops:alertTitleUpdate'),
                text: dataIn.id == 0 ? t('devops:alertTextSave') : t('devops:alertTextUpdate'),
                icon: "success",
                timer: 2500,
                buttons: false,
            }).then(() => {
                reloadData();
                handleClose();
            });
        } else {
            swal.fire({
                title: dataIn.id == 0 ? t('devops:alertTitleSave') : t('devops:alertTitleUpdate'),
                text: dataIn.id == 0 ? t('devops:errorTextSave') : t('devops:errorTextUpdate'),
                icon: "error",
                timer: 1500,
                buttons: false,
            }).then(() => {
            });
        }


    }

    return (<div>
        <Container>
            <Row>
                <Col></Col>
                <Col md="auto">
                    <Button onClick={(e) => openModal(e)} variant="success" size="sm" >{addMode ? t('common:btnAdd') : t('common:btnEdit')}</Button>
                </Col>
            </Row>
        </Container>
        <Modal show={show} onEnter={() => setDevopsSchema(addMode, item)} onHide={() => setShow(false)} dialogClassName="modal-90w" size="lm" aria-labelledby="example-custom-modal-styling-title" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    {t('devops:titleModal')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <Form onSubmit={handleSubmit(onSubmit)} onReset={reset}> */}
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Control name="id" defaultValue={0} hidden {...register("id")} type="text">
                            </Form.Control>
                        </Form.Group>
                        <Form.Group >
                            <Form.Label htmlFor="name" >{t('devops:name')}</Form.Label>
                            <Form.Control name="name" {...register("name")} className={`form-control ${errors.name ? 'is-invalid' : ''}`} type="text" >
                            </Form.Control>
                            <div className="invalid-feedback">{errors.name?.message}</div>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label htmlFor={'authType'} >{t('common:senderAuth')}</Form.Label>
                            <Form.Control name="authType"  {...register("authType", { onChange: (e) => onChangeType(e.target.value) })} id="authType" className={`form-control ${errors.authType ? 'is-invalid' : ''}`} as="select">
                                {
                                    ["NO_AUTH", "BASIC_AUTH", "TOKEN"].map((item) =>
                                        <option key={item} value={item}> {item} </option>
                                    )
                                }
                            </Form.Control>
                            <div className="invalid-feedback">{errors.authType?.message}</div>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    {(authType === "BASIC_AUTH") &&
                        <>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="userName" >{t('devops:userName')}</Form.Label>
                                    <Form.Control name="userName" {...register("userName")} className={`form-control ${errors.userName ? 'is-invalid' : ''}`} type="text">
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.userName?.message}</div>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="password" >{t('devops:password')}</Form.Label>
                                    <Form.Control name="password" {...register("password")} className={`form-control ${errors.password ? 'is-invalid' : ''}`} type="password" >
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.password?.message}</div>
                                </Form.Group>
                            </Col>
                        </>
                    }
                    {(authType === "TOKEN") &&
                        <>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="tokenValue" >{t('devops:tokenValue')}</Form.Label>
                                    <Form.Control name="tokenValue" {...register("tokenValue")} className={`form-control ${errors.tokenValue ? 'is-invalid' : ''}`} type="text">
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.tokenValue?.message}</div>
                                </Form.Group>
                            </Col>
                        </>
                    }
                    <Col>
                        <Form.Group>
                            <Form.Label htmlFor="parameterType" >{t('devops:parameterType')}</Form.Label>
                            <Form.Control name="parameterType"  {...register("parameterType", { onChange: (e) => setValue("parameterType", e.target.value) })} id="parameterType" className={`form-control ${errors.parameterType ? 'is-invalid' : ''}`} as="select">
                                {
                                    [{ id: null, description: null }, { id: "QUERY", description: "Query parameters" }, { id: "JSON", description: "Json Body" }].map((item) =>
                                        <option key={item.id} value={item.id}> {item.description} </option>
                                    )

                                }
                            </Form.Control>
                            <div className="invalid-feedback">{errors.parameterType?.message}</div>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="url" >{t('devops:url')}</Form.Label>
                            <Form.Control name="url" {...register("url")} className={`form-control ${errors.url ? 'is-invalid' : ''}`} type="text" >
                            </Form.Control>
                            <div className="invalid-feedback">{errors.url?.message}</div>
                        </Form.Group>
                    </Col>
                </Row>
                <br></br>
                <ParametersGrid
                    data={parameters}
                    schemaColumns="devops"
                    hiddenColumns={[]}
                    pagination={true}
                    setParameters={setParameters}
                    onClicAdd={onClicAdd}
                    onClicDelete={onClicDelete}
                >
                </ParametersGrid>
                <br></br>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label htmlFor="method" >{t('devops:method')}</Form.Label>
                            <Form.Control name="method"  {...register("method", { onChange: (e) => setValue("method", e.target.value) })} id="method" className={`form-control ${errors.method ? 'is-invalid' : ''}`} as="select">
                                {
                                    [null, "GET", "POST"].map((item) =>
                                        <option key={item} value={item}> {item} </option>
                                    )
                                }
                            </Form.Control>
                            <div className="invalid-feedback">{errors.method?.message}</div>
                        </Form.Group>
                    </Col>
                    <Col>
                        {
                            applicationService ?
                                <Form.Group>
                                    <Form.Label htmlFor={'typeAppServer'} >{t('devops:typeAppServer')}</Form.Label>
                                    <Form.Control name="typeAppServer"  {...register("typeAppServer", { onChange: (e) => setValue("typeAppServer", e.target.value) })} id="typeAppServer" className={`form-control ${errors.typeAppServer ? 'is-invalid' : ''}`} as="select">
                                        {
                                            applicationService.map((item) =>
                                                <option key={item.id} value={item.description}> {item.description} </option>
                                            )
                                        }
                                    </Form.Control>
                                    <div className="invalid-feedback">{errors.typeAppServer?.message}</div>
                                </Form.Group>
                                : null
                        }
                    </Col>
                </Row>
                {/* </Form> */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t('common:btnCancel')}
                </Button>
                {/* onClick={handleClose} */}
                <Button variant="primary" type="submit" disabled={formState.isSubmitting} onClick={handleSubmit(onSubmit)}>
                    {addMode ? t('common:btnInsert') : t('common:btnUpdate')}
                </Button>
            </Modal.Footer>
        </Modal>
    </div>)
}

export default DevopsForm;