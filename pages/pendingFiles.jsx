import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import DataGrid from '../components/common/DataGrid';
import dataSources from '../services/datasource';
import typesResources from '../services/typesResources';
import swal from 'sweetalert2/dist/sweetalert2.min.js';
import Spinner from 'react-bootstrap/Spinner';

const PendingFiles = () => {
    const [files, setFiles] = useState([]);
    const { t, lang } = useTranslation();
    const [loadingId, setLoadingId] = useState(null);

    const downLoadFileZip = async (e, id, rowIndex) => {
        try {
            e.preventDefault();
            setFiles(old =>
                old.map((row, index) => {
                    if (index === rowIndex) {
                        return {
                            ...old[rowIndex],
                            ["download"]: (
                                <Button
                                    variant="success"
                                    size="sm"
                                    disabled={true}
                                >
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                </Button>
                            ),
                        }
                    }
                    return row
                })
            );
            let generateDocument = await dataSources.downLoadFileZip(id);
            if (generateDocument.status == 200) {
                swal.fire({
                    title: t('common:alertBinaryTitle'),
                    text: t('common:toolButon'),
                    icon: "success",
                    timer: 2500,
                    buttons: false,
                });
                reloadData();
            } else {
                swal.fire({
                    title: generateDocument.error,
                    text: generateDocument.message,
                    icon: "error",
                }).then(() => { });
                reloadData();
            }
        } catch (error) {
            console.log("Error downloading file:", error);
            reloadData();
        }
    };
    const getPendingFiles = async () => {
        try {
            const response = await typesResources.getPendingFiles();
            return response
        }
        catch (error) {
        }
    }
    const fetchPendingFiles = async () => {
        return Promise.all([
            getPendingFiles()
        ]).then(([data]) => {
            return { data };
        });
    }
    const reloadData = async () => {
        let pending = await fetchPendingFiles();
        pending.data.forEach(function (item, index) {
            item.download = (
                <Button
                    onClick={(e) => downLoadFileZip(e, item.id, index)}
                    variant="success"
                    size="sm"
                >
                    {t('common:toolButon')}
                </Button>
            );
        });

        setFiles(pending.data)
    }
    useEffect(() => {
        reloadData();
    }, []);

    return (
        <>
            <title>{t('common:titlePendingFiles')}</title>
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <h3>{t('common:titlePendingFilesText')}</h3>
                        </Col>
                    </Row>
                    <Row>

                        <Col>
                            {
                                files.length > 0 ?
                                    <>
                                        <DataGrid data={files} schemaColumns="common"
                                            hiddenColumns={['id']} pagination={true} />
                                    </> : null
                            }

                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    );

}

export default PendingFiles;
