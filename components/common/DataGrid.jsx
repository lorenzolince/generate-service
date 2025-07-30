import React, { useState } from 'react';
import { Form, Row, Col, Table, Pagination } from "react-bootstrap";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

const DataGrid = ({ data, schemaColumns, hiddenColumns, pagination, filtering, onChangeQueue, queue , size = "sm" }) => {
    if (!data || Object.keys(data).length === 0) return null;

    const { t } = useTranslation();
    
    // Estado de paginación y filtrado
    const [paginationState, setPaginationState] = useState({
        pageIndex: 0,
        pageSize: pagination ? 10 : (data.length + 1) * 100
    });

    const [globalFilter, setGlobalFilter] = useState("");

    const getColumns = (data) => {
        return Object.keys(data[0]).map(elem => ({
            header: <div className='form-check'>{t(`${schemaColumns}:${elem}`)}</div>,
            accessorKey: elem,
        }));
    };

    const table = useReactTable({
        data,
        columns: getColumns(data),
        state: {
            pagination: paginationState,
            globalFilter: globalFilter,
            columnVisibility: hiddenColumns.reduce((acc, col) => ({ ...acc, [col]: false }), {}),
        },
        onPaginationChange: setPaginationState,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div>
            <Row hidden={!filtering}>
                <Col>
                    <Form.Group>
                        <Form.Label htmlFor="search" size="sm">{t('common:search')}</Form.Label>
                        <Form.Control name="search" type="text" placeholder={t('common:search')}
                            value={globalFilter}
                            onChange={e => setGlobalFilter(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Table striped bordered hover size={size} responsive="sm">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th className='common-table' key={header.id}>{header.column.columnDef.header}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td className='common-table-td' key={cell.id}>
                                    {cell.column.id === "producer" && queue ? (
                                        <Form.Group>
                                            <Form.Check type="checkbox"
                                               className='common-table-td'
                                                id={`is-producer-switch-${row.index}`}
                                                checked={row.original.producer}
                                                onChange={(e) => onChangeQueue(e, cell.row.index, cell.column.id, e.target.checked)}
                                            />
                                        </Form.Group>
                                    ) : cell.column.id === "consumer" && queue ? (
                                        <Form.Group>
                                            <Form.Check type="checkbox"
                                                className='common-table-td'
                                                id={`is-consumer-switch-${row.index}`}
                                                checked={row.original.consumer}
                                                onChange={(e) => onChangeQueue(e, cell.row.index, cell.column.id, e.target.checked)}
                                            />
                                        </Form.Group>
                                    ) : (
                                        cell.renderValue()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Row hidden={!pagination}>
                <Col></Col>
                <Col md="auto">
                    <Form.Label size="sm">Página:</Form.Label>{' '}
                    <Form.Label size="sm"><strong>{paginationState.pageIndex + 1} De {table.getPageCount()}</strong></Form.Label>{' '}
                    <Form.Label htmlFor="irA" size="sm">| Ir a:</Form.Label>{' '}
                </Col>
                <Col md="auto">
                    <Form.Control name="irA" size="sm" type="number" min="1" max={table.getPageCount()} defaultValue={paginationState.pageIndex + 1}
                       className='common-table-pagination.number' onChange={e => setPaginationState(prev => ({ ...prev, pageIndex: Number(e.target.value) - 1 }))} 
                    />
                </Col>
                <Col md="auto">
                    <Form.Control name="selectPage" size="sm" as="select" value={paginationState.pageSize}
                       className='common-table-pagination.selectPage' onChange={e => setPaginationState(prev => ({ ...prev, pageSize: Number(e.target.value) }))}>
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Ver {pageSize}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
                <Col md="auto">
                    <Pagination size="sm">
                        <Pagination.First onClick={() => setPaginationState(prev => ({ ...prev, pageIndex: 0 }))} disabled={paginationState.pageIndex === 0} />
                        <Pagination.Prev onClick={() => setPaginationState(prev => ({ ...prev, pageIndex: Math.max(prev.pageIndex - 1, 0) }))} disabled={paginationState.pageIndex === 0} />
                        <Pagination.Next onClick={() => setPaginationState(prev => ({ ...prev, pageIndex: Math.min(prev.pageIndex + 1, table.getPageCount() - 1) }))} disabled={paginationState.pageIndex >= table.getPageCount() - 1} />
                        <Pagination.Last onClick={() => setPaginationState(prev => ({ ...prev, pageIndex: table.getPageCount() - 1 }))} disabled={paginationState.pageIndex >= table.getPageCount() - 1} />
                    </Pagination>
                </Col>
            </Row>
        </div>
    );
};

export default DataGrid;