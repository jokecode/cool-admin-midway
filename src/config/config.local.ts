import { CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';

/**
 * 本地开发 npm run dev 读取的配置文件
 */
export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'mysql@lambda',
        database: 'cool',
        // 自动建表 注意：线上部署的时候不要使用，有可能导致数据丢失
        synchronize: true,
        // 打印日志
        logging: false,
        // 字符集
        charset: 'utf8mb4',
        // 是否开启缓存
        cache: true,
        // 实体路径
        entities: ['**/modules/*/entity'],
        // 设置时区
        // timezone: '+0800', // timezone 默认是用 UTC
        // dateStrings: false, // 默认就是false 官网url: https://midwayjs.org/docs/legacy/orm#%E5%85%B3%E4%BA%8E-mysql-%E6%97%B6%E9%97%B4%E5%88%97%E7%9A%84%E5%BD%93%E5%89%8D%E6%97%B6%E5%8C%BA%E5%B1%95%E7%A4%BA
      },
    },
  },
  cool: {
    // 是否自动导入数据库
    initDB: true,
    // crud配置
    crud: {
      // 软删除
      softDelete: true,
    },
  } as CoolConfig,
} as MidwayConfig;
