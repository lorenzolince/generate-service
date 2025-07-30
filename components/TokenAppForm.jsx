import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert2/dist/sweetalert2.min.js';

import typesResources from '../services/typesResources';

const TokenAppForm = ({ item, reloadData }) => {
    const addMode = item != null ? false : true;
    const { t, lang } = useTranslation();

    const [error, setError] = useState(false);

    const tokenAppSchema = Yup.object().shape({
    });
    const { register, handleSubmit, reset, setValue, formState, formState: { errors } } = useForm({
        resolver: yupResolver(tokenAppSchema)
    });
    const setTokenAppSchema = async (addMode, item) => {
        if (!addMode) {
            delete item.Update;

            for (var field in item) {
                if (item.hasOwnProperty(field)) {
                    setValue(field, item[field]);
                }
            }
        }
    }
    const generateToken = async (data) => {
        try {
            const response = await typesResources.generateToken(data);
            return response
        }
        catch (error) {
        }
    }
    const fetGenerateToken = async (dataIn) => {
        return Promise.all([
            generateToken(dataIn)
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
    const onSubmit = async (data) => {
        const response = await fetGenerateToken(data);
        if (response.data) {
          swal.fire({
            title: t('common:alertTitle'),
            text: t('common:alertText'),
            icon: "success",
            timer: 2000,
            buttons: false,
          }).then(() => {
            reloadData();
          });
        } else {
          swal.fire({
            title: t('common:alertTitle'),
            text: t('common:alertErrorText'),
            icon: "error",
            timer: 2000,
            buttons: false,
          }).then(() => {
            reloadData();

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
        <Modal show={show} onEnter={() => setTokenAppSchema(addMode, item)} onHide={() => setShow(false)} dialogClassName="modal-90w" size="sm" aria-labelledby="example-custom-modal-styling-title" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    {t('tokenApp:titleModal')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={{ span: 8, offset: 2 }} >
                        <Form.Label htmlFor="name" >{t('common:name')}</Form.Label>
                        <Form.Control name="name" {...register("name")} className={`form-control ${errors.name ? 'is-invalid' : ''}`} type="text" >
                        </Form.Control>
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

export default TokenAppForm;