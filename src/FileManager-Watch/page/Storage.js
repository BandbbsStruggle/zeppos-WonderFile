__$$hmAppManager$$__.currentApp.current.module = DeviceRuntimeCore.Page({
    onInit() {
        const widget = {
            TEXT: hmUI.widget.TEXT,
            BUTTON: hmUI.widget.BUTTON,
            ARC: hmUI.widget.ARC,
            FILL_RECT: hmUI.widget.FILL_RECT,
            STROKE_RECT: hmUI.widget.STROKE_RECT,
            IMG_ANIM: hmUI.widget.IMG_ANIM,
            CIRCLE: hmUI.widget.CIRCLE,
            QRCODE: hmUI.widget.QRCODE,
            DIALOG: hmUI.widget.DIALOG,
            RADIO_GROUP: hmUI.widget.RADIO_GROUP,
            STATE_BUTTON: hmUI.widget.STATE_BUTTON,
            CHECKBOX_GROUP: hmUI.widget.CHECKBOX_GROUP,
            SLIDE_SWITCH: hmUI.widget.SLIDE_SWITCH,
            HISTOGRAM: hmUI.widget.HISTOGRAM,
            PICK_DAT: hmUI.widget.PICK_DAT,
            POLYLINE: hmUI.widget.FILL_RECT
        };
        function createWidget(widgetType, params) {
            const widgetParams = Object.assign({}, params);
            return hmUI.createWidget(widgetType, widgetParams);
        }

                var stonge = hmSetting.getDiskInfo();
                var total = (stonge.total / 1024 / 1024).toFixed(2);
                var app = ((stonge.total - stonge.free - stonge.system - stonge.watchface) / 1024 / 1024).toFixed(2);
                var face = (stonge.watchface / 1024 / 1024).toFixed(2);
                var system = (stonge.system / 1024 / 1024).toFixed(2);
                var free = (stonge.free / 1024 / 1024).toFixed(2);
                createWidget(widget.ARC, {
                    x: 0,
                    y: 0,
                    w: 480,
                    h: 480,
                    start_angle: -180,
                    end_angle: 180,
                    color: 2236962,
                    line_width: 15
                });
                createWidget(widget.ARC, {
                    x: 0,
                    y: 0,
                    w: 480,
                    h: 480,
                    start_angle: 180,
                    end_angle: (-180 + (Number(app) + Number(system) + Number(face)) / total * 180).toFixed(0) * 1.5,
                    color: 6920447,
                    line_width: 15
                });
                createWidget(widget.ARC, {
                    x: 0,
                    y: 0,
                    w: 480,
                    h: 480,
                    start_angle: 140,
                    end_angle: (-180 + (Number(app) + Number(system)) / total * 180).toFixed(0) * 1.5,
                    color: 9415679,
                    line_width: 15
                });
                createWidget(widget.ARC, {
                    x: 0,
                    y: 0,
                    w: 480,
                    h: 480,
                    start_angle: 120,
                    end_angle: (-180 + system / total * 180).toFixed(0) * 1.5,
                    color: 13358335,
                    line_width: 15
                });
                createWidget(widget.TEXT, {
                    x: 151,
                    y: 60,
                    w: 190,
                    h: 59,
                    color: '#D9D9D9',
                    text: '存储用量',
                    text_size: 44.44
                });
                createWidget(widget.TEXT, {
                    x: 260,
                    y: 300,
                    w: 152,
                    h: 36,
                    color: 14277081,
                    text: '剩余',
                    text_size: 30
                });
                createWidget(widget.TEXT, {
                    x: 260,
                    y: 340,
                    w: 152,
                    h: 36,
                    color: 14277081,
                    text: free +  'MB',
                    text_size: 26
                });
                createWidget(widget.TEXT, {
                    x: 260,
                    y: 190,
                    w: 152,
                    h: 148,
                    color: 13358335,
                    text: '系统固件',
                    text_size: 30
                });
                createWidget(widget.TEXT, {
                    x: 260,
                    y: 230,
                    w: 152,
                    h: 36,
                    color: 14277081,
                    text: system + ' MB',
                    text_size: 26
                });
                createWidget(widget.TEXT, {
                    x: 120,
                    y: 190,
                    w: 152,
                    h: 40,
                    color: 9415679,
                    text: '小程序',
                    text_size: 30
                });
                createWidget(widget.TEXT, {
                    x: 110,
                    y: 230,
                    w: 152,
                    h: 36,
                    color: 14277081,
                    text: app + ' MB',
                    text_size: 26
                });
                createWidget(widget.TEXT, {
                    x: 145,
                    y: 300,
                    w: 152,
                    h: 148,
                    color: 6920447,
                    text: '表盘',
                    text_size: 30
                });
                createWidget(widget.TEXT, {
                    x: 110,
                    y: 340,
                    w: 152,
                    h: 36,
                    color: 14277081,
                    text: face + ' MB',
                    text_size: 26
                });
                createWidget(widget.TEXT, {
                    x: 120,
                    y: 120,
                    w: 260,
                    h: 35,
                    color: '#D9D9D9',
                    text: `${total - free} MB / ${total} MB`,
                    text_size: 26.67
                });
                createWidget(widget.TEXT, {
                    x: 213,
                    y: 401,
                    w: 54,
                    h: 35,
                    color: 14277081,
                    text: (100 - Number(free) / total * 100).toFixed(0) + '%',
                    text_size: 26.67
                });

    }
});