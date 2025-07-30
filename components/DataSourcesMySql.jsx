import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert2/dist/sweetalert2.min.js';

import dataSources from '../services/datasource';
const dataSourcesSchema = Yup.object().shape({});
const DataSourcesMySql = ({ item, reloadData }) => {
    const addMode = item != null ? false : true;
    const { t, lang } = useTranslation();

    const [error, setError] = useState(false);


    const { register, handleSubmit, reset, setValue, formState, formState: { errors } } = useForm({
        resolver: yupResolver(dataSourcesSchema)
    });

    const setDataSourcesSchema = async (addMode, item) => {
        if (!addMode) {
            delete item.Update;
            delete item.Delete;

            for (var field in item) {
                if (item.hasOwnProperty(field)) {
                    setValue(field, item[field]);
                }
            }
        }
    }
    const testConnt = async (dataIn) => {
        try {
            const response = await dataSources.Test(dataIn);
            return response
        }
        catch (error) {
        }
    }
    const fetchConnection = async (dataIn) => {
        return Promise.all([
            testConnt(dataIn)
        ]).then(([data]) => {
            return { data };
        });
    }
    const saveDataSource = async (dataIn) => {
        try {
            const response = await dataSources.Save(dataIn);
            return response
        }
        catch (error) {
        }
    }
    const fetchsaveDataSource = async (dataIn) => {
        return Promise.all([
            saveDataSource(dataIn)
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
        dataIn.type = 'MY_SQL';
        const response = await fetchsaveDataSource(JSON.stringify(dataIn));
        if (response.data) {
            swal.fire({
                title: dataIn.id == 0 ? t('datasourceSqlServer:alertTitleSave') : t('datasourceSqlServer:alertTitleUpdate'),
                text: dataIn.id == 0 ? t('datasourceSqlServer:alertTextSave') : t('datasourceSqlServer:alertTextUpdate'),
                icon: "success",
                timer: 1500,
                buttons: false,
            }).then(() => {
                reloadData();
                handleClose();
            });
        } else {
            swal.fire({
                title: dataIn.id == 0 ? t('datasourceSqlServer:alertTitleSave') : t('datasourceSqlServer:alertTitleUpdate'),
                text: dataIn.id == 0 ? t('datasourceSqlServer:errorTextSave') : t('datasourceSqlServer:errorTextUpdate'),
                icon: "error",
                timer: 1500,
                buttons: false,
            }).then(() => {
            });
        }


        //  return addMode ? await insertAddress(data) : await updateAddress(data);
    }
    const testConnection = async (dataIn) => {
        dataIn.type = 'MY_SQL';
        let test = await fetchConnection(JSON.stringify(dataIn));
        if (test.data) {
            swal.fire({
                title: t('datasourceSqlServer:alertTitle'),
                text: t('datasourceSqlServer:alertText'),
                icon: "success",
                timer: 1500,
                buttons: false,
            }).then(() => {
            });
        } else {
            swal.fire({
                title: t('datasourceSqlServer:alertTitle'),
                text: t('datasourceSqlServer:errorText'),
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
        <Modal show={show} onEnter={() => setDataSourcesSchema(addMode, item)} onHide={() => setShow(false)} dialogClassName="modal-90w" size="lg" aria-labelledby="example-custom-modal-styling-title" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    {t('datasourceSqlServer:titleModal')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <Form onSubmit={handleSubmit(onSubmit)} onReset={reset}> */}
                <Row>
                    <Form.Group>
                        <Form.Control name="id" defaultValue={0} hidden {...register("id")} type="text">
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control name="type" defaultValue={1} hidden {...register("type")} type="text">
                        </Form.Control>
                    </Form.Group>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="name" >{t('datasourceSqlServer:name')}</Form.Label>
                            <Form.Control name="name" {...register("name")} className={`form-control ${errors.name ? 'is-invalid' : ''}`} type="text" >
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="host" >{t('datasourceSqlServer:host')}</Form.Label>
                            <Form.Control name="host" {...register("host")} className={`form-control ${errors.host ? 'is-invalid' : ''}`} type="text" >
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="port" >{t('datasourceSqlServer:port')}</Form.Label>
                            <Form.Control name="port" {...register("port")} className={`form-control ${errors.port ? 'is-invalid' : ''}`} type="text" placeholder={t('datasourceSqlServer:port')}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="username" >{t('datasourceSqlServer:username')}</Form.Label>
                            <Form.Control name="username" {...register("username")} className={`form-control ${errors.username ? 'is-invalid' : ''}`} type="text" placeholder={t('datasourceSqlServer:username')}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="password" >{t('datasourceSqlServer:password')}</Form.Label>
                            <Form.Control name="password" {...register("password")} className={`form-control ${errors.password ? 'is-invalid' : ''}`} type="password" placeholder={t('datasourceSqlServer:password')}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="databaseName" >{t('datasourceSqlServer:serviceName')}</Form.Label>
                            <Form.Control name="databaseName" {...register("databaseName")} className={`form-control ${errors.databaseName ? 'is-invalid' : ''}`} type="text" placeholder={t('datasourceSqlServer:serviceName')}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group >
                            <Form.Group>
                                <br></br>
                                <Button variant="secondary" onClick={handleSubmit(testConnection)}>
                                    {t('datasourceSqlServer:btnTest')}
                                </Button>
                            </Form.Group>
                        </Form.Group>
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

export default DataSourcesMySql;