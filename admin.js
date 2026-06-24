const adminPanel = document.getElementById('adminPanel');

function createApplicationCard(application) {
  const wrapper = document.createElement('article');
  wrapper.className = 'admin-card';

  wrapper.innerHTML = `
    <div class="admin-card-header">
      <div>
        <h3>${application.fullName}</h3>
        <p class="muted-text">${application.email}</p>
      </div>
      <span class="status-pill ${application.status}">${application.status.toUpperCase()}</span>
    </div>
    <div class="admin-card-body">
      <p><strong>Domain:</strong> ${application.domain}</p>
      <p><strong>GitHub:</strong> <a href="${application.github}" target="_blank">${application.github}</a></p>
      <p><strong>LinkedIn:</strong> <a href="${application.linkedin}" target="_blank">${application.linkedin}</a></p>
      <p><strong>LeetCode:</strong> <a href="${application.leetcode}" target="_blank">${application.leetcode}</a></p>
      <p><strong>Resume:</strong> <a href="${application.resume}" target="_blank">Download</a></p>
      <p>${application.message}</p>
    </div>
    <div class="admin-card-footer">
      <button class="btn btn-secondary approve-btn" data-id="${application.id}" ${application.status === 'approved' ? 'disabled' : ''}>Approve Application</button>
    </div>
  `;

  return wrapper;
}

async function loadApplications() {
  try {
    const response = await fetch('/api/applications');
    const applications = await response.json();

    adminPanel.innerHTML = '';
    if (!applications.length) {
      adminPanel.innerHTML = '<p class="empty-state">No applications found yet.</p>';
      return;
    }

    applications.forEach((application) => {
      const card = createApplicationCard(application);
      adminPanel.appendChild(card);
    });

    document.querySelectorAll('.approve-btn').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const id = event.currentTarget.dataset.id;
        event.currentTarget.disabled = true;
        const result = await approveApplication(id);
        if (result.success) {
          loadApplications();
        } else {
          event.currentTarget.disabled = false;
          alert(result.message || 'Unable to approve application.');
        }
      });
    });
  } catch (error) {
    adminPanel.innerHTML = '<p class="error-text">Unable to load applications. Please try again later.</p>';
    console.error(error);
  }
}

async function approveApplication(id) {
  const response = await fetch(`/api/applications/${id}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

loadApplications();
