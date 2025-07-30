import React, { useEffect, useState } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import creditPricing from '../services/creditPricing';
import swal from 'sweetalert2/dist/sweetalert2.min.js';
import { useRef } from 'react';


const Plans = () => {
    const { t } = useTranslation();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [quoteResult, setQuoteResult] = useState(null);
    const [creditCosts, setCreditCosts] = useState([]);
    const resultRef = useRef(null);


    const fetchCreditCosts = async () => {
        try {
            const result = await creditPricing.getCreditCosts();
            setCreditCosts(result || []);
        } catch (error) {
            console.error("Error fetching credit costs:", error);
            swal.fire({
                title: t('creditPricing:errorLoadingTitle'),
                text: t('creditPricing:errorLoadingTechCredits'),
                icon: "error"
            });
        }
    };

    const getPlans = async () => {
        try {
            setLoading(true);
            const result = await creditPricing.getInitialPricing();
            setPlans(result || []);
        } catch (error) {
            console.error("Error loading plans:", error);
            swal.fire({
                title: t('creditPricing:errorLoadingTitle'),
                text: t('creditPricing:errorLoadingPlans'),
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
    };
    const handleQuote = async (e) => {
        e.preventDefault();
        if (!selectedPlanId || !quantity) return;

        try {
            const result = await creditPricing.quotePackage({
                durationBlockId: Number(selectedPlanId),
                quantity: Number(quantity)
            });
            setQuoteResult(result);

            // 👇 Scroll hacia el resultado
            if (resultRef.current) {
                resultRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error("Error quoting package:", error);
            swal.fire({
                title: t('creditPricing:errorQuoteTitle'),
                text: t('creditPricing:errorQuoteText'),
                icon: "error"
            });
        }
    };




    useEffect(() => {
        fetchCreditCosts(); // nueva
        getPlans();
        if (quoteResult && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth' });
        }

    }, [quoteResult]);

    return (
        <>
            <title>{t('creditPricing:titlePlans')}</title>
            <Container className="pb-5">
                <Form>
                    <Row className="mb-4">
                        <Col>
                            <h3>{t('creditPricing:resourceCreditTableTitle')}</h3>
                            <p className="text-muted">{t('creditPricing:resourceCreditTableNote')}</p>

                            <table className="table table-bordered table-sm">
                                <thead className="table-light">
                                    <tr>
                                        <th>{t('creditPricing:technology')}</th>
                                        <th>{t('creditPricing:creditPerEndpoint')}</th>
                                        <th>{t('creditPricing:creditHint')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {creditCosts.map((tech) => (
                                        <tr key={tech.techCode}>
                                            <td>{tech.displayName}</td>
                                            <td>{tech.creditPerEndpoint}</td>
                                            <td>{t('creditPricing:endpointNote')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h3>{t('creditPricing:titlePlansText')}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p className="text-muted">
                                {t('creditPricing:priceNote')}
                            </p>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        {plans.map((plan, index) => (
                            <Col key={index} md={2} xs={12}>
                                <div className="border rounded shadow-sm p-3 text-center h-100 d-flex flex-column justify-content-between">
                                    <h5 className="fw-bold">{plan.label}</h5>

                                    <div className="mt-2 mb-1 text-muted">
                                        <span className="fw-semibold">{t('creditPricing:duration')}:</span><br />
                                        {
                                            plan.durationMonths === 999
                                                ? t('creditPricing:noLimit')
                                                : `${plan.durationMonths} ${t('creditPricing:months')}`
                                        }
                                    </div>

                                    <div className="mb-1 text-muted">
                                        <span className="fw-semibold">{t('creditPricing:basePrice')}:</span><br />
                                        ${plan.basePrice.toFixed(2)}
                                    </div>

                                    <div className="mb-1 text-muted">
                                        <span className="fw-semibold">{t('creditPricing:discount')}:</span><br />
                                        {plan.discountPercentage}%
                                    </div>

                                    <div className="mb-1 text-success">
                                        <span className="fw-semibold">{t('creditPricing:finalPrice')}:</span><br />
                                        ${plan.finalPrice.toFixed(2)}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <div className="mt-4">
                        <Row className="mb-3 align-items-end">
                            <Col md={4}>
                                <Form.Label>{t('creditPricing:selectPlan')}</Form.Label>
                                <Form.Select
                                    value={selectedPlanId}
                                    onChange={(e) => setSelectedPlanId(e.target.value)}
                                    className="form-select-sm"
                                    style={{ maxWidth: '220px' }}
                                >
                                    <option value="">{t('creditPricing:chooseOption')}</option>
                                    {plans.map((plan) => (
                                        <option key={plan.durationBlockId} value={plan.durationBlockId}>{plan.label}</option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col md={4}>
                                <Form.Label>{t('creditPricing:creditQuantity')}</Form.Label>
                                <Form.Control
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder={t('creditPricing:enterQuantity')}
                                    className="form-control-sm"
                                    style={{ maxWidth: '120px' }}
                                />
                            </Col>

                            <Col md={2}>
                                <button type="button" className="btn btn-primary w-100" onClick={handleQuote}>
                                    {t('creditPricing:quoteButton')}
                                </button>
                            </Col>
                        </Row>



                        {quoteResult && (
                            <Row ref={resultRef} className="mt-4">
                                <Col>
                                    <div className="bg-light border rounded p-4 shadow-sm">
                                        <h4 className="mb-3 text-primary">{t('creditPricing:quoteResult')}</h4>

                                        <p className="mb-1">
                                            <strong>{t('creditPricing:selectedPlan')}:</strong> {quoteResult.label}
                                        </p>
                                        <p className="mb-1">
                                            <strong>{t('creditPricing:apiDuration')}:</strong> {
                                                quoteResult.durationMonths === 999
                                                    ? t('creditPricing:noLimit')
                                                    : `${quoteResult.durationMonths} ${t('creditPricing:months')}`
                                            }
                                        </p>
                                        <p className="mb-1">
                                            <strong>{t('creditPricing:creditQuantity')}:</strong> {quoteResult.quantity}
                                        </p>

                                        <hr />
                                        <p className="mb-1">
                                            <strong>{t('creditPricing:discount')}:</strong> {quoteResult.discountPercentage}%
                                        </p>
                                        <p className="mb-1">
                                            <strong>{t('creditPricing:unitPriceBeforeDiscount')}:</strong> ${quoteResult.unitPriceBeforeDiscount?.toFixed(2)}
                                        </p>
                                        <p className="mb-1 text-success">
                                            <strong>{t('creditPricing:unitPriceWithDiscount')}:</strong> ${quoteResult.unitPriceWithDiscount?.toFixed(2)}
                                        </p>
                                        <p className="mb-1 fw-bold">
                                            <strong>{t('creditPricing:totalPriceWithNotDiscount')}:</strong> ${quoteResult.totalPriceBeforeDiscount?.toFixed(2)}
                                        </p>
                                        <p className="mb-1 text-success">
                                            <strong>{t('creditPricing:totalPriceWithDiscount')}:</strong> ${quoteResult.totalPriceWithDiscount?.toFixed(2)}
                                        </p>

                                        <hr />

                                        <p className="mb-1">
                                            <strong>{t('creditPricing:expirationDate')}:</strong> {quoteResult.expirationDate ?? '-'}
                                        </p>
                                        <p className="mt-2 text-muted">
                                            {t('creditPricing:quoteNote')}
                                        </p>
                                    </div>
                                </Col>
                                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                                    <p style={{ fontSize: "1rem", color: "#003B73" }}>
                                        {t('creditPricing:contactMessage')}
                                        <a
                                            href="https://lincetechnology.net/contacto/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: "#6C63FF",
                                                fontWeight: "bold",
                                                textDecoration: "underline",
                                                marginLeft: "6px"
                                            }}
                                        >
                                            {t('creditPricing:contactLink')}
                                        </a>
                                    </p>
                                </div>
                            </Row>
                        )}
                    </div>
                </Form>
            </Container>
        </>
    );
};

export default Plans;