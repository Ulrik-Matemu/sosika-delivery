const socket = io("https://sosika-backend.onrender.com");
const deliveryPersonId = localStorage.getItem("deliveryPersonId");
let orderDetails;
let pickupMarker = null;
let dropoffMarker = null;




console.log(deliveryPersonId);
socket.emit("joinDelivery", deliveryPersonId);

// Function to show notification
function showNotification(order) {
    console.log("Showing notification for order:", order);
    document.getElementById("orderNumber").textContent = order.orderId;
    document.getElementById("foodieNumber").textContent = order.phoneNumber;
    document.getElementById("orderNotification").style.display = "block";
}

// New Order Event
socket.on("newOrderAvailable", (data) => {
    console.log("New order received:", data);
});

// Accept Order


// Pickup and Dropoff Marker Elements
const pickupDiv = document.createElement("div");
pickupDiv.innerHTML = `<div style="background-color: green; color: white; padding: 5px; border-radius: 50px; font-size: 12px; text-align: center; width: max-content;">Pick Up</div>`;

const dropOffDiv = document.createElement("div");
dropOffDiv.innerHTML = `<div style="background-color: Red; color: white; padding: 5px; border-radius: 50px; font-size: 12px; text-align: center; width: max-content;">Drop</div>`;

// Add Order Markers
function addOrderMarkers(pickupLocation, dropoffLocation) {
    if (!pickupLocation || !dropoffLocation) {
        console.error("Missing pickup or dropoff location:", { pickupLocation, dropoffLocation });
        return;
    }
    removeOrderMarkers(); // Clear previous markers

    

    function parseLocationString(str) {
        const match = str.match(/\((-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)\)/);
        if (!match) return null;
    
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[3]);
        return { lat, lng };
    }
    

    console.log(parseLocationString(pickupLocation));

    const pickup = parseLocationString(pickupLocation);
    const dropoff = parseLocationString(dropoffLocation);
    // Use object properties directly
    const pickupLng = pickup.lng;
    const pickupLat = pickup.lat;
    const dropoffLng = dropoff.lng;
    const dropoffLat = dropoff.lat;

    function isValidCoord(lat, lng) {
        return typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng);
    }

    if (!isValidCoord(pickupLat, pickupLng) || !isValidCoord(dropoffLat, dropoffLng)) {
        console.error("Invalid coordinates:", { pickupLat, pickupLng, dropoffLat, dropoffLng });
        return;
    }


    // Add Pickup Marker
    pickupMarker = new mapboxgl.Marker({ element: pickupDiv })
        .setLngLat([pickupLng, pickupLat])
        .setPopup(new mapboxgl.Popup().setText("Pickup location"))
        .addTo(map);

    // Add Dropoff Marker
    dropoffMarker = new mapboxgl.Marker({ element: dropOffDiv })
        .setLngLat([dropoffLng, dropoffLat])
        .setPopup(new mapboxgl.Popup().setText("Dropoff location"))
        .addTo(map);

    // Adjust map bounds
   
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([pickupLng, pickupLat]);
    bounds.extend([dropoffLng, dropoffLat]);
    map.fitBounds(bounds, { padding: 100 });

    getRoute({ x: pickupLat, y: pickupLng }, { x: dropoffLat, y: dropoffLng });
}


function removeRoute() {
    if (map.getLayer('route')) {
        map.removeLayer('route');
    }
    if (map.getSource('route')) {
        map.removeSource('route');
    }
}

// Remove Order Markers
function removeOrderMarkers() {
    if (pickupMarker) {
        pickupMarker.remove();
        pickupMarker = null;
    }
    if (dropoffMarker) {
        dropoffMarker.remove();
        dropoffMarker = null;
    }
    removeRoute();
}

// Fetch and Display Route
function getRoute(start, end) {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.x},${start.y};${end.x},${end.y}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("API Response:", data); // Debugging log

            if (!data.routes || data.routes.length === 0) {
                throw new Error("No route found in response.");
            }

            const route = data.routes[0].geometry;
            console.log("Extracted Route Geometry:", route);

            if (!route) {
                throw new Error("Route geometry is missing.");
            }

            if (map.getSource("route")) {
                map.getSource("route").setData({
                    type: "Feature",
                    properties: {},
                    geometry: route,
                });
            } else {
                map.addSource("route", {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        properties: {},
                        geometry: route,
                    },
                });

                map.addLayer({
                    id: "route",
                    type: "line",
                    source: "route",
                    layout: { "line-join": "round", "line-cap": "round" },
                    paint: { "line-color": "#1DB954", "line-width": 5, "line-opacity": 0.8 },
                });
            }
        })
        .catch((error) => console.error("Error fetching route:", error));
}


