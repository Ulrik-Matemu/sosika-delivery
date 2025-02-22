const deliveryPersonId = localStorage.getItem('deliveryPersonId');
const API_URL =  `http://localhost:3000/api/deliveryPerson/${deliveryPersonId}`;

const fetchDeliveryPersonDetails = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fectch delivery person details");
        }

        const deliveryPerson = await response.json();
        console.log(deliveryPerson);

        document.getElementById('name').value = deliveryPerson.full_name;
        document.getElementById('phone').value = deliveryPerson.phone_number;
        document.getElementById('email').value = deliveryPerson.email;
      

        document.getElementById("loading-text").style.display = "none";
        document.querySelector(".login-container").classList.remove("hidden");

    } catch (error) {
        document.getElementById("loading-text").textContent = "Error loading profile info.";
        console.error(error);
    }
}


document.getElementById("deliveryPerson-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const updatedData = {};
    const fields = ["name", "phone", "email"];

    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input.value.trim() !== "") {
            updatedData[field] = input.value.trim();
        }
    });

    if (Object.keys(updatedData).length === 0) {
        document.getElementById("message").textContent = "No changes to update.";
        document.getElementById("message").style.color = "red";
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("message").textContent = "Profile updated successfully!";
            document.getElementById("message").style.color = "green";
        } else {
            throw new Error(result.error || "Failed to update profile");
        }
    } catch (error) {
        document.getElementById("message").textContent = error.message;
        document.getElementById("message").style.color = "red";
    }
});

fetchDeliveryPersonDetails();