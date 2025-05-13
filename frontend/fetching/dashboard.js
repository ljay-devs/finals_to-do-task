//prevent force access in dashboard without login
(function checkLogin() {
    const userId = localStorage.getItem('userid');
    if (!userId) {
        alert('You must be logged in to access the dashboard.');
        window.location.href = '/frontend/components/login_signup.html'; // Change path if needed
    }
})();



// Get logged-in user ID
const currentUserId = localStorage.getItem('userid');


// adding task
function addTask() {
  const title = document.getElementById('task-title').value.trim();
  if (!title) return;

  fetch('http://localhost:6969/add-task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, userId: currentUserId })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById('task-title').value = '';
      loadTasks();
    });
}

let showingCompleted = false;

function showPendingTasks() {
  showingCompleted = false;
  loadTasks();
}

function showCompletedTasks() {
  showingCompleted = true;
  loadTasks();
}

function loadTasks() {
  const statusToLoad = showingCompleted ? 'Completed' : 'Pending'
  fetch(`http://localhost:6969/tasks/${currentUserId}?status=${statusToLoad}`)
    .then(res => res.json())
    .then(tasks => {
      const list = document.getElementById('task-list');
      list.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
          ${task.title}
          <div>
            ${task.status === 'Pending' 
              ? `<button class="btn btn-primary btn-sm me-2" onclick="markAsComplete(${task.id})">Complete</button>` 
              : ''}
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
          </div>
        `;
        list.appendChild(li);
      });
    });
}


function markAsComplete(taskId) {
  fetch(`http://localhost:6969/task/${taskId}/complete`, {
    method: 'PUT'
  })
    .then(() => {
      // Always reload Pending tasks after completing one
      showingCompleted = false;
      loadTasks();
    });
}


function deleteTask(id) {
  fetch(`http://localhost:6969/task-delete/${id}`, {
    method: 'DELETE'
  }).then(() => loadTasks());
}

window.onload = loadTasks;



async function logout() {
    try {
        const response = await fetch('http://localhost:6969/logout', {
            method: 'POST',
            mode: 'cors', 
            headers: { 'Content-Type': 'application/json' }
        }) 
        const result = await response.json() 
        if (result.success) {
            // Clear localStorage and redirect to login page
            localStorage.removeItem('userid') 
            window.location.href = '/frontend/components/login_signup.html' 
        } else {
            alert('Log out failed. Please try again.') 
        }
    } catch (error) {
        alert('An error occurred. Please try again.') 
        console.error('Error:', error) 
    }
}