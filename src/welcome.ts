import { App, Controller, Get, Inject } from '@midwayjs/decorator';
import { Context, Application } from '@midwayjs/koa';

/**
 * 欢迎界面
 */
@Controller('/')
export class WelcomeController {
  @Inject()
  ctx: Context;

  @App()
  app: Application;

  @Get('/')
  public async welcome() {
    await this.ctx.render('welcome', {
      text: '特征信号知识图谱系统-服务端',
    });
  }
}
