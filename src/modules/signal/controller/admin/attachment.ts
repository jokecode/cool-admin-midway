import { AttachmentEntity } from '../../entity/attachment';
import { BaseController, CoolController } from '@cool-midway/core';

/**
 * 测试
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page', 'list'],
  entity: AttachmentEntity,
})
export class AdminAttachmentController extends BaseController {}
