export function statSync(filename) {
    const [fs_stat, err] = hmFS.stat(filename);
    if (err == 0) {
        return fs_stat;
    } else {
        return null;
    }
}
export function statSync_asset(filename) {
    const [fs_stat, err] = hmFS.stat_asset(filename);
    if (err == 0) {
        return fs_stat;
    } else {
        return null;
    }
}
export function stringToUTF8Array(str) {
    if (!str)
        return false;
    let result = [];
    for (let i = 0, j = str.length; i < j; i++) {
        let code = str.charCodeAt(i);
        if (code <= 0x7f) {
            result.push(code);
        } else if (code <= 0x7ff) {
            result.push((0xC0 | (0x1F & (code >> 6))));
            result.push((0x80 | (0x3F & code)));
        } else if (code <= 0xffff) {
            result.push((0xE0 | (0x0F & (code >> 12))));
            result.push((0x80 | (0x3F & (code >> 6))));
            result.push((0x80 | (0x3F & code)));
        } else {
            return false;
        }
    }
    return Uint8Array.from(result);
}
export function utf8ArrayToString(array) {
    if (!array)
        return false;
    let result = "";
    for (let i = 0, j = array.length; i < j; i++) {
        let code = array[i];
        if (code >= 0 && code <= 0x7f) {
            code = (0x7f & code);
        } else if (code <= 0xdf) {
            code = ((0x1F & array[i]) << 6) | (0x3f & array[i + 1]);
            i += 1;
        } else if (code <= 0xef) {
            code = ((0x0f & array[i]) << 12) | ((0x3f & array[i + 1]) << 6) | (0x3f & array[i + 2]);
            i += 2;
        } else {
            return false;
        }
        let char = String.fromCharCode(code);
        result += char;
    }
    return result;
}
export function writeFileSync(filename, data) {
    const source_buf = stringToUTF8Array(data);
    //打开/创建文件
    const file = hmFS.open(filename, hmFS.O_CREAT | hmFS.O_RDWR | hmFS.O_TRUNC);
    //定位到文件开始位置
    hmFS.seek(file, 0, hmFS.SEEK_SET);
    //写入buffer
    hmFS.write(file, source_buf.buffer, 0, source_buf.length);
    //关闭文件
    hmFS.close(file);
}
export function readFileSync(filename) {
    const fs_stat = statSync(filename);
    if (!fs_stat) return 'notfile';
    var size2 = fs_stat.size;
    var e = '';
    var test_buf = new Uint8Array(size2);
    var file = hmFS.open(filename, hmFS.O_RDONLY);
    hmFS.read(file, test_buf.buffer, 0, test_buf.length);
    hmFS.close(file);
    e = utf8ArrayToString(test_buf);
    return e;
}
export function jzxcxmz(ll, app_path2, paths) {
    var size = 160;
    var size2 = ll.size;
    var e = '';
    var test_buf = new Uint8Array(size2);
    var file = hmFS.open(app_path2, hmFS.O_RDONLY);
    hmFS.read(file, test_buf.buffer, 0, test_buf.length);
    hmFS.close(file);
    e = utf8ArrayToString(test_buf);
    var ey = e.toString().replace(/\ +/g, "");
    ey = ey.toString().replace(/[\r\n]/g, "");
    ey = ey.toString().replace(":[]", ":\"[]\"");
    ey = ey.toString().replace(":false", ":\"false\"");
    ey = ey.toString().replace(":true", ":\"true\"");
    ey = ey.toString().replace(":False", ":\"False\"");
    ey = ey.toString().replace(":True", ":\"True\"");
    ey = ey.toString().replace(":None", ":\"None\"");
    ey = ey.toString().replace(":undefined", ":\"undefined\"");
    try {
        var ey_json = JSON.parse(ey);
        if (ey_json['app']["appId"].toString() == '67246'){
            if (language == 0 || language == 1) {
                var ybappname = '万文管理';
            } else {
                var ybappname = 'WonderFileManger';
            }
        }else{
            var ybappname = ey_json['app']["appName"]
            try {
                if (language !== 0 && language !== 1) {
                    ybappname = ey_json['i18n']['en-US']['appName']
                }
            } catch (err) { }
        }
        if (ybappname == undefined){
            ybappname = ey_json['app']["appName"]
        }
        var ysappname = ybappname
        ybappname = ybappname + tjzf
    } catch (err) {
        try {
            let ix3 = ey.toString().lastIndexOf("\"appName");
            e = ey.toString().substring(ix3 + 11, ey.toString().length);
            let ix4 = e.toString().indexOf("\"");
            e = e.toString().substring(0, ix4);
            var ybappname = e;
            var ysappname = appname
            ybappname = ybappname + tjzf;
        } catch (err) {
            return false;
        }
    }
    if (ybappname == undefined) {
        return false;
    }
    return [ybappname, ysappname];
}
export function jzxcxlb() {
    var AppsList = readFileSync('AppsList.txt');
    var AppManger_cache = hmFS.SysProGetBool('AppManger_cache');
    if (AppManger_cache == undefined) {
        AppManger_cache = true
        hmFS.SysProSetBool('AppManger_cache', true);
    }
    var jlysmz = {}
    if (AppsList == 'notfile' || param == '1' || AppManger_cache == false) {
        var n = []
        for (var r = 0; r < js_appsList.length; r++) {
            if (js_appsList[r] != 'data') {
                const paths = js_appsList[r];
                var app_path2 = '../../../../../js_apps/' + js_appsList[r] + '/app.json';
                var fs_stat = statSync_asset(app_path2);
                tjzf = '';
                if (!fs_stat) {
                    app_path2 = '../../../../../js_apps/' + js_appsList[r] + '/app.json.bak';
                    fs_stat = statSync_asset(app_path2);
                    tjzf = ' (' + '隐藏' + ')';
                    if (!fs_stat) continue;
                }
                var lsbl = jzxcxmz(fs_stat, app_path2, paths);
                if (lsbl == false) {
                    continue;
                }
                n.push({
                    text: lsbl[0],
                    icon: "〉",
                    type: 1,
                    path: paths
                });
                //textxg('212')
                jlysmz[lsbl[1]] = '1'
            }
        }
        if (AppManger_cache == true) {
            writeFileSync('AppsList.txt', JSON.stringify(n));
        }
        if (param == '1'){
            hmApp.reloadPage({
                url: 'pages/tools/AppMangerPage',
                param: '0'
            });
            return 'cxjr';
        }
        return n;
    } else {
        //textxg('257')
        return JSON.parse(AppsList);
    }
}