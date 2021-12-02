export class Log {
  private ctx;
  constructor(ctx: any) {
    this.ctx = ctx;
  }

  info(...data: any) {
    console.info(...data);
  }

  debug(...data: any) {
    if (this.ctx.debug) {
      console.log(...data);
    }
  }
}
