import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ForceGraph from './components/ForceGraph'; // adjust path if needed
import { v4 as uuidv4 } from 'uuid'; // optional, if you add nodes later


const MindMap = () => {
    const location = useLocation();
    const centralIdea = location.state?.centralIdea || 'Central Idea';
  
    const [nodes, setNodes] = useState([
        { id: 'root', label: centralIdea, fx: 1013, fy: 573 }, // Depth 0
      
        // Depth 1
        { id: 'A', label: 'Layer 1 - A' },
        { id: 'B', label: 'Layer 1 - B' },
      
        // Depth 2
        { id: 'C', label: 'Layer 2 - C' },
        { id: 'D', label: 'Layer 2 - D' },
      
        // Depth 3
        { id: 'E', label: 'Layer 3 - E' },
        { id: 'F', label: 'Layer 3 - F' },
      
        // Depth 4
        { id: 'G', label: 'Layer 4 - G' },
        { id: 'H', label: 'Layer 4 - H' },
      
        // Depth 5
        { id: 'I', label: 'Layer 5 - I' },
        { id: 'J', label: 'Layer 5 - J' },
      
        // Depth 6
        { id: 'K', label: 'Layer 6 - K' },
        { id: 'L', label: 'Layer 6 - L' },
      ]);
      
  
      const [links, setLinks] = useState([
        // Depth 1
        { source: 'root', target: 'A' },
        { source: 'root', target: 'B' },
      
        // Depth 2
        { source: 'A', target: 'C' },
        { source: 'B', target: 'D' },
      
        // Depth 3
        { source: 'C', target: 'E' },
        { source: 'D', target: 'F' },
      
        // Depth 4
        { source: 'E', target: 'G' },
        { source: 'F', target: 'H' },
      
        // Depth 5
        { source: 'G', target: 'I' },
        { source: 'H', target: 'J' },
      
        // Depth 6
        { source: 'I', target: 'K' },
        { source: 'J', target: 'L' },
      ]);
      
      
  
    const assignNodeDepths = (nodes, links) => {
      const depthMap = { root: 0 };
      const visited = new Set(['root']);
      const queue = ['root'];
  
      while (queue.length > 0) {
        const current = queue.shift();
        const currentDepth = depthMap[current];
  
        links.forEach(link => {
          const neighbor = link.source === current ? link.target :
                           link.target === current ? link.source : null;
  
          if (neighbor && !visited.has(neighbor)) {
            visited.add(neighbor);
            depthMap[neighbor] = currentDepth + 1;
            queue.push(neighbor);
          }
        });
      }
  
      return depthMap;
    };
  
    // ✅ Now it's safe to use `nodes` and `links`
    const depthMap = assignNodeDepths(
      nodes.map(n => n.id),
      links.map(l => ({
        source: typeof l.source === 'object' ? l.source.id : l.source,
        target: typeof l.target === 'object' ? l.target.id : l.target
      }))
    );
  
    const [selectedNode, setSelectedNode] = useState(null);
    const [menuPos, setMenuPost] = useState({ x: 0, y: 0 });
  
    const handleNodeClick = (node, x, y) => {
      setSelectedNode(node);
      setMenuPost({ x, y });
    };
  
    return (
      <div style={{ position: 'relative' }}>
        <ForceGraph
          nodes={nodes}
          links={links}
          depthMap={depthMap}
          onNodeClick={handleNodeClick}
        />
      </div>
    );
  };
  
  export default MindMap;
  