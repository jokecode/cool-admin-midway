import { FeatureEntity } from '../entity/feature';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

/**
 * 商品示例
 */
@Provide()
export class FeatureService extends BaseService {
  @InjectEntityModel(FeatureEntity)
  featureEntity: Repository<FeatureEntity>;

  // /**
  //  * 执行sql分页
  //  */
  // async sqlPage(query) {
  //   return this.sqlRenderPage(
  //     'select * from biz_firearm_signal_feature ORDER BY id ASC',
  //     query,
  //     false
  //   );
  // }
  //
  // /**
  //  * 执行entity分页
  //  */
  // async entityPage(query) {
  //   const find = this.featureEntity.createQueryBuilder();
  //   return this.entityRenderPage(find, query);
  // }

  // TODO 模板下载-示波器数据导入模板
  async downloadTemplate(id: number, type: number) {

  }

  // TODO 导入示波器数据
  async importOscCsv(params: any) {

  }

  // TODO 图像对比
  async imageComparison(id: number, type: number) {

  }
}
