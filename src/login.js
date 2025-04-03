

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            fullName: document.getElementById('name').value,
            password: document.getElementById('password').value
        };

        fetch('https://sosika-backend.onrender.com/api/deliveryPerson/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Delivery person login successful") {
                alert('Login successful!');
                localStorage.setItem('deliveryPersonName', data.deliveryPersonName);
                localStorage.setItem('deliveryPersonId', data.deliveryPersonId);
                localStorage.setItem('deliveryPersonLatitude', data.deliveryPersonLatitude);
                localStorage.setItem('deliveryPersonLongitude', data.deliveryPersonLongitude);
                window.location.href = 'home.html';
            } else {
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during login.');
        });
    });
});