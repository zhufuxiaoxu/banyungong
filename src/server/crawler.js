const axios = require('axios');
const cheerio = require('cheerio');

class VPNCrawler {
  constructor() {
    this.baseUrl = 'https://ygpy.net';
    // 创建axios实例，设置超时和重试配置
    this.axios = axios.create({
      timeout: 10000, // 10秒超时
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
  }

  // 添加重试机制
  async retryGet(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`尝试第 ${i + 1} 次请求: ${url}`);
        const response = await this.axios.get(url);
        return response;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        console.log(`请求失败，等待重试...`);
        // 等待时间递增
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
      }
    }
  }

  async crawlMonth(month) {
    try {
      const paddedMonth = month.toString().padStart(2, '0');
      const url = `${this.baseUrl}/vpn/2024/${paddedMonth}.html`;
      
      console.log(`正在爬取: ${url}`);
      
      // 使用重试机制发起请求
      const response = await this.retryGet(url);
      
      // 检查响应状态
      if (!response.data) {
        throw new Error('响应数据为空');
      }

      const $ = cheerio.load(response.data);
      const vpnItems = [];
      
      // 直接查找所有h2标题
      $('h2').each((index, element) => {
        const $h2 = $(element);
        const title = $h2.text().trim();
        
        // 跳过付费项目和广告
        if (title.includes('付费') || title.includes('广告')) {
          return;
        }

        // 获取h2后面的内容直到下一个h2
        const $content = $h2.nextUntil('h2');
        const contentText = $content.text();
        
        // 提取链接
        const links = [];
        $content.find('a').each((_, link) => {
          const $link = $(link);
          const text = $link.text().trim();
          const href = $link.attr('href');
          if (text && href && !text.includes('朋友')) {
            links.push({ text, href });
          }
        });

        // 调试输出
        console.log('找到标题:', title);
        console.log('链接数量:', links.length);
        console.log('内容长度:', contentText.length);

        // 提取基本信息
        const couponMatch = contentText.match(/使用优惠码\s*[`']?([^`'\s]+)[`']?/);
        const packageMatch = contentText.match(/(\d+)\s*元购买\s*"([^"]+)"\s*(\d+)GB[\/](\d+)\s*天/);
        const locationMatch = contentText.match(/节点位置[：:]\s*([^。\n]+)/);
        const protocolMatch = contentText.match(/协议[类型]*[：:]\s*([^。\n]+)/);
        const nodeCountMatch = contentText.match(/节点数量[：:]\s*(\d+)/);
        const noticeMatch = contentText.match(/注册[提示信息][：:]\s*([^。\n]+)/);
        const updateMatch = contentText.match(/更新于[：:]\s*(\d{4}[-/]\d{1,2}[-/]\d{1,2})/);

        const item = {
          id: Date.now() + index,
          title: title,
          couponCode: couponMatch ? couponMatch[1] : '',
          price: packageMatch ? packageMatch[1] : '0',
          packageName: packageMatch ? packageMatch[2] : '',
          traffic: packageMatch ? packageMatch[3] : '',
          duration: packageMatch ? packageMatch[4] : '30',
          nodeLocations: locationMatch ? locationMatch[1].split(/[,，、]/).map(s => s.trim()) : [],
          protocol: protocolMatch ? protocolMatch[1] : '',
          nodeCount: nodeCountMatch ? parseInt(nodeCountMatch[1]) : 0,
          links: links.slice(0, 4), // 只保留前4个链接
          notice: noticeMatch ? noticeMatch[1] : '无需验证',
          updateTime: updateMatch ? updateMatch[1] : new Date().toISOString().split('T')[0]
        };

        // 只添加有效的项目
        if (links.length > 0) {
          console.log(`成功提取项目: ${item.title}`);
          vpnItems.push(item);
        }
      });
      
      console.log(`${month}月共找到 ${vpnItems.length} 个项目`);
      return vpnItems;
    } catch (error) {
      console.error(`爬取${month}月数据失败:`, error.message);
      if (error.response) {
        console.error('状态码:', error.response.status);
        console.error('响应头:', error.response.headers);
      }
      throw error; // 向上传递错误
    }
  }
}

module.exports = VPNCrawler;