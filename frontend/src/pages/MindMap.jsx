import React, { useState, useEffect } from 'react'; // Import useEffect
import { useLocation } from 'react-router-dom';
import ForceGraph from '../components/ForceGraph';
// Removed uuid import as backend now generates IDs

// Keep your helper function outside or import it
const assignNodeDepths = (nodes, links) => {
    const depthMap = {};
    const rootNode = nodes.find(n => n.depth === 0 || n.id === 'root'); // Find root node
    if (!rootNode) return {}; // Handle case where root isn't found

    depthMap[rootNode.id] = 0;
    const visited = new Set([rootNode.id]);
    const queue = [rootNode.id];

    // Build an adjacency map for efficient traversal
    const adj = new Map();
    links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        if (!adj.has(sourceId)) adj.set(sourceId, []);
        if (!adj.has(targetId)) adj.set(targetId, []);
        adj.get(sourceId).push(targetId);
        // If links define direction, only add one way. If structure is tree-like from root, this is fine.
        // If graph can be cyclical or undirected for depth, add the other direction too:
        adj.get(targetId).push(sourceId);
    });


    while (queue.length > 0) {
        const current = queue.shift();
        const currentDepth = depthMap[current];
        const neighbors = adj.get(current) || [];

        neighbors.forEach(neighborId => {
             if (!visited.has(neighborId)) {
                visited.add(neighborId);
                depthMap[neighborId] = currentDepth + 1;
                queue.push(neighborId);
             }
        });
    }
    // Assign depth to nodes that might not have been reached (e.g., disconnected)
    // This part might need adjustment based on how you handle disconnected nodes
    nodes.forEach(node => {
        if(!(node.id in depthMap)) {
            depthMap[node.id] = 2; // Default depth or handle differently
        }
    })
    return depthMap;
};


const MindMap = () => {
    const location = useLocation();
    const centralIdea = location.state?.centralIdea || 'Central Idea';

    // --- State Variables ---
    // Initialize with only the root node or empty, not hardcoded data
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [depthMap, setDepthMap] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);         // Error state
    const [selectedNode, setSelectedNode] = useState(null);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

    // --- Fetch Data Effect ---
    useEffect(() => {
        const fetchMindMapData = async () => {
            // Ensure centralIdea is valid before fetching
             if (!centralIdea || centralIdea === 'Central Idea') {
                setError("No valid central idea provided.");
                // Initialize with just the placeholder root node on error
                setNodes([{ id: 'root', label: centralIdea || 'Error', fx: 1013, fy: 573, depth: 0 }]);
                setLinks([]);
                setDepthMap({ root: 0 });
                setIsLoading(false);
                return; // Stop fetching if no idea
             }

            setIsLoading(true);
            setError(null);
            setNodes([]); // Clear previous nodes while loading new data
            setLinks([]);
            setDepthMap({});

            try {
                // **API Call to Backend**
                const response = await fetch('http://localhost:8000/api/generate-ideas/', { // Correct URL for Django backend
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ centralIdea: centralIdea }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` })); // Try to parse error, provide fallback
                    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                }

                const data = await response.json(); // Expect { nodes: [...], links: [...] } from Django

                // --- Update State with Fetched Data ---
                if (data.nodes && data.links) {
                    setNodes(data.nodes);
                    setLinks(data.links);
                    // Recalculate depths AFTER nodes/links are set from fetched data
                    const newDepthMap = assignNodeDepths(data.nodes, data.links);
                    setDepthMap(newDepthMap);
                } else {
                     throw new Error("Received invalid data format from server.");
                }

            } catch (err) {
                console.error("Failed to fetch mind map data:", err);
                setError(err.message || "Could not fetch ideas. Please try again.");
                 // Set only the root node on error
                setNodes([{ id: 'root', label: centralIdea, fx: 1013, fy: 573, depth: 0 }]);
                setLinks([]);
                setDepthMap({ root: 0 });
            } finally {
                setIsLoading(false); // Stop loading indicator
            }
        };

        fetchMindMapData(); // Call the fetch function

        // Dependency array: Re-run effect if centralIdea changes
    }, [centralIdea]); // Run when centralIdea from location.state changes


    // --- Event Handlers ---
    const handleNodeClick = (node, x, y) => {
        console.log("Node clicked:", node);
        setSelectedNode(node);
        setMenuPos({ x, y });
        // TODO: Implement context menu logic
    };

    // --- Render Logic ---
    if (isLoading) {
        return <div className="loading-message">Generating ideas for "{centralIdea}"... Please wait.</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    // Ensure nodes isn't empty before rendering graph
    if (nodes.length === 0) {
         return <div className="loading-message">No data to display.</div>;
    }

    return (
        <div style={{ position: 'relative' }}>
            <ForceGraph
                nodes={nodes}
                links={links}
                depthMap={depthMap} // Pass the calculated depthMap
                onNodeClick={handleNodeClick}
            />
            {/* Potential future context menu */}
        </div>
    );
};

export default MindMap;