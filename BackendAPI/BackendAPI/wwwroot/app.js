'use strict';

const API_BASE = '/api/documents';

async function loadDocuments() {
  showLoading();

  try {
    const response = await fetch(API_BASE);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }

    const documents = await response.json();
    renderDocuments(documents);
  } catch (err) {
    showError(err.message);
  }
}

function renderDocuments(documents) {
  hideAll();

  const countEl = document.getElementById('doc-count');
  countEl.textContent = `${documents.length} document${documents.length !== 1 ? 's' : ''}`;

  if (documents.length === 0) {
    document.getElementById('empty-state').classList.remove('hidden');
    return;
  }

  const tbody = document.getElementById('doc-tbody');
  tbody.innerHTML = '';

  documents.forEach(doc => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="col-name">
        <span class="doc-icon" aria-hidden="true">&#128196;</span>
        <span class="doc-name">${escapeHtml(doc.name)}</span>
      </td>
      <td class="col-desc">${escapeHtml(doc.description)}</td>
      <td class="col-size">${formatBytes(doc.fileSizeBytes)}</td>
      <td class="col-date">${formatDate(doc.uploadedAt)}</td>
      <td class="col-action">
        <button
          class="btn btn-primary"
          onclick="downloadDocument(${doc.id}, '${escapeHtml(doc.fileName)}')"
          aria-label="Download ${escapeHtml(doc.name)}"
        >
          Download
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('doc-table').classList.remove('hidden');
}

function downloadDocument(id, fileName) {
  const link = document.createElement('a');
  link.href = `${API_BASE}/${id}/download`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function showLoading() {
  hideAll();
  document.getElementById('loading').classList.remove('hidden');
}

function showError(message) {
  hideAll();
  document.getElementById('error-message').textContent =
    `Failed to load documents: ${message}`;
  document.getElementById('error-state').classList.remove('hidden');
}

function hideAll() {
  ['loading', 'error-state', 'doc-table', 'empty-state'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', loadDocuments);
