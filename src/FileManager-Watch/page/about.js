__$$hmAppManager$$__.currentApp.current.module = DeviceRuntimeCore.Page({
    onInit() {
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 163,
          y: 60,
          w: 180,
          h: 59,
          align_h: hmUI.align.CENTER_H,
          text_size: 44.44,
          color: '#D9D9D9',
          text: '万文管理',
          show_level: hmUI.show_level.ONLY_NORMAL
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 140,
            y: 115.85,
            w: 240,
            h: 111,
            color: '#D9D9D9',
            text_size: 26,
            text: 'V4.6.1 for Zepp OS'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 198.5,
            y: 172,
            w: 83,
            h: 42,
            color: '#FFFFFF',
            text_size: 30,
            text: 'QQ群'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 132.11,
            y: 224.89,
            w: 240,
            h: 111,
            color: 16777215,
            text_size: 26,
            text: 'A 群      733271117\nB 群      623766175'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 208,
            y: 336,
            w: 64,
            h: 42,
            color: 16777215,
            text_size: 30,
            text: '论坛'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 113.33,
            y: 388.89,
            w: 264,
            h: 76,
            color: 16777215,
            text_size: 28.44,
            text: 'wear.rexwe.net/\nWonderFIle-ZeppOS'
        });
        hmUI.createWidget(hmUI.widget.IMG, {
            x: 34.22,
            y: 464.44,
            src: 'ewm.png'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 154,
            y: 861.78,
            w: 200,
            h: 111,
            color: 16777215,
            text_size: 32,
            text: 'BilBil 账户'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 116.11,
            y: 939.56,
            w: 280,
            h: 76,
            color: 16777215,
            text_size: 28.44,
            text: 'space.bilibili.com/\n3493279255497074'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 148,
            y: 1437.33,
            w: 184,
            h: 42,
            color: 16777215,
            text_size: 30,
            text: 'GitHub 开源'
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 66.83,
            y: 357,
            w: 1490.22,
            h: 38,
            color: 16777215,
            text_size: '28.44px',
            text: 'wear.rexwe.net/\nthreads/135'
        });
        hmUI.createWidget(hmUI.widget.FILL_RECT, {
            x: 40,
          y: 1800,
          w: 394.22,
          h: 133.33,
          radius: 21.33,//圆角
          color: 2105636//颜色，十六进制
        }).addEventListener(hmUI.event.CLICK_UP, function (c) {
            gotoPage({
                url: 'page/HomePage/index4',
                native: true
            });
        });
        hmUI.createWidget(hmUI.widget.IMG, {
            x: 80,
            y: 1832,
            src: 'lock.png'
        }).addEventListener(hmUI.event.CLICK_UP, function (c) {
            gotoPage({
                url: 'page/HomePage/index4',
                native: true
            });
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 85,
            y: 1832,
            w: 288,
            h: 46,
            color: 16777215,
            text_size: 31.11,
            align_h: hmUI.align.CENTER_H,
            align_v: hmUI.align.CENTER_V,
            text_style: hmUI.text_style.NONE,
            text: '开发致谢'
        }).addEventListener(hmUI.event.CLICK_UP, function (c) {
            hmApp.gotoPage({
                url: 'page/code_about',
                param: '...'
            });
        });
        hmUI.createWidget(hmUI.widget.STROKE_RECT, {
            x: 200,
            y: 1200,
            w: 2,
            h: 1,
            radius: 20,
            line_width: 4,
            color: 16542032
        });
    }
});