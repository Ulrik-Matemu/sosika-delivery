document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector("form");

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Capture form values
        const fullName = document.getElementById("name").value.trim();
        const phoneNumber = document.getElementById("phone").value.trim();
        const collegeId = document.getElementById("college").value;
        const transportType = document.getElementById("transport-type").value;
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();
        const latitude = document.getElementById("latitude").value.trim();
        const longitude = document.getElementById("longitude").value.trim();

        // Validate password match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Validate location
        if (!latitude || !longitude) {
            alert("Please get your location before registering.");
            return;
        }

        // Prepare data for backend
        const userData = {
            fullName: fullName,
            phoneNumber: phoneNumber,
            collegeId: parseInt(collegeId),
            transportType: transportType,
            password: password,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        };

        try {
            const response = await fetch("http://localhost:3001/api/deliveryPerson", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Registration successful!");
                window.location.href = "index.html"; // Redirect after success
            } else {
                alert(result.error || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Network error. Please try again.");
        }
    });
});
