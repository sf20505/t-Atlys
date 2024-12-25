function FunctionNode({ node, index, onEquationChange, onNextFunctionChange, availableNodes, onInitialValueChange,nodes }) {
  if (!node) return null;

  const getNodePosition = (nodeIndex) => {
    // Assuming each node is placed on a grid with fixed spacing
    const gridGapX = 300; // Horizontal gap between nodes
    const gridGapY = 200; // Vertical gap between nodes
    const row = Math.floor(nodeIndex / 3); // Assuming 3 columns
    const col = nodeIndex % 3;
    return {
      x: col * gridGapX + 140, // Add half node width for centering
      y: row * gridGapY + 50,
    };
  };

  const renderConnections = () => {
    const NODE_PADDING = 15; // Padding for start and end points

    return nodes?.map((node, nodeIndex) => {
      if (!node.nextFunction) return null;

      const start = getNodePosition(nodeIndex);
      const endNodeIndex = nodes.findIndex((n) => n.id === node.nextFunction);
      if (endNodeIndex === -1) return null;
      const end = getNodePosition(endNodeIndex);

      // Offset start and end positions slightly
      const startX = start.x + NODE_PADDING;
      const startY = start.y;
      const endX = end.x - NODE_PADDING;
      const endY = end.y;

      // Calculate Bezier control points
      const controlPoint1X = startX + (endX - startX) / 3;
      const controlPoint1Y = startY;
      const controlPoint2X = endX - (endX - startX) / 3;
      const controlPoint2Y = endY;

      return (
        <path
          key={`${node.id}-${node.nextFunction}`}
          d={`M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`}
          className="connection-path"
        />
      );
    });
  };

  return (
    <>
      <div className="node-wrapper">
        <div className="function-node">
          <div className="function-title">Function: {node.id}</div>

          <div className="input-group">
            <label className="input-label">Equation</label>
            <input
              type="text"
              value={node.equation}
              onChange={(e) => onEquationChange(node.id, e.target.value)}
              className="equation-input"
              placeholder="e.g. x*2"
            />
          </div>

          {!node.nextFunction && node.value !== undefined && (
            <div className="value-badge final-value">Final Output: {node.value}</div>
          )}

          {index === 0 && (
 <div className="value-badge initial-value">
              <div className="value-badge initial-value"> Input: {node.value}</div>

 <input
   type="number"
   value={node.initialValue || 2} // Default value 2
   onChange={(e) => onInitialValueChange(node.id, e.target.value)}
   className="form-input"
   placeholder="Enter initial value"
   min="10" // Minimum value set to 10
   max="999" // Maximum value set to 999
 />
</div>
       )}

          {node.nextFunction !== undefined && (
            <div className="input-group">
              <label className="input-label">Next function</label>
              <select
                value={node.nextFunction || ''}
                onChange={(e) => onNextFunctionChange(node.id, e.target.value)}
                className="function-select"
              >
                {availableNodes
                  .filter((n) => n.id !== node.id)
                  .map((n) => (
                    <option key={n.id} value={n.id}>
                      Function {n.id}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="io-indicators">
            <div className="io-indicator">
              <div className="io-dot" />
              <span className="io-label">input</span>
            </div>
            <div className="io-indicator">
              <span className="io-label">output</span>
              <div className="io-dot" />
            </div>
          </div>
        </div>
      </div>
      <svg className="connections">{renderConnections()}</svg>
    </>
  );
}

export default FunctionNode;
