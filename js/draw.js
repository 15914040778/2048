

/**
 * 全局状态管理器
 */
export default class Draw {


  constructor(ctx, c) {
    this.ctx = ctx;
    this.c = c;
  }

  draw(x, y, n, r, background){
    var i, ang;
    ang = Math.PI * 2 / n;
    this.ctx.save();
    this.ctx.fillStyle = background;
    // if (selected == 1) {
    //   this.ctx.strokeStyle = 'hsl(120,50%,50%)';
    // }
    //
    this.ctx.lineWidth = 1;
    this.ctx.translate(x, y);
    this.ctx.x = x;
    this.ctx.y = y;
    this.ctx.moveTo(0, -r);
    this.ctx.beginPath();
    for (i = 0; i < n; i++) {
      this.ctx.rotate(ang);
      this.ctx.lineTo(0, -r);
    }
    this.ctx.c = this.c;
    //绘制一条路径，形式是字母 L，然后绘制线条以返回开始点
    this.ctx.closePath();
    //填充颜色
    this.ctx.fill();
    //绘制一条路径，形状是绿色的字母 L
    this.ctx.stroke();
    this.ctx.restore();
    this.c++;
    return this.ctx;
  }
  /*
  
  */
  draw_new(x, y, n, r, background, int)
  {
    var i, ang;
    ang = Math.PI * 2 / n;
    this.ctx.save();
    this.ctx.fillStyle = background;
    // if (selected == 1) {
    //   this.ctx.strokeStyle = 'hsl(120,50%,50%)';
    // }
    //
    this.ctx.lineWidth = 1;
    this.ctx.translate(x, y);
    this.ctx.x = x;
    this.ctx.y = y;
    this.ctx.moveTo(0, -r);
    this.ctx.beginPath();
    for (i = 0; i < n; i++) {
      this.ctx.rotate(ang);
      this.ctx.lineTo(0, -r);
    }
    this.ctx.c = this.c;
    //绘制一条路径，形式是字母 L，然后绘制线条以返回开始点
    this.ctx.closePath();
    //填充颜色
    this.ctx.fill();


    //设置颜色
    this.ctx.fillStyle = "#ff0";
    // 设置字体
    this.ctx.font = "18px bold 黑体";
    // 设置水平对齐方式
    this.ctx.textAlign = "center";
    // 设置垂直对齐方式
    this.ctx.textBaseline = "middle";
    // 绘制文字（参数：要写的字，x坐标，y坐标）

    this.ctx.fillText(int, r / 2 - 9, r / 2 - 9);
    //绘制一条路径，形状是绿色的字母 L
    this.ctx.stroke();
    this.ctx.restore();
    this.c++;
    return this.ctx;
  }
}