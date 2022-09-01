<template>
<!--画布-->
  <canvas
    v-if="isReady"
    class='myCanvas'
    :canvas-id='canvasId'
    :style="'width:'+width+'px;height:'+height+'px;'">
  </canvas>
<!--画布-->
</template>

<script>
import CanvasPosterSprite from 'canvas-poster-sprite/dist/uni-canvas-poster-sprite';

export default {
  name: 'ctjtcanvas',
  props: {
    // 合成海报参数为参数param
    param: {
      type: Object,
      default() {
        return {
          width: 640, // 画布宽度
          height: 640, // 画布高度
          pics: [], // 图片资源
          paths: {}, // 路径
          texts: [], // 文本
          fileType: 'jpg', // 保存文件类型
          quality: 1, // 保存文件质量
        };
      }
    }
  },
  data() {
    return {
      isReady: false,
      canvasId: 'myCanvasId',
      width: 640, // 海报宽度
      height: 640, // 海报高度
    };
  },
  watch: {
    param: {
      handler() {
        this.setCanvas();
      },
      immediate: true
    }
  },
  methods: {
    setCanvas() {
      const id = Math.random().toString(16).substr(2);
      const canvasId = `myCanvasId_${id}`;
      const { param } = this;
      this.canvasId = canvasId;
      this.width = param.width;
      this.height = param.height;
      this.isReady = true;
      // let pixelRatio = 1;// 设备分辨率
      // const isAndroid = true;
      // if (isAndroid) {
      // android设备，分辨率减低一半，以换取合成速率
      // 测试结果：分辨率：3     合成时间：15s多
      //        分辨率：1.5   合成时间：4.5s多
      //        分辨率：1     合成时间：2.5s多
      // pixelRatio *= 0.5;
      // }
      // 生成海报
      const options = {
        // appPlus: true, // app端，是否先把图片转换成base64，再画图，fix：【Android10 真机 uni.canvasToTempFilePath报错】https://ask.dcloud.net.cn/question/103303
        self: this, // 当前组件实例
        pixelRatio: 1,
        canvasId, // 画布宽度id
        width: param.width, // 画布宽度
        height: param.height, // 画布高度
        pics: param.pics || [], // 图片资源
        texts: param.texts || [], // 文本
        paths: param.paths || {}, // 路径
        bgColor: param.bgColor || 'white',
        fileType: param.fileType || 'jpg',
        quality: param.quality || 1
      };
      let sprite;
      setTimeout(() => {
        sprite = new CanvasPosterSprite(options);
        sprite.then((err, res) => {
          if (err) {
            const ev = {
              tips: '合成海报出错了!',
              err
            };
            this.$emit('fail', ev);
            return;
          }
          const ev = {
            tips: '海报合成成功!',
            res
          };
          this.$emit('success', ev);
        });
      }, 80);
      // end 合成
    }
  }
};
</script>

<style lang="less" scoped>
.myCanvas{
  position: fixed;
  top: 0;
  left: 100%;
  top: 100%;
  z-index: -3;
  transform: translateX(200%);
  -webkit-transform: translateX(200%);
}
</style>
