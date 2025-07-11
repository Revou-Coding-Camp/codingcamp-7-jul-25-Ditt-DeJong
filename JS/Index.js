    let tasks = [];
    let currentFilter = 'all';

    // DOM Elements
    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const tasksTableBody = document.getElementById('tasksTableBody');
    const filterBtn = document.getElementById('filterBtn');
    const filterDropdown = document.getElementById('filterDropdown');
    const deleteAllBtn = document.getElementById('deleteAllBtn');

    // Event Listeners
    todoForm.addEventListener('submit', addTask);
    filterBtn.addEventListener('click', toggleFilterDropdown);
    deleteAllBtn.addEventListener('click', deleteAllTasks);

    // Filter option event listeners
    document.querySelectorAll('.filter-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const filter = e.target.getAttribute('data-filter');
        setFilter(filter);
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('filterDropdown');
      if (!filterBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });

    // Add Task Function
    function addTask(e) {
      e.preventDefault();
      
      const task = {
        id: Date.now(),
        text: taskInput.value.trim(),
        dueDate: dateInput.value,
        completed: false
      };

      tasks.push(task);
      taskInput.value = '';
      dateInput.value = '';
      
      renderTasks();
    }

    // Toggle Filter Dropdown
    function toggleFilterDropdown() {
      const dropdown = document.getElementById('filterDropdown');
      if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
      } else {
        dropdown.style.display = 'none';
      }
    }

    // Set Filter
    function setFilter(filter) {
      currentFilter = filter;
      document.getElementById('filterDropdown').style.display = 'none';
      
      // Update filter button text
      filterBtn.textContent = `Filter (${filter.charAt(0).toUpperCase() + filter.slice(1)})`;
      
      renderTasks();
    }

    // Delete All Tasks
    function deleteAllTasks() {
      if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        renderTasks();
      }
    }

    // Toggle Task Completion
    function toggleTask(id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        renderTasks();
      }
    }

    // Delete Single Task
    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
    }

    // Render Tasks
    function renderTasks() {
      // Filter tasks based on current filter
      let filteredTasks = tasks;
      
      if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
      } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
      }

      // Clear table body
      tasksTableBody.innerHTML = '';

      if (filteredTasks.length === 0) {
        tasksTableBody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center text-[#b0bbd9] py-8 select-none">No task found</td>
          </tr>
        `;
        return;
      }

      // Render filtered tasks
      filteredTasks.forEach(task => {
        const row = document.createElement('tr');
        row.className = `border-b border-[#2a3571] hover:bg-[#1c2445] transition-colors ${task.completed ? 'opacity-60' : ''}`;
        
        row.innerHTML = `
          <td class="px-5 py-3">
            <span class="${task.completed ? 'line-through text-[#6a76bd]' : ''}">${task.text}</span>
          </td>
          <td class="px-5 py-3">${formatDate(task.dueDate)}</td>
          <td class="px-5 py-3">
            <span class="px-2 py-1 rounded-full text-xs font-medium ${
              task.completed 
                ? 'bg-green-900 text-green-300' 
                : 'bg-yellow-900 text-yellow-300'
            }">
              ${task.completed ? 'Completed' : 'Pending'}
            </span>
          </td>
          <td class="px-5 py-3">
            <button onclick="toggleTask(${task.id})" 
                    class="mr-2 px-3 py-1 rounded text-xs font-medium transition-colors ${
                      task.completed 
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }">
              ${task.completed ? 'Undo' : 'Done'}
            </button>
            <button onclick="deleteTask(${task.id})" 
                    class="px-3 py-1 rounded text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors">
              Delete
            </button>
          </td>
        `;
        
        tasksTableBody.appendChild(row);
      });
    }

    // Format Date
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }