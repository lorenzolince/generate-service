import React, { useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import SenderType from "../SenderType";

const TreeCheckBox = ({ data, onSelect, owner }) => {
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState({});
    // console.log("data", data);

    const toggleExpand = (id) => {
        setExpandedNodes((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSelection = (node, parent) => {
        let updatedSelection = [...selectedNodes];
        const isSelected = selectedNodes.some((item) => item.id === node.id);

        if (isSelected) {
            updatedSelection = updatedSelection.filter((item) => item.id !== node.id);
        } else {
            // Extraer la información de `value`
            const content = node.value.split(",");
            const category = content[0]; // `PACKAGE`, `PROCEDURE`, `FUNCTION`
            const typeMethod = content[1] || category; // Tipo de método
            const packName = category === "PACKAGE" ? content[2] : null; // Nombre del paquete si aplica

            updatedSelection.push({
                id: node.id,
                name: node.label,
                owner: owner,
                type: category,
                packNme: packName,
                typeMethod: typeMethod,
                nameMethod: node.label,
                senderType:null
            });
        }

        setSelectedNodes(updatedSelection);
        onSelect && onSelect(updatedSelection);
    };

    const renderTreeNodes = (nodes, parent = {}) => {
        return nodes.map((node) => (
            <div key={node.id || node.value} className="tree-node">
                {!node.disabled && (
                    <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedNodes.some((item) => item.id === node.id)}
                        onChange={() => handleSelection(node, parent)}
                    />
                )}
                <span className="tree-label" onClick={() => toggleExpand(node.id || node.value)}>
                {node.label} {node.children && (expandedNodes[node.id || node.value] ? <FaAngleDown /> : <FaAngleRight />)}
                </span>
                {expandedNodes[node.id || node.value] && node.children ? renderTreeNodes(node.children, node) : null}
            </div>
        ));
    };

    return <div className="tree-checkbox-container">{renderTreeNodes(data)}</div>;
};

export default TreeCheckBox;