// Decline Order
function declineOrder() {
    console.log("Order declined");
    document.getElementById("orderNotification").style.display = "none";
}

// Listen for Assigned Order
socket.on("orderAssigned", (data) => {
    console.log("New Order Assigned:", data);
    alert(`New order available: ${data.orderId}`);
});

// Listen for Order Completion
socket.on("orderCompleted", (data) => {
    console.log("Order Completed:", data);
    alert(`Order ${data.orderId} is marked as completed.`);
});

document.addEventListener("DOMContentLoaded", function () {
    let orderLocations = localStorage.getItem("orderLocations");
    orderLocations = JSON.parse(orderLocations);
    if (orderLocations?.pickup_location && orderLocations?.dropoff_location) {
        addOrderMarkers(orderLocations.pickup_location, orderLocations.dropoff_location);
        showNotification(orderLocations.orderId);
    } else {
        console.warn("No valid orderLocations found in localStorage");
    }

    
    if (orderLocations) {
        console.log("Restoring order locations from localStorage:", orderLocations);
        addOrderMarkers(orderLocations.pickup_location, orderLocations.dropoff_location);
        showNotification(orderLocations.orderId);
    }
});

// Check Order Status on Page Load
document.addEventListener("DOMContentLoaded", function () {
    let orderLocations = localStorage.getItem("orderLocations");
    orderLocations = JSON.parse(orderLocations);
    async function checkOrderStatus() {
        const savedOrder = localStorage.getItem("assignedOrder");
        const id = orderLocations.orderId;

        if (savedOrder || orderLocations) {
            let orderDetails = JSON.parse(savedOrder);

            try {
                // Fetch latest order status from backend
                console.log(orderDetails);
                console.log(orderLocations.orderId);
                const response = await fetch(`https://sosika-backend.onrender.com/api/orders/${id}`);
                const latestOrder = await response.json();
                console.log(latestOrder);

                if (latestOrder.message === "Order not found") {
                    console.log("Order not found");
                } else if (latestOrder.order_status === "completed") {
                    console.log("Order completed. Removing from localStorage.");
                    removeOrderMarkers();
                    localStorage.removeItem("assignedOrder");
                    localStorage.removeItem("pickUp");
                    localStorage.removeItem("dropOff");
                    location.reload();
                } else if (latestOrder.order_status === "in_progress") {
                    console.log("Order status changed back to 'in_progress'. Alerting delivery person.");
                    alert("Order status changed back to 'In-Progress'. Please check your assigned orders.");
                    removeOrderMarkers();
                    localStorage.removeItem("assignedOrder");
                    location.reload();
                } else if (latestOrder.order_status === "cancelled") {
                    alert("Order has been cancelled");
                    removeOrderMarkers();
                    localStorage.removeItem("orderLocations");
                    location.reload();
                } else {
                    console.log("Restoring assigned order:", orderLocations);
                    addOrderMarkers(latestOrder.pickup_location, latestOrder.dropoff_location);
                    showNotification(orderLocations);
                }
            } catch (error) {
                console.error("Error fetching order status:", error);
            }
        }
    }

    checkOrderStatus();
    setInterval(checkOrderStatus, 10000);
});





mapboxgl.accessToken = 'pk.eyJ1IjoiLS11bHJpa2siLCJhIjoiY203YzV5dHIyMGY3NjJqc2Q5MmpxNm4ycCJ9.TilyKOmKcw2ekL2PY8Xofw'; // Replace with your token

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [34.888822, -6.369028], // Default center (will update to user's location)
    zoom: 5
});

// Add a marker for the user's location
const userMarker = new mapboxgl.Marker().setLngLat([0, 0]).addTo(map);

// Function to update location
function updateLocationFirst(position) {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;

    userMarker.setLngLat([lng, lat]);
    map.setCenter([lng, lat]);
}

// Track live location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(updateLocationFirst,
        error => console.log("Geolocation error:", error),
        { enableHighAccuracy: true }
    );
} else {
    alert("Geolocation is not supported by your browser.");
}


async function updateLocation() {
    if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const DELIVERY_PERSON_ID = localStorage.getItem('deliveryPersonId'); // Ensure ID is stored

        try {
            const response = await fetch(`https://sosika-backend.onrender.com/api/deliveryPerson/update-location/${DELIVERY_PERSON_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ latitude, longitude })
            });

            const data = await response.json();
            console.log('Location updated:', data);
        } catch (error) {
            console.error('Error updating location:', error);
        }
    }, (error) => {
        console.error('Error fetching location:', error);
    });
}

// Automatically update location every 10 seconds
setInterval(updateLocation, 10000);



