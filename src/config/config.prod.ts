import { CoolConfig, MODETYPE } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';

/**
 * 本地开发 npm run prod 读取的配置文件
 */
export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: 'mysql8',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'cool',
        // 自动建表 注意：线上部署的时候不要使用，有可能导致数据丢失
        synchronize: false,
        // 打印日志
        logging: false,
        // 字符集
        charset: 'utf8mb4',
        // 是否开启缓存
        cache: true,
        // 实体路径
        entities: ['**/modules/*/entity'],
        // 设置时区
        timezone: '+08:00', // timezone 默认是用 UTC
        dateStrings: false, // 官网url: https://midwayjs.org/docs/legacy/orm#%E5%85%B3%E4%BA%8E-mysql-%E6%97%B6%E9%97%B4%E5%88%97%E7%9A%84%E5%BD%93%E5%89%8D%E6%97%B6%E5%8C%BA%E5%B1%95%E7%A4%BA
      },
    },
  },
  cool: {
    // 是否自动导入数据库，生产环境不建议开，用本地的数据库手动初始化
    initDB: false,
    file: {
      // 上传模式 本地上传或云存储
      mode: MODETYPE.LOCAL,
      // 本地上传 文件地址前缀
      domain: 'http://jsq_server:8002',
    },
  } as CoolConfig,
} as MidwayConfig;
