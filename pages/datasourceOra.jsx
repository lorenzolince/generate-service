import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import DataGrid from '../components/common/DataGrid';
import DataSourcesOra from '../components/DataSourcesOra';
import dataSources from '../services/datasource';
import swal from 'sweetalert2/dist/sweetalert2.min.js';


const DatasourceOra = () => {
    const [databases, setDatabase] = useState({});
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
                    await dataSources.Delete(id);
                    reloadData();
                }
            });

        }
        catch (error) {
        }
    }
    const getDataSources = async () => {
        try {
            const response = await dataSources.getAll('ORACLE');
          
            return response
        }
        catch (error) {
        }
    }
    const fetchDataSources = async () => {
        return Promise.all([
            getDataSources()
        ]).then(([data]) => {
            return { data };
        });
    }
    const reloadData = async () => {
        let dataSource = await fetchDataSources();
        dataSource.data.forEach(function (item) {
            item.Update = <DataSourcesOra item={item} reloadData={reloadData}></DataSourcesOra>
            item.Delete = <Button onClick={(e) => deleteItem(e, item.id)} variant="danger" size="sm" >{t('common:btnDelete')}</Button>
        });

        setDatabase(dataSource.data)
    }
    useEffect(() => {
        reloadData();
    }, []);

    return (
        <>
            <title>{t('datasourceOra:title')}</title>
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <h3>{t('datasourceOra:title')}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col ></Col>
                        <Col md="auto">
                            <DataSourcesOra reloadData={reloadData}></DataSourcesOra>
                        </Col>
                    </Row>
                    <Row>

                        <Col>
                            {
                                databases.length > 0 ?
                                    <>
                                        <DataGrid data={databases} schemaColumns="datasourceOra"
                                            hiddenColumns={['id', 'password', 'databaseName', 'type']} pagination={true} />
                                    </> : null
                            }

                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    );

}

export default DatasourceOra;
