// Function to toggle display of different sections
document.addEventListener("DOMContentLoaded", () => {
    const daysTrainedElement = document.getElementById("daysTrained");
    const incrementButton = document.getElementById("incrementButton");

    let daysTrained = localStorage.getItem("daysTrained") || 0;
    let lastIncrementDate = localStorage.getItem("lastIncrementDate") || null;

    daysTrainedElement.innerText = daysTrained;

    incrementButton.addEventListener("click", () => {
        const today = new Date().toISOString().split("T")[0];
        
        if (lastIncrementDate === today) {
            alert("You can only increment the counter once per day.");
            return;
        }

        daysTrained++;
        daysTrainedElement.innerText = daysTrained;
        localStorage.setItem("daysTrained", daysTrained);
        localStorage.setItem("lastIncrementDate", today);
    });
});

function toggleDisplay(event, targetId) {
    event.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        if (targetElement.classList.contains('hidden')) {
            fetch(`http://localhost:3000/${targetId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (targetId === 'scheduleData') {
                        populateScheduleTable(data);
                    } else if (targetId === 'membershipData') {
                        populateMembershipTable(data);
                    } else if (targetId === 'workoutData') {
                        populateWorkoutTable(data);
                    }
                    targetElement.classList.remove('hidden');
                })
                .catch(error => {
                    console.error(`Error fetching ${targetId} data:`, error);
                });
        } else {
            targetElement.classList.add('hidden');
        }
    } else {
        console.error(`Element with ID ${targetId} not found.`);
    }
}

// Function to populate the schedule table
function populateScheduleTable(scheduleData) {
    const tableBodyElement = document.getElementById('scheduleTableBody');
    tableBodyElement.innerHTML = '';
    scheduleData.forEach(item => {
        let row = `<tr>
            <td>${item.title}</td>
            <td>${item.date}</td>
            <td>${item.time}</td>
        </tr>`;
        tableBodyElement.innerHTML += row;
    });
}

// Function to populate the membership table
function populateMembershipTable(membershipData) {
    const tableBodyElement = document.getElementById('membershipTableBody');
    tableBodyElement.innerHTML = '';
    membershipData.forEach(item => {
        let row = `<tr>
            <td>${item.id}</td>
            <td>${item.plan}</td>
            <td>${item.rate}</td>
            <td>${item.expires}</td>
        </tr>`;
        tableBodyElement.innerHTML += row;
    });
}

// Function to populate the workout table
function populateWorkoutTable(workoutData) {
    const tableBodyElement = document.getElementById('workoutTableBody');
    tableBodyElement.innerHTML = '';
    workoutData.forEach(item => {
        let row = `
                <h3>${item.title}</h3>
                <p>Duration: ${item.duration} minutes</p>
                <p>Intensity: ${item.intensity}</p>
                <p>Type: ${item.type}</p>
                <p>Description: ${item.description}</p>
                <p>Exercises:</p>
                <ul>
                    ${item.exercises.map(exercise => `<li>${exercise}</li>`).join('')}
                </ul>
            `;
        tableBodyElement.innerHTML += row;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:3000/schedule'; // Assuming json-server runs on port 3000

    // Function to fetch schedule data from json-server
    async function fetchSchedule() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            displaySchedule(data);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    }

    // Function to display schedule on the page
    function displaySchedule(schedule) {
        const scheduleSection = document.getElementById('schedule');
        scheduleSection.innerHTML = '';

        schedule.forEach(workout => {
            const workoutElement = document.createElement('div');
            workoutElement.classList.add('workout');
            workoutElement.innerHTML = `
                <h3>${workout.title}</h3>
                <p>Date: ${workout.date}</p>
                <p>Time: ${workout.time}</p>
                <button class="attendance-btn" data-id="${workout.id}">Mark Attendance</button>
            `;
            scheduleSection.appendChild(workoutElement);
        });

        // Attach event listeners after displaying schedule
        attachEventListeners();
    }

    // Function to attach event listeners to interactive elements
    function attachEventListeners() {
        const attendanceButtons = document.querySelectorAll('.attendance-btn');

        attendanceButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const workoutId = button.getAttribute('data-id');
                try {
                    // Simulate updating attendance status (PUT request to json-server)
                    await fetch(`${apiUrl}/${workoutId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ attended: true })
                    });
                    // Refresh schedule after marking attendance
                    fetchSchedule();
                } catch (error) {
                    console.error('Error marking attendance:', error);
                }
            });
        });
    }

    // Initial fetch of schedule when the page loads
    fetchSchedule();

    // Add event listener for adding a new session
    const addSessionForm = document.getElementById('addSessionForm');
    addSessionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const sessionTitle = document.getElementById('sessionTitle').value;
        const sessionDate = document.getElementById('sessionDate').value;
        const sessionTime = document.getElementById('sessionTime').value;

        const sessionData = {
            title: sessionTitle,
            date: sessionDate,
            time: sessionTime
        };

        fetch('http://localhost:3000/new_sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('sessionTitle').value = '';
            document.getElementById('sessionDate').value = '';
            document.getElementById('sessionTime').value = '';
            const tableBodyElement = document.getElementById('scheduleTableBody');
            let newRow = `<tr>
                <td>${data.title}</td>
                <td>${data.date}</td>
                <td>${data.time}</td>
            </tr>`;
            tableBodyElement.innerHTML += newRow;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});
