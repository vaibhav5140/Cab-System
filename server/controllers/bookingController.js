
const Booking = require('../models/Booking');
const Cab = require('../models/Cab');




exports.getAllAvailableCabs = async (req, res) => {
    const { userEmail, source, destination } = req.body;
  
    try {
    
      const pathchosen=calculateShortestTimeWithRoute(source,destination);
    
      const travelTime =pathchosen.distance 
      const currentTime = new Date();
  
      const endTime = new Date(currentTime.getTime() + travelTime * 60000); 
      const availableCabs = await findAvailableCab(currentTime, endTime);
  
      res.json( {travelTime: travelTime, 
      availableCabs: availableCabs,
      path:pathchosen.timeToReachEachNode,
    });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.bookCab = async (req, res) => {
    const { userEmail, source, destination,travelTime ,timeToReachEachNode} = req.body;

    const { cabId } = req.params;
    
    try {
        
    
        const cab = await Cab.findById(cabId); 
        if (!cab) {
            return res.status(404).json({ message: 'No available cabs' });
        }
        
        const cost = travelTime * cab.pricePerMinute;
        const currentTime = new Date();
        const startTime=new Date();
        
        const endTime = new Date(currentTime.getTime() + travelTime * 60000);
        const booking = new Booking({
            userEmail,
            source,
            destination,
            cabId: cab._id,
            travelTime,
            startTime,
            endTime,
            cost,
           
        });

        const newBooking = await booking.save();


        //await sendBookingConfirmationEmail(userEmail, newBooking);
        res.json({booking:newBooking,
            path:timeToReachEachNode
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


function calculateShortestTimeWithRoute(source, destination) {
    const graph = {
        A: { B: 5, C: 7 },
        B: { A: 5, D: 15, E: 20 },
        C: { A: 7, D: 5, E: 35 },
        D: { B: 15, C: 5, F: 20 },
        E: { B: 20, C: 35, F: 10 },
        F: { D: 20, E: 10 }
    };

    function dijkstra(start, end) {
        const distances = {};
        const paths = {};
        const pq = [];
        const visited = new Set();

        for (const vertex in graph) {
            distances[vertex] = Infinity;
        }

        distances[start] = 0;
        pq.push({ vertex: start, distance: 0, path: [start] });

        while (pq.length > 0) {
            pq.sort((a, b) => a.distance - b.distance);
            const { vertex, distance, path } = pq.shift();

            if (vertex === end) {
                return { distance, path: path.join('-'), distances };
            }

            if (visited.has(vertex)) continue;
            visited.add(vertex);

            for (const neighbor in graph[vertex]) {
                const newDistance = distance + graph[vertex][neighbor];
                const newPath = [...path, neighbor];
                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    paths[neighbor] = newPath;
                    pq.push({ vertex: neighbor, distance: newDistance, path: newPath });
                }
            }
        }

        return { distance: -1, path: '', distances };
    }

    const { distance, path, distances } = dijkstra(source, destination);
    const pathNodes = path.split('-');
    let timeToReachEachNode = '';
    let cumulativeTime = 0;
    for (let i = 0; i < pathNodes.length - 1; i++) {
        const currentNode = pathNodes[i];
        const nextNode = pathNodes[i + 1];
        cumulativeTime += graph[currentNode][nextNode];
        timeToReachEachNode += `${currentNode}-${nextNode}:${cumulativeTime} `;
        if (i !== pathNodes.length - 1) {
            cumulativeTime -= graph[pathNodes[i]][pathNodes[i + 1]];
        }
    }

    return { distance, path, timeToReachEachNode };
}

  
  async function findAvailableCab(startTime, endTime) {
    try {
        const bookedCabs = await Booking.find({
            $or: [
                { startTime: { $lte: startTime }, endTime: { $gte: startTime } },
                { startTime: { $lte: endTime }, endTime: { $gte: endTime } }
            ]
        }).distinct('cabId');

        const availableCabs = await Cab.find({ _id: { $nin: bookedCabs } });

        return availableCabs;
    } catch (err) {
        console.error(err);
        return [];
    }
}

