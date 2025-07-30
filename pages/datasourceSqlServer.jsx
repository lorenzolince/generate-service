import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import DataGrid from '../components/common/DataGrid';
import DataSourcesSQLserver from '../components/DataSourcesSQLserver';
import dataSources from '../services/datasource';
import swal from 'sweetalert2/dist/sweetalert2.min.js';


const DatasourceSqlServer = () => {
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
            const response = await dataSources.getAll('SQL_SERVER');
          
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
            item.Update = <DataSourcesSQLserver item={item} reloadData={reloadData}></DataSourcesSQLserver>
            item.Delete = <Button onClick={(e) => deleteItem(e, item.id)} variant="danger" size="sm" >{t('common:btnDelete')}</Button>
        });

        setDatabase(dataSource.data)
    }
    useEffect(() => {
        reloadData();
    }, []);

    return (
        <>
            <title>{t('datasourceSqlServer:title')}</title>
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <h3>{t('datasourceSqlServer:title')}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col ></Col>
                        <Col md="auto">
                            <DataSourcesSQLserver reloadData={reloadData}></DataSourcesSQLserver>
                        </Col>
                    </Row>
                    <Row>

                        <Col>
                            {
                                databases.length > 0 ?
                                    <>
                                        <DataGrid data={databases} schemaColumns="datasourceSqlServer"
                                            hiddenColumns={['id', 'password', 'type', 'serviceName']} pagination={true} />
                                    </> : null
                            }

                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    );

}

export default DatasourceSqlServer;
