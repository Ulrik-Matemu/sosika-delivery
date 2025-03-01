document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleButton");
    const deliveryPersonId = localStorage.getItem('deliveryPersonId'); // Replace with actual logged-in delivery person's ID

    toggleButton.addEventListener("click", async function () {
        try {
            const response = await fetch(`https://sosika-backend.onrender.com/api/deliveryPerson/${deliveryPersonId}/toggle-active`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            if (response.ok) {
                toggleButton.textContent = data.is_active ? "Go Offline" : "Go Online";
                toggleButton.classList.toggle("active", data.is_active);
                console.log("Updated status:", data.is_active);
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Failed to toggle status:", error);
        }
    });
});

