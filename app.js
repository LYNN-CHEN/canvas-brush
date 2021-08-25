class FontPen {
    constructor() {
        this.ctx = null;
        this.canvas = null;
        this.index = 0;
        this.text = "恭喜发财万事如意吉星高照身体健康福寿安康吉祥心想事成平安阖家幸福快乐开心";
        this.isDown = false;
        this.color = "rgb(253,190,0)"
        this.fontSize = 25;
        this.startX = 0;
        this.startY = 0;
        return this;
    }
    setText(str) {
        this.text = str;
        return this;
    }
    init(ctx) {
        this.ctx = ctx;
        let canvas = this.ctx.canvas;
        if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
            canvas.addEventListener("touchstart", this._mouseDown.bind(this), false);
            canvas.addEventListener("touchmove", this._mouseMove.bind(this), false);
            canvas.addEventListener("touchend", this._mouseUp.bind(this), false);
        } else {
            canvas.addEventListener("mousedown", this._mouseDown.bind(this), false)
            canvas.addEventListener("mousemove", this._mouseMove.bind(this), false)
            canvas.addEventListener("mouseup", this._mouseUp.bind(this), false)
            canvas.addEventListener("mouseout", this._mouseUp.bind(this), false)
        }
        return this;
    }
    _mouseDown(event) {
        this.isDown = true;
        // 获取当前鼠标位置并设置为起始位置
        const { offsetX, offsetY } = event;
        console.log('offset', offsetX, offsetY)
        this.startX = offsetX || event.changedTouches[0].clientX;
        this.startY = offsetY || event.changedTouches[0].clientY;
    }
    _mouseMove(event) {
        const { isDown, text, index, ctx, fontSize, color, startX, startY } = this;
        if (!isDown) return;
        let offsetX = event.offsetX || event.changedTouches[0].clientX;
        let offsetY = event.offsetY || event.changedTouches[0].clientY;
        let dx = startX - offsetX;
        let dy = startY - offsetY;
        let d = Math.sqrt(dx ** 2 + dy ** 2);
        let char = text[index];
        // 如果当前鼠标位置小于text宽度的n倍，则不绘制
        if (d < ctx.measureText(char).width*0.8) return;
        //
        let angle = Math.atan2(dy, dx) + Math.PI;
        this.startX = offsetX;
        this.startY = offsetY;

        ctx.fillStyle = color;
        // 设置了随机字体大小
        ctx.font = `bold ${((fontSize-10) * Math.random()) + 10 + d * .3}px 华文仿宋`;
        console.log('font', ((fontSize-10) * Math.random()) + 10 + d * .3)
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.save();
        ctx.translate(offsetX, offsetY);
        //
        // 拐弯的时候字体会跟着旋转
        ctx.rotate(angle);
        ctx.fillText(char, 0, 0);
        ctx.restore();
        this.index += 1;
        this.index %= this.text.length;
    }
    _mouseUp(event) {
        this.isDown = false;
    }
}

const fontPen = new FontPen();

class Application {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.w = 0;
    this.h = 0;
    this.init();
  }
  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    window.addEventListener("resize", this.reset.bind(this));
    this.reset();
    this.render();
  }
  reset() {
    this.w = this.canvas.width = this.ctx.width = window.innerWidth;
    this.h = this.canvas.height = this.ctx.height = window.innerHeight;
  }
  render() {
    const { w, h, ctx } = this;
    this.fontPen = fontPen.init(ctx);
  }
  step(delta) {
    const { w, h, ctx } = this;
    requestAnimationFrame(this.step.bind(this));
    ctx.clearRect(0, 0, w, h);
  }
}

window.onload = new Application();
