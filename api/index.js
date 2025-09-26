// Vercel Serverless Function
// 这个文件主要用于处理服务端逻辑，如果需要的话
// 由于当前项目是纯前端应用，这里提供一个基础的API结构

export default function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 基础的健康检查端点
    if (req.method === 'GET') {
        res.status(200).json({
            message: '论文引用查询器 API',
            version: '1.0.0',
            status: 'running'
        });
        return;
    }

    // 其他方法返回405
    res.status(405).json({ error: 'Method not allowed' });
}
