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
const DataSourcesOra = ({ item, reloadData }) => {
    const addMode = item != null ? false : true;
    const { t, lang } = useTranslation();

    const [error, setError] = useState(false);
    const [dataShemas, setDataShemas] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);

    const { register, handleSubmit, reset, setValue, formState, formState: { errors } } = useForm({
        resolver: yupResolver(dataSourcesSchema)
    });


    const handleSelectionChange = (e) => {
        const options = Array.from(e.target.selectedOptions).map(option => option.value);
        console.log("options:", options);
        setSelectedValues(options); // ← esto genera una nueva referencia y fuerza el render
    };





    const setDataSourcesSchema = async (addMode, item) => {
        if (!addMode) {
            delete item.Update;
            delete item.Delete;
            console.log("item:", item);
            if (item.databaseName) {
                setDataShemas(item.databaseName.split(","))
                setSelectedValues(item.databaseName.split(","))
            }
            for (var field in item) {
                if (item.hasOwnProperty(field)) {
                    setValue(field, item[field]);
                }
            }
        }
    }
    const getAllSchemas = async (data) => {
        try {
            const response = await dataSources.getAllOrcleSchemas(data);
            return response
        }
        catch (error) {
        }
    }
    const fetchgetAllSchemas = async (dataIn) => {
        return Promise.all([
            getAllSchemas(dataIn)
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
        dataIn.type = 'ORACLE';
        dataIn.databaseName = selectedValues.join(",")
        const response = await fetchsaveDataSource(JSON.stringify(dataIn));
        if (response.data) {
            swal.fire({
                title: dataIn.id == 0 ? t('datasourceOra:alertTitleSave') : t('datasourceOra:alertTitleUpdate'),
                text: dataIn.id == 0 ? t('datasourceOra:alertTextSave') : t('datasourceOra:alertTextUpdate'),
                icon: "success",
                timer: 1500,
                buttons: false,
            }).then(() => {
                reloadData();
                handleClose();
            });
        } else {
            swal.fire({
                title: dataIn.id == 0 ? t('datasourceOra:alertTitleSave') : t('datasourceOra:alertTitleUpdate'),
                text: dataIn.id == 0 ? t('datasourceOra:errorTextSave') : t('datasourceOra:errorTextUpdate'),
                icon: "error",
                timer: 1500,
                buttons: false,
            }).then(() => {
            });
        }
    }
    const testConnection = async (dataIn) => {
        dataIn.type = 'ORACLE';
        let test = await fetchgetAllSchemas(JSON.stringify(dataIn));
        if (test.data) {
            setDataShemas(test.data)
            swal.fire({
                title: t('datasourceOra:alertTitle'),
                text: t('datasourceOra:alertText'),
                icon: "success",
                timer: 1500,
                buttons: false,
            });
        } else {
            swal.fire({
                title: t('datasourceOra:alertTitle'),
                text: t('datasourceOra:errorText'),
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
                    {t('datasourceOra:titleModal')}
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
                        <Form.Control name="type" defaultValue={0} hidden {...register("type")} type="text">
                        </Form.Control>
                    </Form.Group>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="name" >{t('datasourceOra:name')}</Form.Label>
                            <Form.Control name="name" {...register("name")} className={`form-control ${errors.name ? 'is-invalid' : ''}`} type="text" >
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="host" >{t('datasourceOra:host')}</Form.Label>
                            <Form.Control name="host" {...register("host")} className={`form-control ${errors.host ? 'is-invalid' : ''}`} type="text" >
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="port" >{t('datasourceOra:port')}</Form.Label>
                            <Form.Control name="port" {...register("port")} className={`form-control ${errors.port ? 'is-invalid' : ''}`} type="text" placeholder={t('datasourceOra:port')}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="username" >{t('datasourceOra:username')}</Form.Label>
                            <Form.Control name="username" {...register("username")} className={`form-control ${errors.port ? 'is-invalid' : ''}`} type="text" placeholder={t('datasourceOra:username')}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="password" >{t('datasourceOra:password')}</Form.Label>
                            <Form.Control name="password" {...register("password")} className={`form-control ${errors.port ? 'is-invalid' : ''}`} type="password" placeholder={t('datasourceOra:password')}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group >
                            <Form.Label htmlFor="serviceName" >{t('datasourceOra:serviceName')}</Form.Label>
                            <Form.Control name="serviceName" {...register("serviceName")} className={`form-control ${errors.port ? 'is-invalid' : ''}`} type="text" placeholder={t('datasourceOra:serviceName')}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>

                        <Form.Group>
                            <br></br>
                            <Button variant="secondary" onClick={handleSubmit(testConnection)}>
                                {t('datasourceOra:btnTest')}
                            </Button>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="serviceName">{t('datasourceOra:selectShema')}</Form.Label>
                            <br />
                            <select
                                multiple
                                size={5}
                                value={selectedValues} // ← aquí es donde la magia ocurre
                                onChange={handleSelectionChange}
                                className='datasource-ora'
                            >
                                {dataShemas.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
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

export default DataSourcesOra;