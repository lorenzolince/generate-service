import React, { useState, useRef } from 'react';
import { Form, Row, Col,Container, Table, Pagination } from "react-bootstrap";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { TrashFill, FilePlusFill } from 'react-bootstrap-icons';

const ParametersGrid = ({ data, schemaColumns, hiddenColumns, onClicAdd, pagination, onClicDelete, setParameters, size = "md" }) => {

    if (data === undefined) return null
    const { t, lang } = useTranslation();
    const passengerTitle = t(`${schemaColumns}:parameterInfo`)
    const header = {
        parameterName: null,
        parameterValue: null,
        Delete: null
    }

    const onChangeText = async (e, rowIndex, columnName, value) => {
        setParameters(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnName]: value,
                    }
                }
                return row
            })
        );

    }
    const addNewRow = async () => {
        let dataList = []
        const rows = table.getRowModel().rows;
        rows.forEach(item => {
            delete item.original.Delete
            dataList.push(item.original)

        })
        onClicAdd(dataList)
    }
    const onChangeDelete = async (e, rowIndex) => {
        let dataList = []
        const rows = table.getRowModel().rows;
        rows.forEach(item => {
            delete item.original.Delete
            dataList.push(item.original)
        })
        onClicDelete(dataList, rowIndex);
    }

    const [paginationState, setPaginationState] = useState({
        pageIndex: 0,
        pageSize: pagination ? 10 : (data.length + 1) * 100
    });

    const [globalFilter, setGlobalFilter] = useState("");
    const getColumns = (data) => {
        // Ajuste de datos antes de crear las columnas
        data.forEach(item => {
            item.Delete = item.binOrder ? "Delete" : " ";
        });
    
        const items = Object.keys(header);
    
        return items.map(elem => ({
            header: elem !== "Delete" && !hiddenColumns.includes(elem) ? t(`${schemaColumns}:${elem}`) : "Delete",
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
        <Container >
            <Table striped bordered hover size={size} responsive="sm">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className='common-table'>
                                    {header.column.id === "Delete" ?
                                        <FilePlusFill onClick={addNewRow} color="green" size={30} cursor={'pointer'} /> :
                                        header.column.columnDef.header
                                    }
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                const columname = cell.column.id;
                                const columnId = `${columname}${row.index}`;
                                const value = cell.getValue();

                                return (
                                    <td key={cell.id}>
                                        {
                                            columname !== "Delete" &&
                                            <Form.Group>
                                                <Form.Control size="sm" name={columnId} value={value}
                                                    onChange={(e) => onChangeText(e, cell.row.index, columname, e.target.value)}
                                                    type="text">
                                                </Form.Control>
                                            </Form.Group>
                                        }
                                        {
                                            columname === "Delete" &&
                                            <Form.Group>
                                                <TrashFill name={columnId} onClick={(e) => onChangeDelete(e, cell.row.index)} color="red" size={30} cursor={'pointer'} ></TrashFill>
                                            </Form.Group>
                                        }
                                    </td>
                                );
                            })}
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
        </Container>
    )
}

export default ParametersGrid;