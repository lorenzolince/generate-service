import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import DataGrid from '../components/common/DataGrid';
import DevopsForm from '../components/DevopsForm';
import typesResources from '../services/typesResources';
import swal from 'sweetalert2/dist/sweetalert2.min.js';


const Devops = () => {
    const [appicationServer, setAppicationServe] = useState([]);
    const [devops, setDevops] = useState({});
    const { t, lang } = useTranslation();
    const deleteItem = async (e, id) => {
        try {
            swal.fire({
                title: t('common:alertConfirmTitle'),
                text: t('common:alertConfirmText'),
                icon: "warning",
                buttons:
                {
                    cancel: { text: `${t('common:btnCancel')}`, visible: true },
                    confirm: { text: `${t('common:btnOk')}`, visible: true }
                }
            }).then(async (confirm) => {
                if (confirm.isConfirmed) {
                    await typesResources.deleteDevops(id);
                    reloadData();
                }
            });
        }
        catch (error) {
        }
    }
    const getDevops = async () => {
        try {
            const response = await typesResources.getDevops();
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
    const fetchDevops = async () => {
        return Promise.all([
            getTypeAppicationServer(),
            getDevops()
        ]).then(([dataType, data]) => {
            return { dataType, data };
        });
    }
    const reloadData = async () => {
        let devops = await fetchDevops();
        let applicationService = [];
        devops.dataType.forEach(function (item, index) {
            applicationService.push({ id: index, description: item });
        });
        setAppicationServe(applicationService);

        devops.data.forEach(function (item) {
            let param = item.parameters
            delete item.parameters;
            item.Update = <DevopsForm item={item} parametersApp={param} applicationService={applicationService} reloadData={reloadData}></DevopsForm>
            item.Delete = <Button onClick={(e) => deleteItem(e, item.id)} variant="danger" size="sm" >{t('common:btnDelete')}</Button>
        });

        setDevops(devops.data)
    }
    useEffect(() => {
        reloadData();
    }, []);

    return (
        <>
            <title>{t('devops:title')}</title>
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <h3>{t('devops:title')}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col ></Col>
                        <Col md="auto">
                            <DevopsForm applicationService={appicationServer} reloadData={reloadData}></DevopsForm>
                        </Col>
                    </Row>
                    <Row>

                        <Col>
                            {
                                devops.length > 0 ?
                                    <>
                                        <DataGrid data={devops} schemaColumns="devops"
                                            hiddenColumns={['id', 'url', 'password', 'tokenValue']} pagination={true} />
                                    </> : null
                            }

                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    );

}

export default Devops;
