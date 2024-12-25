import { useState, useEffect, useRef } from "react";
import FunctionNode from "./components/FunctionNode";
import "./Functionstyles.css";

const initialNodes = [
  { id: 1, equation: "x*2", nextFunction: 4 },
  { id: 2, equation: "x*2+20", nextFunction: 0 },
  { id: 3, equation: "x/2", nextFunction: 2 },
  { id: 4, equation: "2*x+4", nextFunction: 5 },
  { id: 5, equation: "x-2", nextFunction: 3 },
];

export default function FunctionFlow() {
  const [nodes, setNodes] = useState(initialNodes);
  const containerRef = useRef(null);
  const [nodeValue, setNodeValue] = useState(2);

  const calculateNodeValues = () => {
    let currentValue = nodeValue; // Default value for initial node
    const updatedNodes = [...nodes];
    const visited = new Set();

    let currentNode = updatedNodes[0];

    while (currentNode && !visited.has(currentNode.id)) {
      visited.add(currentNode.id);

      try {
        const equationFunc = new Function("x", `return ${currentNode.equation};`);
        currentValue = equationFunc(currentValue);

        const nodeIndex = updatedNodes.findIndex((n) => n.id === currentNode.id);
        if (nodeIndex !== -1) {
          updatedNodes[nodeIndex] = { ...currentNode, value: currentValue };
        }

        currentNode = updatedNodes.find((n) => n.id === currentNode.nextFunction);
      } catch (error) {
        console.error("Error evaluating equation:", error);
        break;
      }
    }

    setNodes(updatedNodes);
  };
  // Update the initial value for a node and trigger recalculation
  function onInitialValueChange(nodeId, value) {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, initialValue: value } : node
      )
    );
    setNodeValue(value)
  }

  // Update final output for a node
  function onFinalOutputChange(nodeId, value) {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, finalOutput: value } : node
      )
    );
  }

  // Recalculate node values whenever nodes state changes (including initial value changes)
  useEffect(() => {
    calculateNodeValues(nodeValue);
  }, [nodes,nodeValue]); // Trigger when any node is updated, including initial value

 

  // Update the equation for a node
  const handleEquationChange = (id, equation) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === id ? { ...node, equation } : node))
    );
  };

  // Update the next function for a node
  const handleNextFunctionChange = (id, nextId) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id
          ? { ...node, nextFunction: nextId ? parseInt(nextId) : undefined }
          : node
      )
    );
  };

  const getNodePosition = (index) => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const nodeElements =
      containerRef.current.getElementsByClassName("function-node");
    const nodeElement = nodeElements[index];
    if (!nodeElement) return { x: 0, y: 0 };

    const rect = nodeElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2,
    };
  };

  const renderConnections = () => {
    return nodes.map((node, index) => renderConnection(node, index));
  };

  const renderConnection = (node, index) => {
    if (!node.nextFunction) return null;

    const start = getNodePosition(index);
    const endNodeIndex = nodes.findIndex((n) => n.id === node.nextFunction);
    if (endNodeIndex === -1) return null;
    const end = getNodePosition(endNodeIndex);

    const controlPoint1X = start.x + (end.x - start.x) / 2;
    const controlPoint2X = controlPoint1X;

    return (
      <path
        key={`${node.id}-${node.nextFunction}`}
        d={`M ${start.x} ${start.y} C ${controlPoint1X} ${start.y}, ${controlPoint2X} ${end.y}, ${end.x} ${end.y}`}
        className="connection-path"
      />
    );
  };

  const renderNodes = () => {
    return nodes.map((node, index) => (
      <FunctionNode
        key={node.id}
        node={node}
        onInitialValueChange={onInitialValueChange}
        onFinalOutputChange={onFinalOutputChange}
        index={index}
        onEquationChange={handleEquationChange}
        onNextFunctionChange={handleNextFunctionChange}
        availableNodes={nodes}
      />
    ));
  };

  return (
    <div className="container" ref={containerRef}>
      <svg className="connections">{renderConnections()}</svg>
      <div className="nodes-container">{renderNodes()}</div>
    </div>
  );
}
