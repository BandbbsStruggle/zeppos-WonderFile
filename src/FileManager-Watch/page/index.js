__$$hmAppManager$$__.currentApp.current.module = DeviceRuntimeCore.Page({
        onInit(param) {

          hmUI.createWidget(hmUI.widget.FILL_RECT, {
            x: 0,
            y: 0,
            w: 480,
            h: 780,
            color: 0x0//颜色，十六进制
          })
        hmUI.createWidget(hmUI.widget.TEXT, {
          x: 163,
          y: 60,
          w: 154,
          h: 59,
          align_h: hmUI.align.CENTER_H,
          text_size: 44.44,
          color: '#D9D9D9',
          text: '小程序',
          show_level: hmUI.show_level.ONLY_NORMAL
        })
    
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: 40,
          y: 150,
          w: 192,
          h: 91,
          radius: 21.33,//圆角
          color: 0xFFFFFF,//颜色，十六进制
          text_size: 31.11,
          normal_color: 0x2E7DF6,//一般按钮色
          press_color: 0x87CEFA,//按压按钮色
          text: '文件管理',//文字
          click_func: () => {//回调，触发事件
            hmApp.gotoPage({
              url: "page/file_main_page",
              param: ""
            });
          }
        });
        //--------------------------------------------------------
        hmUI.createWidget(hmUI.widget.STROKE_RECT, {
          x: 255,
          y: 150,
          w: 192,
          h: 91,
          radius: 21.33,//圆角
          line_width: 4,
          color: 0x2E7DF6//颜色，十六进制
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
          text: '小程序列表'
        });
    
        //---------------------------------------
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
          src: "App_list.png"
        });
    
        hmUI.createWidget(hmUI.widget.TEXT, {
          x: -10,
          y: 358,
          w: 288,
          h: 46,
          color: 0xFFFFFF,
          text_size: 31.11,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          text_style: hmUI.text_style.NONE,
          text: '小程序排列'
        }).addEventListener(hmUI.event.CLICK_UP, function (c) {
            hmApp.startApp({
              url: "Settings_applistSortScreen",
              native: true,
            });
          });
        //------------------------------------------------------
    
    
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
          src: "see.png"
        });
        hmUI.createWidget(hmUI.widget.TEXT, {
          x: 210,
          y: 358,
          w: 288,
          h: 46,
          color: 0xFFFFFF,
          text_size: 31.11,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          text_style: hmUI.text_style.NONE,
          text: '隐藏项管理'
        });
        /* .addEventListener(hmUI.event.CLICK_UP, function (c) {
          hmApp.startApp({
            url: "Settings_dndModelScreen",
            native: true,
          });
        }); */
    
        //-------------------------------------
    
    
        hmUI.createWidget(hmUI.widget.FILL_RECT, {
          x: 40,
          y: 450,
          w: 192,
          h: 177.78,
          radius: 21.33,//圆角
          color: 0x202124//颜色，十六进制
        });
        hmUI.createWidget(hmUI.widget.IMG, {
          x: 115,
          y: 480,
          src: "same.png"
        });
    
        hmUI.createWidget(hmUI.widget.TEXT, {
          x: -10,
          y: 548,
          w: 288,
          h: 46,
          color: 0xFFFFFF,
          text_size: 31.11,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          text_style: hmUI.text_style.NONE,
          text: '伪装管理'
        });
        /* .addEventListener(hmUI.event.CLICK_UP, function (c) {
          hmApp.startApp({
            url: "PhoneMuteScreen",
            native: true,
          });
        }); */
        //---------------------------------------
        hmUI.createWidget(hmUI.widget.FILL_RECT, {
          x: 255,
          y: 450,
          w: 192,
          h: 177.78,
          radius: 21.33,//圆角
          color: 0x202124//颜色，十六进制
        }).addEventListener(hmUI.event.CLICK_UP, function (c) {                          
            hmApp.gotoPage({
            url: "page/index.page2",
            param: "..."
            })
        });
        hmUI.createWidget(hmUI.widget.IMG, {
          x: 330,
          y: 480,
          src: "lock.png"
        });
    
        hmUI.createWidget(hmUI.widget.TEXT, {
          x: 210,
          y: 548,
          w: 288,
          h: 46,
          color: 0xFFFFFF,
          text_size: 31.11,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          text_style: hmUI.text_style.NONE,
          text: '锁管理'
        });
        
        //---------------------------------------------------------------
        /* hmUI.createWidget(hmUI.widget.FILL_RECT, {
          x: 4,
          y: 870,
          w: 183,
          h: 150,
          radius: 20,//圆角
          color: 0x2E7DF6//颜色，十六进制
        });
        hmUI.createWidget(hmUI.widget.IMG, {
          x: 20,
          y: 890,
          src: "app_side.png"
        }); */
    
        /* hmUI.createWidget(hmUI.widget.TEXT, {
          x: -50,
          y: 895,
          w: 288,
          h: 130,
          color: 0xFFFFFF,
          text_size: 24,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.CENTER_V,
          text_style: hmUI.text_style.NONE,
          text: '\n小米手环 7\n联网伴生教程'
        })
         .addEventListener(hmUI.event.CLICK_UP, function (c) {
          hmApp.gotoPage({
              url: "page/index2",
              param: ""
            });

          });  */
    
    
    
    
        //-------------------------------------------
        hmUI.createWidget(hmUI.widget.TEXT, {
          x: 156,
          y: 658,
          w: 160.72,
          h: 41,
          color: '#D9D9D9',
          text_size: 31,
          align_h: hmUI.align.CENTER_H,
          text_style: hmUI.text_style.NONE,
          text: '关于'
        })
          .addEventListener(hmUI.event.CLICK_UP, function (c) {
            hmApp.gotoPage({
              url: "page/about",
              param: ''
            });
          });
  }
});