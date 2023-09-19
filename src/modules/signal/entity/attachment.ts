import { BaseEntity } from '@cool-midway/core';
import { Column, Entity } from 'typeorm';

/**
 * 示波器数据存储表
 */
@Entity('biz_signal_attachment')
export class AttachmentEntity extends BaseEntity {

  @Column({ comment: '附件名称' })
  name: string;

  @Column({ comment: '附件原始名称' })
  oldName: string;

  @Column({ comment: '附件存储路径' })
  path: string;

  @Column({ comment: '附件大小' })
  size: string;

  @Column({ comment: '附件类型', nullable: true })
  type: string;

  @Column({ comment: '创建者ID', type: "int", nullable: true })
  createUserId: number;

  @Column({ comment: '创建者ID', type: "int", nullable: true })
  updateUserId: number;

  @Column({ comment: '逻辑删除标记：0-正常，1-删除', type: "int", default: 0 })
  deleted: number;

  @Column({ comment: '示波器csv数据', type: "json", nullable: true })
  data: object;

}
