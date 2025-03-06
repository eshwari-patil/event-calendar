
document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const myModal = new bootstrap.Modal(document.getElementById('form'));
  const dangerAlert = document.getElementById('danger-alert');
  const close = document.querySelector('.btn-close');


  // Retrieve events from localStorage or use defaults
    const myEvents = JSON.parse(localStorage.getItem('events')) || [
        {
            id: uuidv4(),
            title: 'Edit Me',
            start: '2023-04-11',
            backgroundColor: 'red',
            allDay: false,
            editable: false,
        },
        {
            id: uuidv4(),
            title: 'Delete me',
            start: '2023-04-17',
            end: '2023-04-21',
            allDay: false,
            editable: false,
        },
    ];

    const calendar = new FullCalendar.Calendar(calendarEl, {
        eventRender: handleEventContextMenu,
        customButtons: {
            customButton: {
                text: 'Add Event',
                click: function () {
                    myModal.show();
                    const modalTitle = document.getElementById('modal-title');
                    const submitButton = document.getElementById('submit-button');
                    modalTitle.innerHTML = 'Add Event';
                    submitButton.innerHTML = 'Add Event';
                    submitButton.classList.remove('btn-primary');
                    submitButton.classList.add('btn-success');

                    close.addEventListener('click', () => {
                        myModal.hide();
                    });
                }
            }
        },
        header: {
            center: 'customButton',
            right: 'today, prev,next '
        },
        plugins: ['dayGrid', 'interaction'],
        allDay: false,
        editable: true,
        selectable: true,
        unselectAuto: false,
        displayEventTime: false,
        events: myEvents,
        eventRender: function (info) {
            info.el.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                let existingMenu = document.querySelector('.context-menu');
                existingMenu && existingMenu.remove();
                let menu = document.createElement('div');
                menu.className = 'context-menu';
                menu.innerHTML = `
                    <ul>
                        <li><i class="fas fa-edit"></i>Edit</li>
                        <li><i class="fas fa-trash-alt"></i>Delete</li>
                    </ul>
                `;

                const eventIndex = myEvents.findIndex(event => event.id === info.event.id);

                document.body.appendChild(menu);
                menu.style.top = e.pageY + 'px';
                menu.style.left = e.pageX + 'px';

              // Edit context menu
                menu.querySelector('li:first-child').addEventListener('click', function () {
                    menu.remove();
                    const editModal = new bootstrap.Modal(document.getElementById('form'));
                    const modalTitle = document.getElementById('modal-title');
                    const titleInput = document.getElementById('event-title');
                    const startDateInput = document.getElementById('start-date');
                    const endDateInput = document.getElementById('end-date');
                    const colorInput = document.getElementById('event-color');
                    const submitButton = document.getElementById('submit-button');
                    const cancelButton = document.getElementById('cancel-button');
                    modalTitle.innerHTML = 'Edit Event';
                    titleInput.value = info.event.title;
                    startDateInput.value = moment(info.event.start).format('YYYY-MM-DD');
                    endDateInput.value = moment(info.event.end, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD');
                    colorInput.value = info.event.backgroundColor;
                    submitButton.innerHTML = 'Save Changes';

                    editModal.show();
                    submitButton.classList.remove('btn-success');
                    submitButton.classList.add('btn-primary');

                  // Save changes button
                    submitButton.addEventListener('click', function () {
                        const updatedEvent = {
                            id: info.event.id,
                            title: titleInput.value,
                            start: startDateInput.value,
                            end: moment(endDateInput.value, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD'),
                            backgroundColor: colorInput.value
                        };
                        if (updatedEvent.end <= updatedEvent.start) {
                            dangerAlert.style.display = 'block';
                            return;
                        }
                        const eventIndex = myEvents.findIndex(event => event.id === updatedEvent.id);
                        myEvents.splice(eventIndex, 1, updatedEvent);
                        localStorage.setItem('events', JSON.stringify(myEvents));
                        info.event.setProp('title', updatedEvent.title);
                        info.event.setStart(updatedEvent.start);
                        info.event.setEnd(updatedEvent.end);
                        info.event.setProp('backgroundColor', updatedEvent.backgroundColor);
                        editModal.hide();
                    });
                });

              // Delete menu
                menu.querySelector('li:last-child').addEventListener('click', function () {
                    const deleteModal = new bootstrap.Modal(document.getElementById('delete-modal'));
                    const modalBody = document.getElementById('delete-modal-body');
                    modalBody.innerHTML = `Are you sure you want to delete "<b>${info.event.title}</b>"?`;
                    deleteModal.show();

                    const deleteButton = document.getElementById('delete-button');
                    deleteButton.addEventListener('click', function () {
                        myEvents.splice(eventIndex, 1);
                        localStorage.setItem('events', JSON.stringify(myEvents));
                        info.event.remove();
                        deleteModal.hide();
                        menu.remove();
                    });

                    const cancelModal = document.getElementById('cancel-button');
                    cancelModal.addEventListener('click', function () {
                        deleteModal.hide();
                    });
                });

                document.addEventListener('click', function () {
                    menu.remove();
                });
            });
        },
        eventDrop: function (info) {
            const eventIndex = myEvents.findIndex(event => event.id === info.event.id);
            const updatedEvent = {
                ...myEvents[eventIndex],
                id: info.event.id,
                title: info.event.title,
                start: moment(info.event.start).format('YYYY-MM-DD'),
                end: moment(info.event.end).format('YYYY-MM-DD'),
                backgroundColor: info.event.backgroundColor
            };
            myEvents.splice(eventIndex, 1, updatedEvent);
            localStorage.setItem('events', JSON.stringify(myEvents));
        }
    });

  // Handle select event (when user clicks on a date to add an event)
    calendar.on('select', function (info) {
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        startDateInput.value = info.startStr;
        endDateInput.value = moment(info.endStr, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD');
        if (startDateInput.value === endDateInput.value) {
            endDateInput.value = '';
        }
        myModal.show();
    }); 

  // Render calendar
    calendar.render();

  // Form submission handling
    const form = document.getElementById('myForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('event-title').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const color = document.getElementById('event-color').value;

        const newEvent = {
            id: uuidv4(),
            title: title,
            start: startDate,
            end: moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD'),
            backgroundColor: color
        };

        myEvents.push(newEvent);
        calendar.addEvent(newEvent);
        localStorage.setItem('events', JSON.stringify(myEvents));
        
        myModal.hide();
        form.reset();
    });

  // Hide danger alert on modal close
    myModal._element.addEventListener('hide.bs.modal', function () {
        dangerAlert.style.display = 'none';
        form.reset();
    });
    
    let isAuthenticated = false;

    // Retrieve events from localStorage or use defaults
    // Your existing event handling code...

    // Function to handle event context menu based on authentication
    function handleEventContextMenu(info) {
        info.el.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            if (!isAuthenticated) return; // Only show context menu if authenticated

            // Existing context menu logic...
        });
    }

    // Modify other event handling functions based on authentication needs

    // Example for handling login modal submit (assuming a Bootstrap modal)
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Perform Ajax request to validate credentials
        // Example: fetch('login.php', { method: 'POST', body: JSON.stringify({ username, password }) })
        // Handle success or failure based on server response
        // Upon successful login:
        let isAuthenticated = false; // Flag to track user authentication status

    // Your calendar setup and event handling logic goes here...

    // Example function to handle login form submission (using fetch or XMLHttpRequest)
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    });

        // Example: Perform AJAX request to login.php for authentication
        fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                isAuthenticated = true;
                loginModal.hide();
                // Update UI to show authenticated user info, if needed
            } else {
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => console.error('Error logging in:', error));
    });

    // Example function to handle logout (clear session and reset UI)
    const logoutLink = document.getElementById('logout-link');
    logoutLink.addEventListener('click', function (e) {
        e.preventDefault();
        fetch('logout.php')
        .then(response => {
            if (response.redirected) {
                isAuthenticated = false;
                location.reload(); // Reload the page after logout
            }
        })
        .catch(error => console.error('Error logging out:', error));
    
    });
});
