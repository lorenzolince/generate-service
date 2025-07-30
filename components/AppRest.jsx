import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from 'react-i18next';
import TreeCheckBox from "../components/common/TreeCheckBox"; // Adjust the import path as necessary
import Swal from 'sweetalert2/dist/sweetalert2.min.js';

const AppRest = ({ item, setProcedures, owner }) => {
    const [show, setShow] = useState(false);
    const [selectedProcedures, setSelectedProcedures] = useState([]);
    const { t, lang } = useTranslation();
    const handleSelect = (selectedNodes) => {
        console.log("Selected nodes:", selectedNodes);
        setSelectedProcedures(selectedNodes);
    };
    const addToList = () => {
        setProcedures([...selectedProcedures]);
        setShow(false);
    };
    const isQuery = () => {
        Swal.fire({
            title: t('common:queryTitle'),
             width: '1000px', 
            html: `
                <input type="text" id="swal-input" class="swal2-input" placeholder="${t('common:queryMethod')}">
               <textarea id="swal-textarea" class="swal2-textarea" style="width: 90%; height: 150px;" placeholder="${t('common:queryContext')}"></textarea>
  `,
            showCancelButton: true,
            confirmButtonText: 'Add',
            preConfirm: () => {
                return {
                    inputValue: document.getElementById('swal-input').value,
                    textareaValue: document.getElementById('swal-textarea').value
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
                console.log(randomNumber);
                let newProcedure = [{
                    id: randomNumber,
                    name: result.value.inputValue,
                    nameMethod: result.value.inputValue,
                    type: 'QUERY',
                    packNme: null,
                    senderType: null,
                    typeMethod: result.value.textareaValue.trim(),
                    owner: owner
                }];
                setSelectedProcedures([...selectedProcedures, ...newProcedure]);
            }
        });
    };

    return (
        <div>
            <Container>
                <Row>
                    <Col md="auto">
                        <Button onClick={() => setShow(true)} className="common-button-color">
                            Editar
                        </Button>
                    </Col>
                </Row>
            </Container>
            <Modal show={show} onEnter={() => setSelectedProcedures([])} onHide={() => setShow(false)} size="lg" enforceFocus={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('index:titleModal')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    <TreeCheckBox data={item} onSelect={handleSelect} owner={owner} />
                    <Form.Group>
                        <Form.Label htmlFor={'query'} className="mb-3">
                            {t('common:query')}
                        </Form.Label>
                        <br></br>
                        <Button variant="info" onClick={isQuery}>
                            {t('common:btnAdd')}
                        </Button>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
                    <Button className="common-button-color" onClick={addToList}>
                        {t('common:btnAdd')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AppRest;