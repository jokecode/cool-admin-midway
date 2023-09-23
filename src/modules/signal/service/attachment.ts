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
  async getListByIds(ids: []) {
    // SELECT t.* FROM biz_signal_attachment t WHERE t.id IN (1, 2)
    return this.attachmentEntity.createQueryBuilder('att').where('att.id IN (:ids)', {　ids: ids }).getMany();
  }

}
