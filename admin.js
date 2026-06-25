const adminPanel = document.getElementById('adminPanel');

function getDomainEmoji(domain) {
  const d = (domain || '').toLowerCase();
  if (d.includes('web')) return '🌐';
  if (d.includes('java')) return '☕';
  if (d.includes('ai') || d.includes('machine')) return '🤖';
  if (d.includes('data')) return '📊';
  if (d.includes('cyber') || d.includes('security')) return '🔒';
  if (d.includes('ui') || d.includes('ux') || d.includes('design')) return '🎨';
  return '📁';
}

function createApplicationCard(application) {
  const wrapper = document.createElement('article');
  wrapper.className = 'admin-card';

  const appliedDate = application.createdAt 
    ? new Date(application.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) 
    : 'Unknown Date';

  // Determine button state based on status
  let buttonHtml = '';
  if (application.status === 'accepted' || application.status === 'approved') {
    const statusText = application.status === 'accepted' ? 'Accepted ✓' : 'Approved ✓';
    buttonHtml = `
      <div class="admin-actions-row">
        <button class="btn btn-secondary" style="opacity: 0.7;" disabled>${statusText}</button>
        <button class="btn btn-secondary download-offer-btn" data-id="${application.id}">
          📥 Download Offer
        </button>
        <button class="btn btn-secondary resend-email-btn" data-id="${application.id}">
          ✉️ Resend Email
        </button>
      </div>
    `;
  } else {
    buttonHtml = `<button class="btn btn-secondary approve-btn" data-id="${application.id}">Approve Application</button>`;
  }

  wrapper.innerHTML = `
    <div class="admin-card-header">
      <div>
        <h3>${application.fullName}</h3>
        <p class="muted-text">${application.email}</p>
      </div>
      <span class="status-pill ${application.status}">${application.status.toUpperCase()}</span>
    </div>
    <div class="admin-card-body">
      <p><strong>Domain:</strong> ${getDomainEmoji(application.domain)} ${application.domain}</p>
      <p><strong>Submission Date:</strong> 📅 ${appliedDate}</p>
      <p><strong>GitHub:</strong> 🔗 <a href="${application.github}" target="_blank">${application.github}</a></p>
      <p><strong>LinkedIn:</strong> 🔗 <a href="${application.linkedin}" target="_blank">${application.linkedin}</a></p>
      <p><strong>LeetCode:</strong> 🔗 <a href="${application.leetcode}" target="_blank">${application.leetcode}</a></p>
      <p><strong>Resume:</strong> 📄 <a href="${application.resume}" target="_blank">Download Resume</a></p>
      <p style="margin-top: 1rem; font-style: italic; opacity: 0.95;">"${application.message}"</p>
    </div>
    <div class="admin-card-footer">
      ${buttonHtml}
    </div>
  `;

  return wrapper;
}

function renderStats(applications) {
  const total = applications.length;
  const pending = applications.filter(a => a.status === 'pending').length;
  const approved = applications.filter(a => a.status === 'approved').length;
  const accepted = applications.filter(a => a.status === 'accepted').length;

  const statsContainer = document.getElementById('adminStats');
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div class="admin-stat-card">
      <h3>${total}</h3>
      <p>Total Applicants</p>
    </div>
    <div class="admin-stat-card">
      <h3>${pending}</h3>
      <p>Pending Review</p>
    </div>
    <div class="admin-stat-card">
      <h3>${approved}</h3>
      <p>Approved Offers</p>
    </div>
    <div class="admin-stat-card">
      <h3>${accepted}</h3>
      <p>Accepted Offers</p>
    </div>
  `;
}

async function loadApplications() {
  try {
    const response = await fetch('/api/applications');
    const applications = await response.json();

    // Render stats
    renderStats(applications);

    adminPanel.innerHTML = '';
    if (!applications.length) {
      adminPanel.innerHTML = '<p class="empty-state">No applications found yet.</p>';
      return;
    }

    applications.forEach((application) => {
      const card = createApplicationCard(application);
      adminPanel.appendChild(card);
    });

    document.querySelectorAll('.approve-btn:not([disabled])').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const id = button.dataset.id;
        button.disabled = true;
        button.textContent = 'Approving...';
        const result = await approveApplication(id);
        if (result.success) {
          loadApplications();
        } else {
          button.disabled = false;
          button.textContent = 'Approve Application';
          alert(result.message || 'Unable to approve application.');
        }
      });
    });

    document.querySelectorAll('.download-offer-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = button.dataset.id;
        window.location.href = `/api/applications/download-offer?id=${id}`;
      });
    });

    document.querySelectorAll('.resend-email-btn').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const id = button.dataset.id;
        button.disabled = true;
        const originalText = button.innerHTML;
        button.innerHTML = 'Sending...';

        try {
          const response = await fetch(`/api/applications/email-offer?id=${id}`, {
            method: 'POST'
          });
          const result = await response.json();
          if (result.success) {
            button.innerHTML = 'Sent! ✓';
            setTimeout(() => {
              button.disabled = false;
              button.innerHTML = originalText;
            }, 3000);
          } else {
            button.disabled = false;
            button.innerHTML = originalText;
            alert(result.message || 'Failed to resend email.');
          }
        } catch (e) {
          button.disabled = false;
          button.innerHTML = originalText;
          alert('Network error. Please try again.');
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
