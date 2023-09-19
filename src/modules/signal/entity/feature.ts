import {BaseEntity} from '@cool-midway/core';
import {Column, Entity} from 'typeorm';
import {Rule, RuleType} from "@midwayjs/validate";

/**
 * Q支信号特征信息表
 */
@Entity('biz_firearm_signal_feature')
export class FeatureEntity extends BaseEntity {

    @Rule(RuleType.string().required())
    @Column({comment: '文件编号', unique: true})
    fileCode: string;

    @Rule(RuleType.string().required())
    @Column({comment: 'Q型'})
    gunType: string;

    @Rule(RuleType.string().required())
    @Column({comment: 'Q编号'})
    gunCode: string;

    @Column({comment: 'Q寿命', nullable: true})
    gunLifespan: string;

    @Column({comment: '外挂', nullable: true})
    externalPlugIn: string;

    @Rule(RuleType.string().required())
    @Column({comment: '信号源'})
    signalSource: string;

    @Column({comment: '安装位置', nullable: true})
    installPosition: string;

    @Column({comment: '安装方向', nullable: true})
    installDirection: string;

    @Column({comment: '连接方式', nullable: true})
    connectionMethod: string;

    @Column({comment: '动作', nullable: true})
    action: string;

    @Column({comment: '孔径', nullable: true})
    aperture: string;

    @Column({comment: '射弹数量', nullable: true})
    firedNumber: string;

    @Column({comment: '备注', nullable: true})
    remark: string;

    @Column({comment: '备注1', nullable: true})
    remark1: string;

    @Column({comment: '备注2', nullable: true})
    remark2: string;

    @Column({comment: '备注3', nullable: true})
    remark3: string;

    @Column({comment: '备注4', nullable: true})
    remark4: string;

    @Column({comment: '备注5', nullable: true})
    remark5: string;

    @Column({comment: '备注6', nullable: true})
    remark6: string;

    @Column({comment: '备注7', nullable: true})
    remark7: string;

    @Column({comment: '示波器文件ID', type: 'int', nullable: true})
    attachmentId: number;

    @Column({comment: '示波器文件名称', nullable: true})
    attachmentName: string;

    @Column({comment: '示波器文件可访问地址', nullable: true})
    attachmentPath: string;

    @Column({comment: '示波器csv数据', type: "json", nullable: true})
    data: object;

    @Column({comment: '创建者ID', type: "int", nullable: true})
    createUserId: number;

    @Column({comment: '创建者ID', type: "int", nullable: true})
    updateUserId: number;
}

// id:					        ID
// fileCode:				    文件编号
// gunType:			        Q型
// gunCode:			        Q编号
// gunLifespan:			    Q寿命
// externalPlugIn:		  外挂
// signalSource:			  信号源
// installPosition:		  安装位置
// installDirection:		安装方向
// connectionMethod:	  连接方式
// action:				      动作
// aperture:				    孔径
// firedNumber:			    射弹数量
// remark:				      备注
// remark1:				      备注1
// remark2:				      备注2
// remark3:				      备注3
// remark4:				      备注4
// remark5:				      备注5
// remark6:				      备注6
// remark7:				      备注7
// createTime:			    创建时间
// updateTime:			    更新时间
// attachmentId:        附件ID
// data:                示波器csv数据
