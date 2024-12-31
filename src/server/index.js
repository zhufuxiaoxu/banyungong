const express = require('express');
const cors = require('cors');
const VPNCrawler = require('./crawler');

const app = express();

// 配置CORS，允许所有来源访问
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

const crawler = new VPNCrawler();

// 缓存爬取的数据
let vpnCache = {
  lastUpdate: null,
  data: []
};

// 定期更新缓存(每24小时)
const updateCache = async () => {
  try {
    const allData = [];
    // 爬取1-12月的数据
    for (let month = 1; month <= 12; month++) {
      console.log(`开始爬取 ${month} 月数据...`);
      try {
        const monthData = await crawler.crawlMonth(month);
        if (monthData && monthData.length > 0) {
          allData.push(...monthData);
          console.log(`${month}月成功获取 ${monthData.length} 条数据`);
        } else {
          console.log(`${month}月未找到数据，尝试重试...`);
          // 等待3秒后重试
          await new Promise(resolve => setTimeout(resolve, 3000));
          const retryData = await crawler.crawlMonth(month);
          if (retryData && retryData.length > 0) {
            allData.push(...retryData);
            console.log(`${month}月重试成功，获取 ${retryData.length} 条数据`);
          }
        }
        // 每个月份爬取后等待2秒，避免请求过快
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`${month}月爬取失败:`, error.message);
      }
    }
    
    if (allData.length > 0) {
      vpnCache.data = allData;
      vpnCache.lastUpdate = new Date();
      console.log(`缓存更新完成，共获取 ${allData.length} 条数据`);
      // 按月份统计数据
      const monthlyStats = allData.reduce((acc, item) => {
        const month = new Date(item.updateTime).getMonth() + 1;
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});
      console.log('各月份数据统计:', monthlyStats);
    } else {
      console.error('未能获取任何数据');
    }
  } catch (error) {
    console.error('更新缓存失败:', error);
  }
};

// API路由
app.get('/api/vpns', async (req, res) => {
  try {
    // 如果缓存过期或不存在，更新缓存
    if (!vpnCache.lastUpdate || 
        Date.now() - vpnCache.lastUpdate.getTime() > 24 * 60 * 60 * 1000) {
      await updateCache();
    }
    res.json(vpnCache.data);
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 查找可用端口
const findAvailablePort = async (startPort) => {
  const net = require('net');
  
  const isPortAvailable = (port) => {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once('error', () => {
        resolve(false);
      });
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      server.listen(port);
    });
  };

  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
  }
  return port;
};

// 启动服务器
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, '0.0.0.0', () => {  // 修改这里，允许所有IP访问
      console.log(`服务器运行在端口 ${PORT}`);
      updateCache();
    }).on('error', (error) => {
      console.error('服务器启动失败:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
};

// 启动服务器
startServer();