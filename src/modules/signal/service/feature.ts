import { FeatureEntity } from '../entity/feature';
import { Config, Inject, Provide } from '@midwayjs/decorator';
import {
  BaseService,
  CoolTransaction,
  CoolValidateException,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { AttachmentService } from './attachment';
import * as _ from 'lodash';
import { AttachmentEntity } from '../entity/attachment';
import { CoolFile, CoolFileConfig } from '@cool-midway/file';
// import { CoolFile } from '../../../../packages/file/src';
import { v1 as uuid } from 'uuid';

const Papa = require('papaparse');
const fs = require('fs');

/**
 * 信号特征管理
 */
@Provide()
export class FeatureService extends BaseService {
  @Inject()
  ctx;

  @InjectEntityModel(FeatureEntity)
  featureEntity: Repository<FeatureEntity>;

  @Inject()
  attachmentService: AttachmentService;

  @Inject()
  coolFile: CoolFile;

  @Config('cool.file')
  config: CoolFileConfig;
  /**
   * 自定义实现add
   *
   * 新增时，需要同时保存信号特征信息和上传的示波器文件数据，故重新实现add方法；
   */
  @CoolTransaction({ isolation: 'SERIALIZABLE' })
  async add(param, queryRunner?: QueryRunner): Promise<Object> {
    const { fields } = this.ctx;
    const fileCode = fields.fileCode;
    const featureList = await this.findFeatureByFileCode(fileCode);
    if (!_.isEmpty(featureList)) {
      throw new CoolValidateException(`文件编号“${fileCode}”已存在，请检查！`);
    }

    let attResponseData = undefined;
    const fileIsEmpty = _.isEmpty(this.ctx.files);
    if (!fileIsEmpty) {
      // 保存文件
      const path: string = <string>await this.coolFile.upload(this.ctx);
      const file = this.ctx.files[0];
      const parsedData: object = await this.readCSV(file.data);

      const extension = file.filename.split('.').pop();

      const attachmentEntity = new AttachmentEntity();
      attachmentEntity.name = fields['key'] || `${uuid()}.${extension}`;
      attachmentEntity.oldName = file.filename; // 含后缀名
      attachmentEntity.path = path.replace(this.config.domain, '');
      attachmentEntity.size = fields['fileSize'];
      attachmentEntity.type = file.mimeType;
      attachmentEntity.createUserId = param.userId;
      attachmentEntity.data = parsedData;

      // 有时候我们需要在数据进行修改动作之前，对它进行一些处理，比如：修改密码时，需要对密码进行加密，这时候我们可以使用modifyBefore方法来实现
      // await this.modifyBefore(attachmentEntity, "add");
      const attRes = await queryRunner.manager.insert(
        AttachmentEntity,
        attachmentEntity
      );
      // 有时候我们需要在数据进行修改动作之后，对它进行一些处理，比如：修改完数据之后将它放入队列或者ElasticSearch
      // await this.modifyAfter(attachmentEntity, "add");
      const [attResMap] = attRes.generatedMaps;
      attResponseData = {
        ...attachmentEntity,
        id: attResMap.id,
        createTime: attResMap.updateTime,
        updateTime: attResMap.updateTime,
        deleted: attResMap.deleted,
      };
    }

    const featureEntity = new FeatureEntity();
    featureEntity.fileCode = fields['fileCode'];
    featureEntity.gunType = fields['gunType'];
    featureEntity.gunCode = fields['gunCode'];
    featureEntity.gunLifespan = fields['gunLifespan'];
    featureEntity.externalPlugIn = fields['externalPlugIn'];
    featureEntity.signalSource = fields['signalSource'];
    featureEntity.installPosition = fields['installPosition'];
    featureEntity.installDirection = fields['installDirection'];
    featureEntity.connectionMethod = fields['connectionMethod'];
    featureEntity.action = fields['action'];
    featureEntity.aperture = fields['aperture'];
    featureEntity.firedNumber = fields['firedNumber'];
    featureEntity.remark = fields['remark'];
    featureEntity.remark1 = fields['remark1'];
    featureEntity.remark2 = fields['remark2'];
    featureEntity.remark3 = fields['remark3'];
    featureEntity.remark4 = fields['remark4'];
    featureEntity.remark5 = fields['remark5'];
    featureEntity.remark6 = fields['remark6'];
    featureEntity.remark7 = fields['remark7'];
    featureEntity.createUserId = param['userId'];

    if (!fileIsEmpty && attResponseData?.id) {
      featureEntity.attachmentId = attResponseData?.id;
      featureEntity.attachmentName = attResponseData?.oldName;
      featureEntity.attachmentPath = attResponseData?.path;
    }

    // await this.modifyBefore(featureSaveData, "add");
    const featureRes = await queryRunner.manager.insert(
      FeatureEntity,
      featureEntity
    );
    // await this.modifyAfter(featureSaveData, "add");
    const [featureResMap] = featureRes.generatedMaps;
    const featureResponseData = {
      ...featureEntity,
      id: featureResMap.id,
      createTime: featureResMap.updateTime,
      updateTime: featureResMap.updateTime,
    };
    return {
      feature: featureResponseData,
      attachment: attResponseData,
    };
  }

  /**
   * 自定义实现update
   *
   * 修改时，需要同时保存信号特征信息和上传的示波器文件数据，故重新实现update方法；
   */
  @CoolTransaction({ isolation: 'SERIALIZABLE' })
  async update(param, queryRunner?: QueryRunner) {
    const { fields } = this.ctx;
    const fileCode = fields.fileCode;
    const featureList = await this.findFeatureByFileCode(fileCode);
    if (featureList && featureList.length > 1) {
      throw new CoolValidateException(`文件编号“${fileCode}”已存在，请检查！`);
    }

    let attResponseData = undefined;
    const fileIsEmpty = _.isEmpty(this.ctx.files);
    if (!fileIsEmpty) {
      // 保存文件
      const path: string = <string>await this.coolFile.upload(this.ctx);
      const file = this.ctx.files[0];

      const parsedData: object = await this.readCSV(file.data);

      const extension = file.filename.split('.').pop();

      const attachmentEntity = new AttachmentEntity();
      attachmentEntity.name = fields['key'] || `${uuid()}.${extension}`;
      attachmentEntity.oldName = file.filename; // 含后缀名
      attachmentEntity.path = path.replace(this.config.domain, '');
      attachmentEntity.size = fields['fileSize'];
      attachmentEntity.type = file.mimeType;
      attachmentEntity.createUserId = param.userId;
      attachmentEntity.data = parsedData;

      // await this.modifyBefore(attachmentEntity, "update");
      const attRes = await queryRunner.manager.insert(
        AttachmentEntity,
        attachmentEntity
      );
      // await this.modifyAfter(attachmentEntity, "update");
      const [attResMap] = attRes.generatedMaps;
      attResponseData = {
        ...attachmentEntity,
        id: attResMap.id,
        createTime: attResMap.createTime,
        updateTime: attResMap.updateTime,
        deleted: attResMap.deleted,
      };
    }

    const featureEntity = new FeatureEntity();
    featureEntity.id = fields['id'];
    // featureEntity.fileCode = fields['fileCode'] || null; // 文件编号不允许修改
    featureEntity.gunType = fields['gunType'] || null;
    featureEntity.gunCode = fields['gunCode'] || null;
    featureEntity.gunLifespan = fields['gunLifespan'] || null;
    featureEntity.externalPlugIn = fields['externalPlugIn'] || null;
    featureEntity.signalSource = fields['signalSource'] || null;
    featureEntity.installPosition = fields['installPosition'] || null;
    featureEntity.installDirection = fields['installDirection'] || null;
    featureEntity.connectionMethod = fields['connectionMethod'] || null;
    featureEntity.action = fields['action'] || null;
    featureEntity.aperture = fields['aperture'] || null;
    featureEntity.firedNumber = fields['firedNumber'] || null;
    featureEntity.remark = fields['remark'] || null;
    featureEntity.remark1 = fields['remark1'] || null;
    featureEntity.remark2 = fields['remark2'] || null;
    featureEntity.remark3 = fields['remark3'] || null;
    featureEntity.remark4 = fields['remark4'] || null;
    featureEntity.remark5 = fields['remark5'] || null;
    featureEntity.remark6 = fields['remark6'] || null;
    featureEntity.remark7 = fields['remark7'] || null;
    featureEntity.data = fields['data'] || null;
    featureEntity.updateUserId = param['userId'] || null;

    // 修改前的示波器文件信息
    featureEntity.attachmentId = fields['attachmentId'] || null;
    featureEntity.attachmentName = fields['attachmentName'] || null;
    featureEntity.attachmentPath = fields['attachmentPath'] || null;

    // 新上传的示波器文件信息
    if (!fileIsEmpty && attResponseData?.id) {
      featureEntity.attachmentId = attResponseData?.id || null;
      featureEntity.attachmentName = attResponseData?.oldName || null;
      featureEntity.attachmentPath = attResponseData?.path || null;
    }

    // TODO: 修改时，删除示波器文件，但是没有重新上传

    // await this.modifyBefore(featureEntity, "update");
    // conflictPaths skipUpdateIfNoValuesChanged upsertType
    // const featureRes = await queryRunner.manager.upsert(FeatureEntity, featureSaveData, ['', '', 'primary-key'])
    const featureRes = await queryRunner.manager.update(
      FeatureEntity,
      featureEntity.id,
      featureEntity
    );
    // await this.modifyAfter(featureEntity, "update");
    const [featureResMap] = featureRes.generatedMaps;
    const featureResponseData = {
      ...featureEntity,
    };
    if (featureResMap) {
      featureResponseData['id'] = featureResMap.id;
      featureResponseData['createTime'] = featureResMap.updateTime;
      featureResponseData['updateTime'] = featureResMap.updateTime;
    }
  }

  /**
   * 判断“文件编号”是否重复
   * @param fileCode
   */
  async findFeatureByFileCode(fileCode) {
    return await this.featureEntity.findBy({ fileCode: fileCode });
  }

  /**
   * 解析csv文件
   * @param filePath
   */
  async readCSV(filePath: string): Promise<object> {
    const csvFile = fs.readFileSync(filePath);
    const csvData = csvFile.toString();
    return new Promise(resolve => {
      Papa.parse(csvData, {
        header: true,
        complete: results => {
          console.log('readCSV Complete', results.data.length, 'records.');
          resolve(results.data);
        },
      });
    });
  }
}
