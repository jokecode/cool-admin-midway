import { AttachmentEntity } from "../entity/attachment";
import {Init, Provide} from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

/**
 * 商品示例
 */
@Provide()
export class AttachmentService extends BaseService {
  @InjectEntityModel(AttachmentEntity)
  attachmentEntity: Repository<AttachmentEntity>;

  @Init()
  async init() {
    super.init()

    // 设置实体
    this.setEntity(this.attachmentEntity)
  }

  /**
   * 执行sql分页
   */
  async sqlPage(query) {
    return this.sqlRenderPage(
      'select * from biz_signal_attachment ORDER BY id ASC',
      query,
      false
    );
  }

  /**
   * 执行entity分页
   */
  async entityPage(query) {
    const find = this.attachmentEntity.createQueryBuilder();
    return this.entityRenderPage(find, query);
  }
}
