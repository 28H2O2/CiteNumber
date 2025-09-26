let searchTimeout;
let searchHistory = [];
const MAX_HISTORY = 20;

function initializeHistory() {
    const stored = localStorage.getItem('searchHistory');
    if (stored) {
        searchHistory = JSON.parse(stored);
    }
    renderHistory();
}

function addToHistory(searchTerm) {
    const historyItem = {
        text: searchTerm,
        time: new Date().toISOString()
    };

    searchHistory = searchHistory.filter(item => item.text !== searchTerm);
    searchHistory.unshift(historyItem);

    if (searchHistory.length > MAX_HISTORY) {
        searchHistory = searchHistory.slice(0, MAX_HISTORY);
    }

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');

    if (searchHistory.length === 0) {
        historyList.innerHTML = `<div class="empty-history">${t('emptyHistory')}</div>`;
        return;
    }

    historyList.innerHTML = searchHistory.map(item => {
        const date = new Date(item.time);
        const timeString = formatTime(date);
        return `
            <div class="history-item" onclick="searchFromHistory('${escapeHtml(item.text)}')">
                <span class="history-text">${escapeHtml(item.text)}</span>
                <span class="history-time">${timeString}</span>
            </div>
        `;
    }).join('');
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('justNow');
    if (minutes < 60) return `${minutes} ${t('minutesAgo')}`;
    if (hours < 24) return `${hours} ${t('hoursAgo')}`;
    if (days < 7) return `${days} ${t('daysAgo')}`;
    return date.toLocaleDateString(currentLang === 'zh' ? 'zh-CN' : 'en-US');
}

function clearHistory() {
    if (confirm(t('clearHistoryConfirm'))) {
        searchHistory = [];
        localStorage.removeItem('searchHistory');
        renderHistory();
    }
}

function searchFromHistory(text) {
    document.getElementById('searchInput').value = text;
    if (document.getElementById('singleSearchTab').classList.contains('active')) {
        searchPapers();
    }
}

function setupSearchSuggestions() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsDiv = document.getElementById('searchSuggestions');

    searchInput.addEventListener('input', function(e) {
        const value = e.target.value.toLowerCase().trim();

        if (!value) {
            suggestionsDiv.classList.add('hidden');
            return;
        }

        const matches = searchHistory.filter(item =>
            item.text.toLowerCase().includes(value)
        ).slice(0, 5);

        if (matches.length > 0) {
            suggestionsDiv.innerHTML = matches.map(item => `
                <div class="suggestion-item" onclick="selectSuggestion('${escapeHtml(item.text)}')">
                    ${highlightMatch(escapeHtml(item.text), value)}
                </div>
            `).join('');
            suggestionsDiv.classList.remove('hidden');
        } else {
            suggestionsDiv.classList.add('hidden');
        }
    });

    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.classList.add('hidden');
        }
    });
}

function selectSuggestion(text) {
    document.getElementById('searchInput').value = text;
    document.getElementById('searchSuggestions').classList.add('hidden');
    searchPapers();
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

function switchTab(tabName) {
    const singleTab = document.getElementById('singleSearchTab');
    const batchTab = document.getElementById('batchSearchTab');
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => tab.classList.remove('active'));

    if (tabName === 'single') {
        singleTab.classList.add('active');
        batchTab.classList.remove('active');
        tabs[0].classList.add('active');
    } else {
        singleTab.classList.remove('active');
        batchTab.classList.add('active');
        tabs[1].classList.add('active');
    }
}

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchPapers();
    }
});

document.getElementById('batchInput').addEventListener('input', function(e) {
    const lines = e.target.value.trim().split('\n').filter(line => line.trim());
    document.querySelector('.batch-count').textContent = `${lines.length} ${t('paperCount')}`;
});

async function searchPapers() {
    const searchTerm = document.getElementById('searchInput').value.trim();

    if (!searchTerm) {
        alert(t('enterTitle'));
        return;
    }

    addToHistory(searchTerm);

    clearTimeout(searchTimeout);

    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsSection = document.getElementById('resultsSection');
    const errorMessage = document.getElementById('errorMessage');
    const resultsContainer = document.getElementById('resultsContainer');

    loadingSpinner.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    errorMessage.classList.add('hidden');

    try {
        const encodedQuery = encodeURIComponent(searchTerm);
        const apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodedQuery}&fields=title,authors,year,citationCount,venue,paperId,externalIds&limit=10`;

        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();

        loadingSpinner.classList.add('hidden');

        if (data.data && data.data.length > 0) {
            displayResults(data.data, searchTerm);
            resultsSection.classList.remove('hidden');
        } else {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>${t('noResults')}</p>
                    <p style="font-size: 0.9rem; color: #888;">${t('noResultsHint')}</p>
                </div>
            `;
            resultsSection.classList.remove('hidden');
        }

    } catch (error) {
        console.error('Search error:', error);
        loadingSpinner.classList.add('hidden');
        errorMessage.classList.remove('hidden');

        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }
}

