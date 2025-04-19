import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ForceGraph = ({ nodes, links, depthMap, onNodeClick }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 2025;
    const height = 1145;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clean up old graph

    const getBlueShadeByDepth = (depth) => {
      const hues = [200, 210, 220, 230, 240, 250]; // All bluish hues (HSB)
      const hue = hues[depth % hues.length];      // Cycle or pick one
      const saturation = 60 + Math.random() * 20;  // Stay vibrant
      const lightness = 55 + Math.random() * 15;   // Vary brightness
    
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };
    
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Links
    const link = svg.append("g")
      .attr("stroke", "#aaa")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    // Node Groups (circle + text together)
    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node-group")
      .call(drag(simulation))
      .on("click", (event, d) => {
        event.stopPropagation();
        onNodeClick(d, event.pageX, event.pageY);
      });

      nodeGroup.append("circle")
      .attr("r", d => 30 + d.label.length * 2)
      .attr("fill", d => {
        const depth = depthMap[d.id] ?? 2;
        return depth === 0 ? '#001F3F' : getBlueShadeByDepth(depth);
      })      
      .attr("stroke", "#222")
      .attr("stroke-width", 1.5)
      .style("filter", "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))")

    // Add wrapped text inside bubble
    nodeGroup.append("text")
      .style("fill", "white")
      .style("font-weight", d => d.id === 'root' ? '700' : '400')
      .style("font-size", "12px")
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .each(function (d) {
        const words = d.label.split(" ");
        let line = '';
        const lines = [];
        words.forEach((word) => {
          if ((line + word).length > 15) {
            lines.push(line);
            line = word + ' ';
          } else {
            line += word + ' ';
          }
        });
        lines.push(line);

        const textEl = d3.select(this);
        textEl.text(null);
        lines.forEach((l, i) => {
          textEl.append("tspan")
            .text(l)
            .attr("x", 0)
            .attr("dy", i === 0 ? 0 : "1.2em");
        });
      });

    // Tick updates
    simulation.on("tick", () => {
      nodeGroup.attr("transform", d => `translate(${d.x}, ${d.y})`);
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    });

    // Drag logic
    function drag(simulation) {
      return d3.drag()
        .on("start", event => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on("drag", event => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on("end", event => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        });
    }
  }, [nodes, links, onNodeClick]);

  return <svg ref={svgRef} width={2025} height={1145} />;
};

export default ForceGraph;
