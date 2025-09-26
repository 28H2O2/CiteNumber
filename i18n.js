const i18n = {
    zh: {
        title: "📚 论文引用查询器",
        subtitle: "快速查询学术论文的引用次数",
        singleTab: "单个查询",
        batchTab: "批量查询",
        searchPlaceholder: "请输入论文标题或关键词...",
        batchPlaceholder: "请输入多个论文标题，每行一个...\n\n例如：\nAttention Is All You Need\nBERT: Pre-training of Deep Bidirectional Transformers\nGPT-3: Language Models are Few-Shot Learners",
        searchButton: "搜索",
        batchSearchButton: "批量查询",
        paperCount: "篇论文",
        tips: "💡 提示：输入完整的论文标题可获得更准确的结果 | 支持批量查询多篇论文",
        searchHistory: "📝 搜索历史",
        clearHistory: "清除历史",
        emptyHistory: "暂无搜索历史",
        searching: "正在搜索中...",
        batchSearching: "正在批量查询",
        searchResults: "搜索结果",
        batchResults: "批量查询结果",
        noResults: "😔 未找到相关论文",
        noResultsHint: "请尝试使用更准确的论文标题或不同的关键词",
        searchError: "搜索出错，请稍后重试",
        citations: "被引用",
        times: "次",
        viewDetails: "查看详情",
        authors: "作者未知",
        yearUnknown: "年份未知",
        justNow: "刚刚",
        minutesAgo: "分钟前",
        hoursAgo: "小时前",
        daysAgo: "天前",
        footer: "数据来源：Semantic Scholar | 仅供学术参考使用",
        completed: "完成",
        notFound: "篇论文未找到结果",
        clearHistoryConfirm: "确定要清除所有搜索历史吗？",
        enterTitle: "请输入论文标题或关键词",
        enterBatchTitle: "请输入要批量查询的论文标题",
        atLeastOne: "请输入至少一个论文标题",
        maxTenPapers: "批量查询最多支持10篇论文，请减少输入",
        queryFailed: "查询失败",
        checkTitle: "请检查论文标题是否正确"
    },
    en: {
        title: "📚 Paper Citation Query",
        subtitle: "Quickly search academic paper citation counts",
        singleTab: "Single Search",
        batchTab: "Batch Search",
        searchPlaceholder: "Enter paper title or keywords...",
        batchPlaceholder: "Enter multiple paper titles, one per line...\n\nFor example:\nAttention Is All You Need\nBERT: Pre-training of Deep Bidirectional Transformers\nGPT-3: Language Models are Few-Shot Learners",
        searchButton: "Search",
        batchSearchButton: "Batch Search",
        paperCount: "papers",
        tips: "💡 Tip: Enter complete paper titles for more accurate results | Supports batch search for multiple papers",
        searchHistory: "📝 Search History",
        clearHistory: "Clear History",
        emptyHistory: "No search history",
        searching: "Searching...",
        batchSearching: "Batch searching",
        searchResults: "Search Results",
        batchResults: "Batch Search Results",
        noResults: "😔 No papers found",
        noResultsHint: "Try using more accurate paper titles or different keywords",
        searchError: "Search error, please try again later",
        citations: "Citations",
        times: "",
        viewDetails: "View Details",
        authors: "Authors unknown",
        yearUnknown: "Year unknown",
        justNow: "just now",
        minutesAgo: "minutes ago",
        hoursAgo: "hours ago",
        daysAgo: "days ago",
        footer: "Data source: Semantic Scholar | For academic reference only",
        completed: "completed",
        notFound: "papers not found",
        clearHistoryConfirm: "Are you sure you want to clear all search history?",
        enterTitle: "Please enter paper title or keywords",
        enterBatchTitle: "Please enter paper titles for batch search",
        atLeastOne: "Please enter at least one paper title",
        maxTenPapers: "Batch search supports up to 10 papers, please reduce input",
        queryFailed: "Query failed",
        checkTitle: "Please check if the paper title is correct"
    }
};

let currentLang = localStorage.getItem('language') || 'zh';

function t(key) {
    return i18n[currentLang][key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // Update language button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    updateUILanguage();
}

function updateUILanguage() {
    document.querySelector('header h1').textContent = t('title');
    document.querySelector('.subtitle').textContent = t('subtitle');
    document.querySelectorAll('.tab-btn')[0].textContent = t('singleTab');
    document.querySelectorAll('.tab-btn')[1].textContent = t('batchTab');
    document.getElementById('searchInput').placeholder = t('searchPlaceholder');
    document.getElementById('batchInput').placeholder = t('batchPlaceholder');
    document.querySelector('#searchBtn').innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
        </svg>
        ${t('searchButton')}
    `;
    document.querySelector('.batch-search-btn').innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11H3m6 0V5m0 6l-3-3m3 3l3-3m6 1a4 4 0 11-8 0 4 4 0 018 0zm6 8H15m6 0v-6m0 6l-3 3m3-3l3 3"/>
        </svg>
        ${t('batchSearchButton')}
    `;
    document.querySelector('.tips p').textContent = t('tips');
    document.querySelector('.history-header h3').textContent = t('searchHistory');
    document.querySelector('.clear-history-btn').textContent = t('clearHistory');
    document.querySelector('footer p').textContent = t('footer');

    const resultsHeader = document.querySelector('#resultsSection h2');
    if (resultsHeader && resultsHeader.textContent) {
        if (resultsHeader.textContent.includes('批量查询结果') || resultsHeader.textContent.includes('Batch Search Results')) {
            resultsHeader.textContent = t('batchResults');
        } else {
            resultsHeader.textContent = t('searchResults');
        }
    }

    const batchCount = document.querySelector('.batch-count');
    if (batchCount) {
        const count = batchCount.textContent.match(/\d+/);
        if (count) {
            batchCount.textContent = `${count[0]} ${t('paperCount')}`;
        }
    }

    renderHistory();
}

document.addEventListener('DOMContentLoaded', function() {
    setLanguage(currentLang);
});