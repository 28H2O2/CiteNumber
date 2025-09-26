# CiteNumber 部署与 SEO 优化指南

## 目录
1. [部署策略](#部署策略)
2. [SEO 优化](#seo-优化)
3. [性能优化](#性能优化)
4. [监控与分析](#监控与分析)
5. [安全配置](#安全配置)

---

## 部署策略

### 1. Vercel 部署（推荐）

#### 优势
- 全球 CDN 加速
- 自动 HTTPS
- 自动 CI/CD
- 免费额度充足

#### 部署步骤

```bash
# 安装 Vercel CLI
npm i -g vercel

# 项目根目录执行
vercel

# 配置文件 vercel.json
```

创建 `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index2.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index2.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 2. Cloudflare Pages

```bash
# 构建配置
Build command: (留空)
Build output directory: /
Root directory: /
```

#### 优势
- 无限带宽
- 全球边缘网络
- 自动 SSL
- DDoS 保护

### 3. Nginx 配置

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name citenumber.com www.citenumber.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name citenumber.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/citenumber;
    index index2.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # 缓存策略
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API 代理（可选）
    location /api/ {
        proxy_pass https://api.semanticscholar.org/;
        proxy_set_header Host api.semanticscholar.org;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_valid 200 1h;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://api.semanticscholar.org; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;" always;
}
```

---

## SEO 优化

### 1. 结构化数据 (Schema.org)

在 `<head>` 中添加:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CiteNumber",
  "alternateName": "论文引用查询器",
  "url": "https://citenumber.com",
  "logo": "https://citenumber.com/logo.png",
  "description": "专业的学术论文引用查询工具，支持批量查询和数据导出",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CNY"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1024"
  }
}
</script>
```

### 2. Open Graph 标签

```html
<meta property="og:title" content="CiteNumber - 专业论文引用查询工具">
<meta property="og:description" content="快速查询学术论文引用次数，支持批量查询、数据导出">
<meta property="og:image" content="https://citenumber.com/og-image.png">
<meta property="og:url" content="https://citenumber.com">
<meta property="og:type" content="website">
<meta property="og:locale" content="zh_CN">
<meta property="og:locale:alternate" content="en_US">
```

### 3. Twitter Card

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="CiteNumber - 论文引用查询器">
<meta name="twitter:description" content="专业的学术论文引用查询工具">
<meta name="twitter:image" content="https://citenumber.com/twitter-card.png">
```

### 4. 站点地图 (sitemap.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://citenumber.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="zh" href="https://citenumber.com/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://citenumber.com/en"/>
  </url>
  <url>
    <loc>https://citenumber.com/pricing</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 5. robots.txt

```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://citenumber.com/sitemap.xml
```

### 6. 关键词优化策略

#### 核心关键词
- 论文引用查询
- 学术论文搜索
- citation search
- paper citation count
- 学术引用统计

#### 长尾关键词
- 如何查询论文被引用次数
- SCI论文引用查询工具
- 免费论文引用查询网站
- Semantic Scholar API 中文版

---

## 性能优化

### 1. 资源优化

#### 图片优化
```bash
# 使用 WebP 格式
cwebp input.png -o output.webp -q 80

# 响应式图片
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Description">
</picture>
```

#### CSS 优化
```bash
# 使用 PurgeCSS 移除未使用的 CSS
npx purgecss --css src/css/*.css --content index2.html --output dist/css/

# 压缩 CSS
npx cssnano input.css output.min.css
```

#### JavaScript 优化
```bash
# 使用 Terser 压缩
npx terser src/js/app.js -o dist/js/app.min.js -c -m

# 代码分割
import(/* webpackChunkName: "premium" */ './premium.js')
  .then(module => {
    // 使用 premium 功能
  });
```

### 2. 加载优化

```html
<!-- Preload 关键资源 -->
<link rel="preload" href="/src/css/modern-theme.css" as="style">
<link rel="preload" href="/src/js/config/app.config.js" as="script" type="module">

<!-- Prefetch 次要资源 -->
<link rel="prefetch" href="/src/js/services/PremiumService.js">

<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="https://api.semanticscholar.org">
```

### 3. Service Worker (PWA)

创建 `sw.js`:
```javascript
const CACHE_NAME = 'citenumber-v1';
const urlsToCache = [
  '/',
  '/src/css/modern-theme.css',
  '/src/js/config/app.config.js',
  '/src/js/core/EventBus.js',
  '/src/js/services/ApiService.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

---

## 监控与分析

### 1. Google Analytics 4

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 2. 百度统计

```html
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?YOUR_TRACKING_ID";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>
```

### 3. 性能监控

```javascript
// Web Vitals 监控
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

function sendToAnalytics(metric) {
  // 发送到分析服务
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## 安全配置

### 1. Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://api.semanticscholar.org;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.semanticscholar.org https://www.google-analytics.com;
">
```

### 2. 防止 XSS

```javascript
// 输入消毒
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// 使用 DOMPurify
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirty);
```

### 3. API 请求限流

```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    return false;
  }
}

const limiter = new RateLimiter(10, 60000); // 10 requests per minute
```

---

## 部署检查清单

### 部署前检查
- [ ] 压缩所有静态资源
- [ ] 设置正确的 meta 标签
- [ ] 配置 robots.txt 和 sitemap.xml
- [ ] 实现错误追踪
- [ ] 配置 HTTPS
- [ ] 设置安全头
- [ ] 优化图片资源
- [ ] 实现缓存策略

### 部署后检查
- [ ] 使用 Google PageSpeed Insights 测试性能
- [ ] 使用 GTmetrix 分析加载速度
- [ ] 验证 Google Search Console
- [ ] 提交站点地图
- [ ] 测试所有功能
- [ ] 监控错误日志
- [ ] 设置备份策略

### SEO 检查
- [ ] 标题标签优化 (50-60 字符)
- [ ] 描述标签优化 (150-160 字符)
- [ ] 结构化数据验证
- [ ] Open Graph 标签测试
- [ ] 移动友好性测试
- [ ] 页面加载速度 < 3秒
- [ ] Core Web Vitals 达标

---

## 持续优化建议

1. **A/B 测试**: 测试不同的 UI 布局和文案
2. **用户反馈**: 收集用户反馈，持续改进
3. **内容更新**: 定期更新内容，保持新鲜度
4. **性能监控**: 持续监控网站性能指标
5. **竞品分析**: 分析竞争对手，找出差异化优势
6. **多语言支持**: 扩展到更多语言版本
7. **社交媒体**: 建立社交媒体presence，增加曝光度

---

## 联系支持

如有部署或 SEO 相关问题，请联系:
- Email: support@citenumber.com
- GitHub: https://github.com/citenumber/citenumber

最后更新: 2024年1月