async function performBatchSearch() {
    const batchInput = document.getElementById('batchInput').value.trim();

    if (!batchInput) {
        alert(t('enterBatchTitle'));
        return;
    }

    const titles = batchInput.split('\n').filter(line => line.trim());

    if (titles.length === 0) {
        alert(t('atLeastOne'));
        return;
    }

    if (titles.length > 10) {
        alert(t('maxTenPapers'));
        return;
    }

    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsSection = document.getElementById('resultsSection');
    const errorMessage = document.getElementById('errorMessage');
    const resultsContainer = document.getElementById('resultsContainer');

    loadingSpinner.classList.remove('hidden');
    loadingSpinner.innerHTML = `
        <div class="spinner"></div>
        <p>${t('batchSearching')} ${titles.length} ${t('paperCount')}...</p>
        <p style="font-size: 14px; color: #666; margin-top: 10px;">
            <span id="batchProgress">0</span> / ${titles.length} ${t('completed')}
        </p>
    `;
    resultsSection.classList.add('hidden');
    errorMessage.classList.add('hidden');

    let allResults = [];
    let completed = 0;

    for (const title of titles) {
        try {
            const encodedQuery = encodeURIComponent(title.trim());
            const apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodedQuery}&fields=title,authors,year,citationCount,venue,paperId,externalIds&limit=1`;

            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    allResults.push({
                        ...data.data[0],
                        queryTitle: title.trim()
                    });
                }
            }

            completed++;
            document.getElementById('batchProgress').textContent = completed;

            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error(`${t('queryFailed')}: ${title}`, error);
        }
    }

    loadingSpinner.classList.add('hidden');
    loadingSpinner.innerHTML = `<div class="spinner"></div><p>${t('searching')}</p>`;

    if (allResults.length > 0) {
        allResults.sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0));

        displayBatchResults(allResults, titles);
        resultsSection.classList.remove('hidden');

        titles.forEach(title => addToHistory(title.trim()));
    } else {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>${t('noResults')}</p>
                <p style="font-size: 0.9rem; color: #888;">${t('checkTitle')}</p>
            </div>
        `;
        resultsSection.classList.remove('hidden');
    }
}

function displayResults(papers, searchTerm) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsSection = document.getElementById('resultsSection');

    resultsSection.querySelector('h2').textContent = `"${searchTerm}" ${t('searchResults')}`;

    resultsContainer.innerHTML = '';

    papers.forEach(paper => {
        const paperCard = createPaperCard(paper);
        resultsContainer.appendChild(paperCard);
    });
}

function displayBatchResults(papers, queries) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsSection = document.getElementById('resultsSection');

    resultsSection.querySelector('h2').textContent = `${t('batchResults')} (${papers.length}/${queries.length})`;

    resultsContainer.innerHTML = '';

    if (papers.length < queries.length) {
        const notFound = queries.length - papers.length;
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = 'background: #fff3cd; color: #856404; padding: 10px; border-radius: 8px; margin-bottom: 15px;';
        warningDiv.textContent = `⚠️ ${notFound} ${t('notFound')}`;
        resultsContainer.appendChild(warningDiv);
    }

    papers.forEach((paper, index) => {
        const paperCard = createPaperCard(paper);
        if (index === 0 && paper.citationCount > 1000) {
            paperCard.style.borderLeftColor = '#ff6b6b';
            paperCard.style.background = 'linear-gradient(to right, #fff5f5, #ffffff)';
        }
        resultsContainer.appendChild(paperCard);
    });
}

function createPaperCard(paper) {
    const card = document.createElement('div');
    card.className = 'paper-card';

    const title = paper.title || 'Unknown Title';
    const authors = paper.authors ?
        paper.authors.slice(0, 3).map(a => a.name).join(', ') +
        (paper.authors.length > 3 ? (currentLang === 'zh' ? ' 等' : ' et al.') : '') :
        t('authors');
    const year = paper.year || t('yearUnknown');
    const venue = paper.venue || '';
    const citationCount = paper.citationCount || 0;
    const paperId = paper.paperId;

    const semanticScholarUrl = `https://www.semanticscholar.org/paper/${paperId}`;

    let doi = '';
    if (paper.externalIds && paper.externalIds.DOI) {
        doi = paper.externalIds.DOI;
    }

    card.innerHTML = `
        <div class="paper-title">${escapeHtml(title)}</div>
        <div class="paper-authors">👤 ${escapeHtml(authors)}</div>
        ${year !== t('yearUnknown') ? `<span class="paper-year">📅 ${year}</span>` : ''}
        ${venue ? `<div class="paper-venue">📍 ${escapeHtml(venue)}</div>` : ''}
        <div class="citation-info">
            <span class="citation-count">🔥 ${t('citations')}: ${citationCount.toLocaleString()} ${t('times')}</span>
            <a href="${semanticScholarUrl}" target="_blank" class="paper-link">
                ${t('viewDetails')} →
            </a>
            ${doi ? `<a href="https://doi.org/${doi}" target="_blank" class="paper-link">
                DOI →
            </a>` : ''}
        </div>
    `;

    return card;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    searchInput.focus();

    const exampleSearches = [
        "Attention Is All You Need",
        "BERT: Pre-training of Deep Bidirectional Transformers",
        "ImageNet Classification with Deep Convolutional Neural Networks",
        "Generative Adversarial Networks"
    ];

    initializeHistory();
    setupSearchSuggestions();
});