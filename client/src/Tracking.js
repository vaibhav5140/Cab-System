
import { useState, useEffect, useRef } from 'react';

const Tracking = ({ path }) => {

  const uniquePathArray = path
    .split(' ')
    .filter(item => item !== '')
    .map(item => {
      const [location, time] = item.split(':');
      return { location, time: parseInt(time) };
    });

 
  const totalTravelTime = uniquePathArray.reduce((acc, curr) => acc + curr.time, 0);

  const scalingFactor = totalTravelTime > 0 ? 450 / totalTravelTime : 0;

  let currentX = 25;


  const [redDotX, setRedDotX] = useState(25);


  const svgRef = useRef(null);

  
  const totalEdgeLength = uniquePathArray.reduce((acc, curr) => acc + curr.time * scalingFactor, 0);

  useEffect(() => {
    let currentIndex = 0;
    let animationInterval;
    const svgWidth = totalEdgeLength+30; // Set SVG width to total length of edges + padding

   
    if (svgRef.current) {
      svgRef.current.setAttribute('width', svgWidth);
    }

    const moveRedDot = () => {
      if (currentIndex >= uniquePathArray.length) return;

      const nextNode = uniquePathArray[currentIndex];
      const nextNodeX = currentX + nextNode.time * scalingFactor;
// Calculate total duration of animation in milliseconds
const totalDuration = totalTravelTime * 60000;

// Calculate animation interval based on total duration and total edge length
const Interval = totalDuration / totalEdgeLength;

      animationInterval = setInterval(() => {
        setRedDotX(prevX => {
          if (prevX >= nextNodeX) {
            currentIndex++;
            if (currentIndex >= uniquePathArray.length) {
              clearInterval(animationInterval);
              return prevX;
            }
            currentX = nextNodeX; 
            return prevX;
          }
          return prevX + 1;
        });
      }, Interval );

      currentX = nextNodeX; 
    };

    moveRedDot();

    return () => clearInterval(animationInterval);
  }, [scalingFactor, totalEdgeLength, uniquePathArray]);

  return (
    <svg ref={svgRef} height="100">
      {/* Draw edges and nodes */}
      {uniquePathArray.map((item, index) => {
        const [source, destination] = item.location.split('-');
        const x1 = currentX;
        const x2 = currentX + item.time * scalingFactor;
        const y = 50;
        currentX = x2;
        return (
          <g key={index}>
            {/* Draw edge */}
            <line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="black"
              strokeWidth="2"
            />
            {/* Draw source node */}
            <circle cx={x1} cy={y} r={5} fill="blue" />
            <text x={x1} y={y - 10} textAnchor="middle">{source}</text>
            {/* Draw destination node */}
            <circle cx={x2} cy={y} r={5} fill="blue" />
            <text x={x2} y={y - 10} textAnchor="middle">{destination}</text>
          </g>
        );
      })}
      {/* Draw red dot */}
      <circle cx={redDotX} cy={50} r={5} fill="red" />
    </svg>
  );
};

export default Tracking;
