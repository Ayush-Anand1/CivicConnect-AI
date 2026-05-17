/* LOCATION ELEMENTS */

const locationBtn =
    document.getElementById('locationBtn');

const locationText =
    document.getElementById('locationText');

/* FORM */

const complaintForm =
    document.getElementById('complaintForm');

/* DASHBOARD */

const complaintContainer =
    document.getElementById('complaintContainer');

/* LOCATION VARIABLES */

let userLatitude = "";
let userLongitude = "";

/* GET LOCATION */

locationBtn.addEventListener('click', () => {

    if (navigator.geolocation) {

        locationText.innerHTML =
            "Fetching location...";

        navigator.geolocation.getCurrentPosition(

            showPosition,

            showError

        );

    } else {

        locationText.innerHTML =
            "Geolocation is not supported.";

    }

});

/* SHOW POSITION */

function showPosition(position) {

    userLatitude =
        position.coords.latitude;

    userLongitude =
        position.coords.longitude;

    locationText.innerHTML = `
        📍 Latitude: ${userLatitude}
        <br>
        📍 Longitude: ${userLongitude}
    `;
}

/* LOCATION ERRORS */

function showError(error) {

    switch(error.code) {

        case error.PERMISSION_DENIED:

            locationText.innerHTML =
                "User denied location access.";

            break;

        case error.POSITION_UNAVAILABLE:

            locationText.innerHTML =
                "Location unavailable.";

            break;

        case error.TIMEOUT:

            locationText.innerHTML =
                "Location request timed out.";

            break;

        default:

            locationText.innerHTML =
                "Unknown error occurred.";

    }

}

/* FORM SUBMIT */

complaintForm.addEventListener(
    'submit',

    function(event) {

        event.preventDefault();

        /* GET FORM VALUES */

        const name =
            document.getElementById('name').value;

        const email =
            document.getElementById('email').value;

        const issueType =
            document.getElementById('issueType').value;

        const description =
            document.getElementById('description').value;

        /* CREATE OBJECT */

        const complaint = {

            id: Date.now(),

            name,

            email,

            issueType,

            description,

            latitude: userLatitude,

            longitude: userLongitude,

            status: "Pending"
        };

        /* GET OLD DATA */

        let complaints =
            JSON.parse(
                localStorage.getItem('complaints')
            ) || [];

        /* PUSH NEW DATA */

        complaints.push(complaint);

        /* SAVE */

        localStorage.setItem(
            'complaints',

            JSON.stringify(complaints)
        );

        /* SHOW */

        displayComplaints();

        generateChart();

        /* RESET FORM */

        complaintForm.reset();

        locationText.innerHTML =
            "Location not fetched yet";

    }
);

/* DISPLAY COMPLAINTS */

function displayComplaints() {

    let complaints =
        JSON.parse(
            localStorage.getItem('complaints')
        ) || [];

    complaintContainer.innerHTML = "";

    complaints.forEach((complaint) => {

        complaintContainer.innerHTML += `

    <div class="complaint-card">

        <h3>${complaint.issueType}</h3>

        <p>
            <strong>Name:</strong>
            ${complaint.name}
        </p>

        <p>
            <strong>Email:</strong>
            ${complaint.email}
        </p>

        <p>
            <strong>Description:</strong>
            ${complaint.description}
        </p>

        <div class="status">
            ${complaint.status}
        </div>

        <p class="location-text">
            📍 ${complaint.latitude},
            ${complaint.longitude}
        </p>

        <button
            class="delete-btn"
            onclick="deleteComplaint(${complaint.id})"
        >
            Delete Complaint
        </button>

    </div>
`;
    });

}

/* LOAD SAVED DATA */

displayComplaints();

generateChart();
/* DELETE COMPLAINT */

function deleteComplaint(id) {

    let complaints =
        JSON.parse(
            localStorage.getItem('complaints')
        ) || [];

    complaints = complaints.filter(

        complaint => complaint.id !== id

    );

    localStorage.setItem(

        'complaints',

        JSON.stringify(complaints)

    );

    displayComplaints();
}
/* GENERATE ANALYTICS CHART */

function generateChart() {

    const complaints =
        JSON.parse(
            localStorage.getItem('complaints')
        ) || [];

    /* COUNT ISSUES */

    let garbage = 0;
    let roads = 0;
    let water = 0;
    let pollution = 0;
    let parking = 0;

    complaints.forEach((complaint) => {

        switch(complaint.issueType) {

            case "Garbage Dump":
                garbage++;
                break;

            case "Road Damage":
                roads++;
                break;

            case "Water Leakage":
                water++;
                break;

            case "Air Pollution":
                pollution++;
                break;

            case "Illegal Parking":
                parking++;
                break;
        }

    });

    /* GET CANVAS */
    const existingChart =
    Chart.getChart("analyticsChart");

    if (existingChart) {

        existingChart.destroy();
    }
    const ctx =
        document.getElementById(
            'analyticsChart'
        );

    /* CREATE CHART */

    new Chart(ctx, {

        type: 'bar',

        data: {

            labels: [

                'Garbage',
                'Road Damage',
                'Water Leakage',
                'Pollution',
                'Parking'

            ],

            datasets: [{

                label: 'Total Complaints',

                data: [

                    garbage,
                    roads,
                    water,
                    pollution,
                    parking

                ],

                backgroundColor: [

                    '#0d6efd',
                    '#198754',
                    '#dc3545',
                    '#ffc107',
                    '#6f42c1'

                ],

                borderRadius: 8
            }]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false
                }
            },

            scales: {

                y: {

                    beginAtZero: true
                }
            }
        }
    });
}
/* DARK MODE */

const darkModeToggle =
    document.getElementById(
        'darkModeToggle'
    );

darkModeToggle.addEventListener(

    'click',

    () => {

        document.body.classList.toggle(
            'dark-mode'
        );

    }
);

/* SEARCH SYSTEM */

const searchInput =
    document.getElementById(
        'searchInput'
    );

searchInput.addEventListener(

    'keyup',

    () => {

        const searchValue =
            searchInput.value.toLowerCase();

        const cards =
            document.querySelectorAll(
                '.complaint-card'
            );

        cards.forEach((card) => {

            const text =
                card.innerText.toLowerCase();

            if (text.includes(searchValue)) {

                card.style.display = "block";

            } else {

                card.style.display = "none";
            }

        });

    }
);