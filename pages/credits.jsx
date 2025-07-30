import React, { useEffect, useState } from 'react';
import { Form, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import DataGrid from '../components/common/DataGrid';
import typesResources from '../services/typesResources';
import swal from 'sweetalert2/dist/sweetalert2.min.js';


const Credits = () => {
    const [wallets, setWallets] = useState({});
    const { t, lang } = useTranslation();
    const activeWallet = async (id, active) => {
        try {
            console.log("data id:", id, active);
            let data = { "id": id, "active": active }
            console.log("data to:", data);
            let generateDocument = await typesResources.activeWallet(data);
            console.log("generateDocument:", generateDocument);
            if (generateDocument.status == 200) {
                swal.fire({
                    title: t('common:alertWalletActiveTitle'),
                    text: t('common:alertWalletActiveText'),
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
                }).then(() => {
                });
                reloadData();
            }


        }
        catch (error) {
            console.log("Error downloading file:", error);
        }
    }
    const getWallet = async () => {
        try {
            const response = await typesResources.getWallet();
            return response
        }
        catch (error) {
        }
    }
    const fetchWallet = async () => {
        return Promise.all([
            getWallet()
        ]).then(([data]) => {
            return { data };
        });
    }
    const reloadData = async () => {
        let wallet = await fetchWallet();
        console.log("wallet:", wallet);
        wallet.data.forEach(function (item) {
            item.isActive = <Form.Check type={"checkbox"} id={`checkbox-${item.id}`} defaultChecked={item.active} onClick={(e) => activeWallet(item.id, e.target.checked)} variant="success" size="sm" />
        });

        setWallets(wallet.data)
    }
    useEffect(() => {
        reloadData();
    }, []);

    return (
        <>
            <title>{t('common:titleCredits')}</title>
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <h3>{t('common:titleCreditsText')}</h3>
                        </Col>
                    </Row>
                    <Row>

                        <Col>
                            {
                                wallets.length > 0 ?
                                    <>
                                        <DataGrid data={wallets} schemaColumns="common"
                                            hiddenColumns={['id', 'active']} pagination={true} />
                                    </> : null
                            }

                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    );

}

export default Credits;
