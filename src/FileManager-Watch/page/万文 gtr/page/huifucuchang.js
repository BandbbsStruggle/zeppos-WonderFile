
try {
  (() => {
  
const __$$app$$__ = __$$hmAppManager$$__.currentApp;

function getApp() {
  return __$$app$$__.app;
}

function getCurrentPage() {
  return __$$app$$__.current && __$$app$$__.current.module;
}

const __$$module$$__ = __$$app$$__.current;
const h = new DeviceRuntimeCore.WidgetFactory(new DeviceRuntimeCore.HmDomApi(__$$app$$__, __$$module$$__));
const { px } = __$$app$$__.__globals__;
__$$app$$__.__globals__.gettext;
try {
    __$$module$$__.module = DeviceRuntimeCore.Page({
        onInit(param) {
            try {
                hmUI.setLayerScrolling(false);
                hmApp.setScreenKeep(true);
                const language = hmSetting.getLanguage();
                if (language == 0 || language == 1) {
                    var language_title_text = '保数据出厂';
                    var language_kg1 = '环管保数据出厂';
                    var language_tj1 = '在不删除任何文件\n的情况下\n\u201C以旧换新\u201C您的手环';
                    var language_an_text = '立即恢复';
                    var language_xfcg = '保数据出厂成功\n请重启';
                    var language_xyjzb = '此功能为捐赠版功能\n请先激活软件';
                    var language_cq = '重启';
                    var language_qd = '确定';
                } else {
                    var language_title_text = 'Forced repair';
                    var language_kg1 = 'Forced repair';
                    var language_tj1 = 'This function can\nkeep data factory\n"Trade-in" your bracelet';
                    var language_an_text = 'Fix it';
                    var language_xfcg = 'Forced repair success\nPlease reboot your MiBand';
                    var language_xyjzb = 'This function is a donation version function\nplease activate the software first';
                    var language_cq = 'Reboot';
                    var language_qd = 'OK';
                }
                const button_pos_x = 21;
                const button_size_w = 150;
                const button_size_h = 70;
                var zt = hmFS.SysProGetChars('Band_Manager_Pro_zt');
                if (zt == undefined) {
                    hmFS.SysProSetChars('Band_Manager_Pro_zt', '0');
                    zt = '0';
                }
                if (zt == '1') {
                    var zyaj_normal_color = 0;
                    var zyaj_press_color = 2500134;
                } else {
                    var zyaj_normal_color = 2500134;
                    var zyaj_press_color = 1052688;
                }
                var base64 = new Base64();
                var sbm_path1 = '/storage/js_apps/data/list_apps_data_hg.dat';
                var sbm_path2 = sbm_path1.toString().replace('/storage/', '../../../../../');
                try {
                    var sbm = readFileSync_asset(sbm_path2);
                    if (sbm == 'notfile') {
                        var jhzt = '-1';
                    } else {
                        var sbm = jxsbm(sbm);
                        sbm = base64.decode(sbm);
                        var xlh = readFileSync('Band_Manager_Pro_xlh_2.0.0.txt');
                        if (xlh == 'notfile') {
                            jhzt = '0';
                        } else {
                            xlh = Math.floor(xlh);
                            var yzsxlh = xlh * 3 + 838;
                            yzsxlh = yzsxlh * 83 * 5542 * 9 * 83;
                            yzsxlh = yzsxlh - 353962952;
                            yzsxlh = yzsxlh * 5;
                            if (yzsxlh.toString() == sbm) {
                                jhzt = '1';
                            } else {
                                if (yzxlh(xlh.toString()) == true) {
                                    jhzt = '2';
                                } else {
                                    jhzt = '0';
                                }
                            }
                        }
                    }
                } catch (err) {
                    jhzt = '0';
                }
                if (jhzt == '-1') {
                    hmApp.goBack();
                }
                var title_background = hmUI.createWidget(hmUI.widget.FILL_RECT, {
                    x: 0,
                    y: 0,
                    w: 192,
                    h: 60,
                    radius: 0,
                    color: zyaj_normal_color
                });
                var title_text = hmUI.createWidget(hmUI.widget.TEXT, {
                    x: 40,
                    y: 0,
                    w: 112,
                    h: 70,
                    color: 16777215,
                    text_size: 20,
                    align_h: hmUI.align.CENTER_H,
                    align_v: hmUI.align.CENTER_V,
                    text_style: hmUI.text_style.NONE,
                    text: language_title_text
                });
                const text = hmUI.createWidget(hmUI.widget.TEXT, {
                    x: 5,
                    y: 65,
                    w: 182,
                    h: 30,
                    color: 16777215,
                    text_size: 20,
                    align_h: hmUI.align.CENTER_H,
                    align_v: hmUI.align.CENTER_V,
                    text_style: hmUI.text_style.NONE,
                    text: language_kg1
                });
                const an1 = hmUI.createWidget(hmUI.widget.BUTTON, {
                    x: button_pos_x,
                    y: 100,
                    w: button_size_w,
                    h: button_size_h,
                    radius: 12,
                    normal_color: 31436,
                    press_color: 23216,
                    text_size: 25,
                    text: language_an_text,
                    click_func: () => {
                        zdxf();
                    }
                });
                const text2 = hmUI.createWidget(hmUI.widget.TEXT, {
                    x: 5,
                    y: 185,
                    w: 182,
                    h: 150,
                    color: 16777215,
                    text_size: 20,
                    align_h: hmUI.align.CENTER_H,
                    align_v: hmUI.align.CENTER_V,
                    text_style: hmUI.text_style.ELLIPSIS,
                    text: language_tj1
                });
                function jxsbm(str) {
                    str_jy = str[0] + str[1] + str[2];
                    if (str_jy !== '200') {
                        return 'error';
                    }
                    var sbm_jx = '';
                    for (let i = 0; i < str.length; i++) {
                        if (i >= 3) {
                            sbm_jx += str[i];
                        }
                    }
                    return sbm_jx;
                }
                function zdxf() {
                    if (jhzt == '1') {
                        hmFS.remove('/storage/sysprop_default');
                        hmApp.registerGestureEvent(function (RIGHT) {
                            return true;
                        });
                        finishShow(language_xfcg, 1);
                    } else {
                        finishShow(language_xyjzb, 0);
                    }
                }
                function finishShow(te, cg) {
                    title_background.setProperty(hmUI.prop.VISIBLE, false);
                    title_text.setProperty(hmUI.prop.VISIBLE, false);
                    text.setProperty(hmUI.prop.VISIBLE, false);
                    an1.setProperty(hmUI.prop.VISIBLE, false);
                    text2.setProperty(hmUI.prop.VISIBLE, false);
                    hmUI.createWidget(hmUI.widget.TEXT, {
                        x: 0,
                        y: 65,
                        w: 192,
                        h: 180,
                        color: 16777215,
                        text_size: 25,
                        align_h: hmUI.align.CENTER_H,
                        align_v: hmUI.align.CENTER_V,
                        text_style: hmUI.text_style.WRAP,
                        text: te
                    });
                    if (cg == 1) {
                        hmUI.createWidget(hmUI.widget.BUTTON, {
                            x: button_pos_x,
                            y: 380,
                            w: button_size_w,
                            h: button_size_h,
                            radius: 12,
                            normal_color: 31436,
                            press_color: 23216,
                            text_size: 20,
                            text: language_cq,
                            click_func: () => {
                                hmApp.unregisterGestureEvent();
                                hmFS.SysProSetBool('index_tc', false);
                                hmApp.startApp({
                                    url: 'Settings_systemScreen',
                                    native: true
                                });
                            }
                        });
                    } else {
                        hmUI.createWidget(hmUI.widget.BUTTON, {
                            x: button_pos_x,
                            y: 380,
                            w: button_size_w,
                            h: button_size_h,
                            radius: 12,
                            normal_color: zyaj_normal_color,
                            press_color: zyaj_press_color,
                            text_size: 20,
                            text: language_qd,
                            click_func: () => {
                                hmFS.SysProSetBool('index_tc', true);
                                hmApp.goBack();
                            }
                        });
                    }
                }
                function yzxlh(str) {
                    try {
                        var yzsz = str.toString();
                        yzsz = yzsz[0] + yzsz[2] + yzsz[5];
                        yzsz = Math.floor(yzsz);
                        if (str != '000000')
                            if (yzsz % 7 == 0)
                                if (Math.floor(str) % 4 == 0)
                                    return true;
                        return false;
                    } catch (error) {
                        return false;
                    }
                }
                function Base64() {
                    _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                    this.encode = function (input) {
                        var output = '';
                        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                        var i = 0;
                        input = _utf8_encode(input);
                        while (i < input.length) {
                            chr1 = input.charCodeAt(i++);
                            chr2 = input.charCodeAt(i++);
                            chr3 = input.charCodeAt(i++);
                            enc1 = chr1 >> 2;
                            enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                            enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                            enc4 = chr3 & 63;
                            if (isNaN(chr2)) {
                                enc3 = enc4 = 64;
                            } else if (isNaN(chr3)) {
                                enc4 = 64;
                            }
                            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
                        }
                        return output;
                    };
                    this.decode = function (input) {
                        var output = '';
                        var chr1, chr2, chr3;
                        var enc1, enc2, enc3, enc4;
                        var i = 0;
                        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
                        while (i < input.length) {
                            enc1 = _keyStr.indexOf(input.charAt(i++));
                            enc2 = _keyStr.indexOf(input.charAt(i++));
                            enc3 = _keyStr.indexOf(input.charAt(i++));
                            enc4 = _keyStr.indexOf(input.charAt(i++));
                            chr1 = enc1 << 2 | enc2 >> 4;
                            chr2 = (enc2 & 15) << 4 | enc3 >> 2;
                            chr3 = (enc3 & 3) << 6 | enc4;
                            output = output + String.fromCharCode(chr1);
                            if (enc3 != 64) {
                                output = output + String.fromCharCode(chr2);
                            }
                            if (enc4 != 64) {
                                output = output + String.fromCharCode(chr3);
                            }
                        }
                        output = _utf8_decode(output);
                        return output;
                    };
                    _utf8_encode = function (string) {
                        string = string.replace(/\r\n/g, '\n');
                        var utftext = '';
                        for (var n = 0; n < string.length; n++) {
                            var c = string.charCodeAt(n);
                            if (c < 128) {
                                utftext += String.fromCharCode(c);
                            } else if (c > 127 && c < 2048) {
                                utftext += String.fromCharCode(c >> 6 | 192);
                                utftext += String.fromCharCode(c & 63 | 128);
                            } else {
                                utftext += String.fromCharCode(c >> 12 | 224);
                                utftext += String.fromCharCode(c >> 6 & 63 | 128);
                                utftext += String.fromCharCode(c & 63 | 128);
                            }
                        }
                        return utftext;
                    };
                    _utf8_decode = function (utftext) {
                        var string = '';
                        var i = 0;
                        var c = c1 = c2 = 0;
                        while (i < utftext.length) {
                            c = utftext.charCodeAt(i);
                            if (c < 128) {
                                string += String.fromCharCode(c);
                                i++;
                            } else if (c > 191 && c < 224) {
                                c2 = utftext.charCodeAt(i + 1);
                                string += String.fromCharCode((c & 31) << 6 | c2 & 63);
                                i += 2;
                            } else {
                                c2 = utftext.charCodeAt(i + 1);
                                c3 = utftext.charCodeAt(i + 2);
                                string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                                i += 3;
                            }
                        }
                        return string;
                    };
                }
                function statSync(filename) {
                    const [fs_stat, err] = hmFS.stat(filename);
                    if (err == 0) {
                        return fs_stat;
                    } else {
                        return null;
                    }
                }
                function statSync_asset(filename) {
                    const [fs_stat, err] = hmFS.stat_asset(filename);
                    if (err == 0) {
                        return fs_stat;
                    } else {
                        return null;
                    }
                }
                function readFileSync(filename) {
                    const fs_stat = statSync(filename);
                    if (!fs_stat)
                        return 'notfile';
                    const destination_buf = new Uint8Array(fs_stat.size);
                    const file = hmFS.open(filename, hmFS.O_RDONLY);
                    hmFS.seek(file, 0, hmFS.SEEK_SET);
                    hmFS.read(file, destination_buf.buffer, 0, fs_stat.size);
                    hmFS.close(file);
                    const content = ab2str(destination_buf.buffer);
                    return content;
                }
                function readFileSync_asset(filename) {
                    const fs_stat = statSync_asset(filename);
                    if (!fs_stat)
                        return 'notfile';
                    const destination_buf = new Uint8Array(fs_stat.size);
                    const file = hmFS.open(filename, hmFS.O_RDONLY);
                    hmFS.seek(file, 0, hmFS.SEEK_SET);
                    hmFS.read(file, destination_buf.buffer, 0, fs_stat.size);
                    hmFS.close(file);
                    const content = ab2str(destination_buf.buffer);
                    return content;
                }
                function ab2str(buf) {
                    var u16 = new Uint16Array(buf);
                    for (let i = 0; i < u16.length; i++) {
                        u16[i] = (u16[i] + 13) / 3;
                    }
                    return String.fromCharCode.apply(null, u16);
                }
            } catch (error) {
                hmApp.goBack();
            }
        }
    });
} catch (error) {
    __$$module$$__.module = DeviceRuntimeCore.Page({
        build() {
            try {
                hmApp.goBack();
            } catch (error) {
            }
        }
    });
}

  })()
} catch(e) {
  
console.log('Mini Program Error', e)
e && e.stack && e.stack.split(/\n/).forEach(i => console.log("error stack", i))

/* todo */
}