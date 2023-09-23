import { AttachmentEntity } from '../../entity/attachment';
import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Inject, Post } from "@midwayjs/decorator";
import {AttachmentService} from "../../service/attachment";

/**
 * 测试
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page', 'list'],
  entity: AttachmentEntity,
  service: AttachmentService,
})
export class AdminAttachmentController extends BaseController {

  @Inject()
  attachmentService: AttachmentService;
  /**
   * 根据附件id查询附件信息详情列表
   */
  @Post('/listByIds', {summary: '附件信息详情列表'})
  async importOscCsv(@Body('ids') ids: []) {
    return this.ok(await this.attachmentService.getListByIds(ids));
  }
}
