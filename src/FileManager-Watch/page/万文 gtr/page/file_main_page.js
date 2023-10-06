Page({
    onInit(param) {
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 163,
          y: 60,
          w: 154,
          h: 59,
          align_h: hmUI.align.CENTER_H,
          text_size: 44.44,
            text_size: 37,
            color: 16777215,
            text: '文件',
            show_level: hmUI.show_level.ONLY_NORMAL
        });
        hmUI.createWidget(hmUI.widget.BUTTON, {
            x: 40,
          y: 150,
          w: 192,
          h: 91,
          radius: 21.33,//圆角
          text_size: 31.11,
            color: 0,
            text_size: 27,
            normal_color: 14740223,
            press_color: 8900346,
            text: '小程序管理',
            click_func: () => {
                hmApp.gotoPage({
                    url: 'page/AppListScreen',
                    param: '...'
                });
            }
        });
        
        hmUI.createWidget(hmUI.widget.STROKE_RECT, {
            x: 255,
            y: 150,
            w: 192,
            h: 91,
            radius: 21.33,//圆角
            line_width: 4,
            color: 14740223//颜色，十六进制
          });
          hmUI.createWidget(hmUI.widget.TEXT, {
            x: 260,
            y: 172,
            w: 182,
            h: 80,
            color: 0xffffff,
            text_size: 31.11,
            align_h: hmUI.align.CENTER_H,
            text_style: hmUI.text_style.NONE,
            text: '文件列表'
          }).addEventListener(hmUI.event.CLICK_UP, function (c) {
            hmApp.gotoPage({
                url: 'page/gtr3-pro/FileManagerScreen',
                param: '...'
            });
        });
        hmUI.createWidget(hmUI.widget.FILL_RECT, {
            x: 40,
            y: 256,
            w: 192,
            h: 177.78,
            radius: 21.33,//圆角
            color: 0x202124//颜色，十六进制
          })
        hmUI.createWidget(hmUI.widget.IMG, {
            x: 115,
          y: 290,
            src: 'cloud.png'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            color: 14740223,
            text_size: 26,
            x: -10,
          y: 358,
          w: 288,
          h: 46,
          text_size: 31.11,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          text_style: hmUI.text_style.NONE,
            text: '修复"天气"'
        }).addEventListener(hmUI.event.CLICK_UP, function (c) {
            hmApp.startApp({
                url: 'WeatherScreen',
                native: true
            });
        });
        
        
        hmUI.createWidget(hmUI.widget.FILL_RECT, {
            x: 40,
          y: 450,
          w: 394.22,
          h: 133.33,
          radius: 21.33,//圆角
          color: 2105636//颜色，十六进制
        });
        hmUI.createWidget(hmUI.widget.IMG, {
            x: 80,
            y: 488,
            src: 'cc.png'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 85,
            y: 490,
            w: 288,
            h: 46,
            color: 14740223,
            text_size: 31.11,
            align_h: hmUI.align.CENTER_H,
            align_v: hmUI.align.CENTER_V,
            text_style: hmUI.text_style.NONE,
            text: '存储用量'
        }).addEventListener(hmUI.event.CLICK_UP, function (c) {
            hmApp.gotoPage({
                url: 'page/Storage',
                param: '...'
            });
        });
        hmUI.createWidget(hmUI.widget.FILL_RECT, {
            x: 255,
          y: 256,
          w: 192,
          h: 177.78,
          radius: 21.33,//圆角
          color: 0x202124//颜色，十六进制
        });
        hmUI.createWidget(hmUI.widget.IMG, {
            x: 330,
          y: 290,
            src: 'link.png'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 210,
          y: 358,
          w: 288,
          h: 46,
          color: 14740223,
          text_size: 31.11,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          text_style: hmUI.text_style.NONE,
            text: '无缝换绑'
        }).addEventListener(hmUI.event.CLICK_UP, function (c) {
            hmAPP.gotoPage({
                url: 'page/index2',
                native: true
            });
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 8,
            y: 740,
            w: 182,
            h: 80,
            color: 16777215,
            text_size: 30,
            align_h: hmUI.align.CENTER_H,
            text_style: hmUI.text_style.NONE,
            text: '关于'
        }).addEventListener(hmUI.event.CLICK_UP, function (c) {
            hmApp.gotoPage({
                url: 'page/',
                param: '...'
            });
        });
    }
});