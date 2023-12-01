import { FeatureEntity } from '../../entity/feature';
import { BaseController, CoolController } from '@cool-midway/core';
import { Config, Get, Inject, Post, Provide } from '@midwayjs/decorator';
import { FeatureService } from '../../service/feature';
import { Context } from 'vm';
import { Validate } from '@midwayjs/validate';
import { CoolFileConfig } from '../../../../../packages/file/src';

// import {File} from "buffer";

/**
 * 测试
 */
@Provide()
@CoolController({
  api: ['delete', 'update', 'info', 'page', 'list'],
  entity: FeatureEntity,
  service: FeatureService,
  // 向表插入当前登录用户ID
  insertParam: ctx => {
    return {
      // 获得当前登录的后台用户ID，需要请求头传Authorization参数
      userId: ctx.admin.userId,
    };
  },
  // 分页查询配置
  pageQueryOp: {
    // 让title字段支持模糊查询
    // keyWordLikeFields: ['fileCode', 'remark'],
    fieldEq: [
      'gunType',
      'gunCode',
      'gunLifespan',
      'externalPlugIn',
      'signalSource',
      'installPosition',
      'installDirection',
      'connectionMethod',
      'action',
      'aperture',
      'firedNumber',
      'remark1',
      'remark2',
      'remark3',
      'remark4',
      'remark5',
      'remark6',
      'remark7',
    ],
    // select: ['fileCode', 'gunType', 'gunCode', 'gunLifespan', 'externalPlugIn', 'signalSource', 'installPosition', 'installDirection', 'connectionMethod', 'action',  'aperture', 'firedNumber', 'remark', 'remark1', 'remark2', 'remark3', 'remark4', 'remark5', 'remark6', 'remark7'],

    where: async (ctx: Context) => {
      // 获取body参数
      const data = ctx.request.body;
      const fileCode = data?.fileCode;
      const remark = data?.remark;
      const whereList = [];
      if (fileCode) {
        whereList.push([
          'fileCode LIKE :fileCode',
          { fileCode: `%${fileCode}%` },
        ]);
      }
      if (remark) {
        whereList.push(['remark LIKE :remark', { remark: `%${remark}%` }]);
      }
      return whereList;
    },

    // select: ['a.*'],

    // join: [
    //   {
    //     entity: BaseSysUserEntity,
    //     alias: 'b',
    //     condition: 'a.userId = b.id',
    //     type: 'leftJoin',
    //   },
    // ],
    // 添加排序
    // addOrderBy: {
    //   updateTime: 'asc'
    // },
  },
})
export class AdminFeatureController extends BaseController {
  @Inject()
  featureService: FeatureService;

  @Config('cool.file')
  config: CoolFileConfig;

  @Post('/add', { summary: '新增' })
  @Validate()
  async add() {
    return this.ok(
      await this.featureService.add({ userId: this.baseCtx.admin.userId })
    );
  }

  /**
   * 用于权限校验
   * 模板下载-示波器数据导入模板
   *
   */
  @Get('/downloadTemplate', {
    summary: '模板下载-示波器数据导入模板(仅用于权限校验)',
  })
  async downloadTemplate() {
    return this.ok(`/public/uploads/template/2302230004.csv`);
    // return this.ok(`${this.config.domain}/public/template/2302230004.csv`);
  }

  /**
   * 用于权限校验
   * 导入示波器数据
   */
  @Post('/importOscCsv', { summary: '导入示波器数据(仅用于权限校验)' })
  async importOscCsv() {
    return this.ok();
  }

  /**
   * 用于权限校验
   * 图像对比
   *
   */
  @Post('/imageComparison', { summary: '图像对比(仅用于权限校验)' })
  async imageComparison() {
    return this.ok();
  }

  /**
   * 用于权限校验
   * 图表操作（图像对比页面中echarts的图表操作按钮）
   *
   */
  @Post('/chartOperations', { summary: '图表数据下载(仅用于权限校验)' })
  async chartOperations() {
    return this.ok();
  }

  /**
   * 用于权限校验
   * 自定义列按钮
   *
   */
  @Post('/customColumns', { summary: '自定义列(仅用于权限校验)' })
  async customColumns() {
    return this.ok();
  }
}
