import { Provide, Inject, Get, Post, Body, ALL } from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes, CoolCommException,
} from '@cool-midway/core';
import { BaseSysUserEntity } from '../../entity/sys/user';
import { BaseSysLoginService } from '../../service/sys/login';
import { BaseSysPermsService } from '../../service/sys/perms';
import { BaseSysUserService } from '../../service/sys/user';
import { Context } from '@midwayjs/koa';
import { CoolFile } from '@cool-midway/file';
import { AttachmentService } from "../../../signal/service/attachment";
import * as _ from 'lodash';

/**
 * Base 通用接口 一般写不需要权限过滤的接口
 */
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['eps'],
})
@Provide()
@CoolController()
export class BaseCommController extends BaseController {
  @Inject()
  baseSysUserService: BaseSysUserService;

  @Inject()
  baseSysPermsService: BaseSysPermsService;

  @Inject()
  baseSysLoginService: BaseSysLoginService;

  @Inject()
  ctx: Context;

  @Inject()
  coolFile: CoolFile;

  @Inject()
  attachmentService: AttachmentService;

  /**
   * 获得个人信息
   */
  @Get('/person', { summary: '个人信息' })
  async person() {
    return this.ok(await this.baseSysUserService.person());
  }

  /**
   * 修改个人信息
   */
  @Post('/personUpdate', { summary: '修改个人信息' })
  async personUpdate(@Body(ALL) user: BaseSysUserEntity) {
    await this.baseSysUserService.personUpdate(user);
    return this.ok();
  }

  /**
   * 权限菜单
   */
  @Get('/permmenu', { summary: '权限与菜单' })
  async permmenu() {
    return this.ok(
      await this.baseSysPermsService.permmenu(this.ctx.admin.roleIds)
    );
  }

  /**
   * 文件上传
   */
  @Post('/upload', { summary: '文件上传' })
  async upload() {
    return this.ok(await this.coolFile.upload(this.ctx));
  }


  /**
   * 文件上传
   */
  @Post('/uploadOscCsv', { summary: '文件上传' })
  async uploadOscCsv() {

    if (_.isEmpty(this.ctx.files)) {
      throw new CoolCommException('上传文件为空');
    }

    const path = await this.coolFile.upload(this.ctx);

    const file = this.ctx.files[0];

    // @ts-ignore
    const att_name = path?.split('/')?.pop(); // 含后缀名
    const att_oldName = file.filename; // 含后缀名
    const att_path = path;
    // const att_size = file?.size;
    // const att_type = file?.type;
    // const att_createUserId = ;
    const att_size = 123;
    const att_type = file.mimeType;
    const att_createUserId = 1;

    const attInfo = {
      name: att_name,
      oldName: att_oldName,
      path: att_path,
      size: att_size,
      type: att_type,
      createUserId: att_createUserId,
      deleted: 0,
    }

    // 解析附件内容，然后存储在表biz_firearm_signal_feature.data字段中
    const attRes = await this.attachmentService.add(attInfo)

    return this.ok({
      ...attInfo,
      ...attRes
    });
  }

  /**
   * 文件上传模式，本地或者云存储
   */
  @Get('/uploadMode', { summary: '文件上传模式' })
  async uploadMode() {
    return this.ok(await this.coolFile.getMode());
  }

  /**
   * 退出
   */
  @Post('/logout', { summary: '退出' })
  async logout() {
    await this.baseSysLoginService.logout();
    return this.ok();
  }
}
