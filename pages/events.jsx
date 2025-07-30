import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import DataGrid from '../components/common/DataGrid';
import typesResources from '../services/typesResources';
import swal from 'sweetalert2/dist/sweetalert2.min.js';

import Link from 'next/link';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone';

const Events = () => {
    const [eventsList, setEventsList] = useState({});
    const { t, lang } = useTranslation();
    const [eventDate, setEventDate] = useState(new Date());
    const [totalTest, setTotalTest] = useState("");
    const [totalSrc, setTotalSrc] = useState("");
    const [totalBinary, setTotalBinary] = useState("");
    const [totalDevops, setTotalDevops] = useState("");
    const [totalXsd, setTotalXsd] = useState("");

    const getEvents = async (event) => {
        try {
            const response = await typesResources.getEventsClient(event);

            return response
        }
        catch (error) {
        }
    }
    const fetchEvents = async (event) => {
        return Promise.all([
            getEvents(event)
        ]).then(([data]) => {
            return { data };
        });
    }
    const eventDateOnChange = async (eventDate) => {
        setEventDate(eventDate)
        let events = await fetchEvents(moment(eventDate).format("yyyy-MM"));
        setTotalTest(events.data.totalTest)
        setTotalSrc(events.data.totalSrc)
        setTotalBinary(events.data.totalBinary)
        setTotalXsd(events.data.totalXsd)
        setTotalDevops(events.data.totalDevops)
        let eventList = events.data.events
        eventList.forEach(function (item) {
            item.procedure = <Link href="#" onClick={(e) => eventsSp(e, item.procedures)} variant="danger" size="sm" >{item.procedureCount}</Link>
        });
        setEventsList(events.data.events)
    }
    const eventsSp = async (e, data) => {
        let message = ``;
        data.forEach(function (item) {
            message = message + `<tr><td class='event-message-alert-td' >${item}</td></tr>`;
        });
        swal.fire({
            title: t('events:titleProcedures'),
            html: `
            <div>
            <div><table class='event-message-alert-table'>${message}</table> </div>
            </div>
        `,
            icon: "success",
            showCancelButton: false
        });

    }
    const reloadData = async () => {
        let date = new Date();
        setEventDate(date)
        const eventDate = moment(date).format("YYYY-MM");
        let events = await fetchEvents(eventDate);
        setTotalTest(events.data.totalTest)
        setTotalSrc(events.data.totalSrc)
        setTotalBinary(events.data.totalBinary)
        setTotalXsd(events.data.totalXsd)
        setTotalDevops(events.data.totalDevops)
        let eventList = events.data.events
        eventList.forEach(function (item) {
            item.procedure = <Link href="#" onClick={(e) => eventsSp(e, item.procedures)} variant="danger" size="sm" >{item.procedureCount}</Link>
        });
        setEventsList(events.data.events)
    }
    useEffect(() => {
        reloadData();
    }, []);

    return (
        <>
            <title>{t('events:title')}</title>
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <h3>{t('events:titleModal')}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{ span: 3, offset: 0 }}>
                            <Form.Group>
                                <Form.Label htmlFor="totalSrc"  >{t('events:totalSrc')}</Form.Label>
                                <Form.Control name="totalSrc" defaultValue={totalSrc} type="text"
                                    readOnly >
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={{ span: 3, offset: 1 }}>
                            <Form.Group>
                                <Form.Label htmlFor="totalBinary" >{t('events:totalBinary')}</Form.Label>
                                <Form.Control name="totalBinary" defaultValue={totalBinary} type="text" readOnly >
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={{ span: 3, offset: 1 }}>
                            <Form.Group>
                                <Form.Label>{t('events:eventDate')}</Form.Label>
                                <div>
                                    <DatePicker
                                        name="eventDate"
                                        showMonthYearPicker
                                        dateFormat="yyyy-MM"
                                        selected={eventDate}
                                        onChange={eventDateOnChange}
                                        className="form-control"
                                    />
                                </div>
                            </Form.Group>

                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col md={{ span: 3, offset: 0 }}>
                            <Form.Group>
                                <Form.Label htmlFor="totalXsd" >{t('events:totalXsd')}</Form.Label>
                                <Form.Control name="totalXsd" defaultValue={totalXsd} type="text" readOnly >
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={{ span: 3, offset: 1 }}>
                            <Form.Group>
                                <Form.Label htmlFor="totalDevops" >{t('events:totalDevops')}</Form.Label>
                                <Form.Control name="totalDevops" defaultValue={totalDevops} type="text" readOnly >
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={{ span: 3, offset: 1 }}>
                            <Form.Group>
                                <Form.Label htmlFor="totalTest" >{t('events:totalTest')}</Form.Label>
                                <Form.Control name="totalTest" defaultValue={totalTest} type="text" readOnly >
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <br></br>
                    <Row>

                        <Col>
                            {
                                eventsList.length > 0 ?
                                    <>
                                        <DataGrid data={eventsList} schemaColumns="events"
                                            hiddenColumns={["procedures", "procedureCount"]} pagination={true} filtering={true} />
                                    </> : null
                            }

                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    );

}

export default Events;
