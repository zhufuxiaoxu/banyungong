<template>
  <div class="vpn-list">
    <header class="header">
      <div class="title-wrapper">
        <h1>搬运工诸伏小徐</h1>
        <p class="subtitle">免费机场资源整理</p>
      </div>
      <div class="month-filter">
        <select v-model="selectedMonth">
          <option value="">全部月份</option>
          <option v-for="month in months" :key="month" :value="month">
            {{ month }}月 ({{ getMonthCount(month) }})
          </option>
        </select>
      </div>
    </header>

    <div class="vpn-items">
      <div v-for="item in filteredVPNs" :key="item.id" class="vpn-item">
        <div class="vpn-item-header">
          <h2>{{ item.title }}</h2>
          <span class="update-time">{{ item.updateTime }}</span>
        </div>
        
        <!-- 主要信息 -->
        <div class="main-info">
          <div class="coupon-info">
            <span class="label">优惠码:</span>
            <code>{{ item.couponCode }}</code>
            <span class="package">
              {{ item.price }}元"{{ item.packageName }}" {{ item.traffic }}GB/{{ item.duration }}天
            </span>
          </div>
          
          <div class="node-info">
            <div class="info-item">
              <i class="icon">📍</i>
              <span>{{ item.nodeLocations.join('、') }}</span>
            </div>
            <div class="info-item">
              <i class="icon">🔒</i>
              <span>{{ item.protocol }}</span>
            </div>
            <div class="info-item">
              <i class="icon">🌐</i>
              <span>{{ item.nodeCount }}个节点</span>
            </div>
          </div>
        </div>

        <!-- 链接区域 -->
        <div class="action-links">
          <a v-for="(link, index) in item.links" 
             :key="index" 
             :href="link.href"
             target="_blank"
             rel="noopener noreferrer"
             class="action-link">
            {{ link.text }}
          </a>
        </div>

        <!-- 注册提示 -->
        <div v-if="item.notice" class="notice">
          <i class="icon">ℹ️</i>
          {{ item.notice }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vpn-list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.title-wrapper {
  text-align: left;
}

.header h1 {
  margin: 0;
  background: linear-gradient(45deg, #00838f 0%, #0277bd 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  margin: 5px 0 0;
  color: #546e7a;
  font-size: 14px;
}

.month-filter select {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #2c3e50;
  background: white;
  cursor: pointer;
}

.vpn-item {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.vpn-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.vpn-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.vpn-item-header h2 {
  margin: 0;
  font-size: 18px;
  color: #1a73e8;
}

.update-time {
  font-size: 12px;
  color: #666;
}

.main-info {
  margin: 15px 0;
}

.coupon-info {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.coupon-info .label {
  color: #666;
  margin-right: 8px;
}

.coupon-info code {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  margin-right: 8px;
}

.node-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 15px 0;
}

.info-item {
  display: flex;
  align-items: center;
  color: #444;
}

.icon {
  margin-right: 8px;
  font-style: normal;
}

.action-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
}

.action-link {
  padding: 8px 16px;
  background: #f0f4f8;
  color: #1a73e8;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  transition: background 0.2s;
}

.action-link:hover {
  background: #e3f2fd;
}

.notice {
  background: #fff3e0;
  color: #e65100;
  padding: 12px;
  border-radius: 6px;
  margin-top: 15px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
  }

  .node-info {
    grid-template-columns: 1fr;
  }

  .action-links {
    flex-direction: column;
  }

  .action-link {
    text-align: center;
  }
}
</style>

<script>
export default {
  name: 'VPNList',
  data() {
    return {
      vpnList: [],
      selectedMonth: new Date().getMonth() + 1,
      months: Array.from({length: 12}, (_, i) => i + 1)
    }
  },
  computed: {
    filteredVPNs() {
      if (!this.selectedMonth) {
        return this.vpnList;
      }
      return this.vpnList.filter(vpn => {
        const vpnMonth = new Date(vpn.updateTime).getMonth() + 1;
        return vpnMonth === parseInt(this.selectedMonth);
      });
    },
    latestMonth() {
      if (!this.vpnList.length) return new Date().getMonth() + 1;
      return Math.max(...this.vpnList.map(vpn => new Date(vpn.updateTime).getMonth() + 1));
    }
  },
  created() {
    this.fetchVPNData();
  },
  methods: {
    async fetchVPNData() {
      try {
        const response = await this.$http.get('http://192.168.1.5:3000/api/vpns');
        this.vpnList = response.data;
        console.log(`获取到 ${this.vpnList.length} 条数据`);
        this.selectedMonth = this.latestMonth;
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    },
    getMonthCount(month) {
      return this.vpnList.filter(vpn => {
        const vpnMonth = new Date(vpn.updateTime).getMonth() + 1;
        return vpnMonth === month;
      }).length;
    }
  }
}
</script>