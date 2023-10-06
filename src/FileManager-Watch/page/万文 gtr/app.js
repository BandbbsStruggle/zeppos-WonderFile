(() => {
  // ../../../../../opt/zmake/data/zeus_fixes_inject.js
  var __App__ = (config2) => {
    __$$hmAppManager$$__.currentApp.app = DeviceRuntimeCore.App(config2);
  };
  var __getApp = () => {
    return __$$hmAppManager$$__.currentApp.app;
  };

  // lib/mmk/Path.js
  var deviceID = hmSetting.getDeviceInfo().deviceName;
  var isMiBand7 = deviceID === "Xiaomi Smart Band 7";
  var appContext = __getApp();
  var Path = class {
    constructor(scope, path) {
      if (path[0] != "/")
        path = "/" + path;
      this.scope = scope;
      this.path = path;
      if (scope === "assets") {
        this.relativePath = path;
        this.absolutePath = FsTools.fullAssetPath(path);
      } else if (scope === "data") {
        this.relativePath = path;
        this.absolutePath = FsTools.fullDataPath(path);
      } else if (scope === "full") {
        this.relativePath = `../../../${path.substring(9)}`;
        if (this.relativePath.endsWith("/"))
          this.relativePath = this.relativePath.substring(0, this.relativePath.length - 1);
        this.absolutePath = path;
      } else {
        throw new Error("Unknown scope provided");
      }
    }
    get(path) {
      const newPath = this.path === "/" ? path : `${this.path}/${path}`;
      return new Path(this.scope, newPath);
    }
    resolve() {
      return new Path("full", this.absolutePath);
    }
    src() {
      if (this.scope !== "assets")
        throw new Error("Can't get src for non-asset");
      return this.relativePath.substring(1);
    }
    stat() {
      if (this.scope == "data") {
        return hmFS.stat(this.relativePath);
      } else {
        return hmFS.stat_asset(this.relativePath);
      }
    }
    size() {
      const [st, e] = this.stat();
      if (st.size) {
        return st.size;
      }
      let output = 0;
      for (const file of this.list()[0]) {
        output += this.get(file).size();
      }
      return output;
    }
    open(flags) {
      if (this.scope === "data") {
        this._f = hmFS.open(this.relativePath, flags);
      } else {
        this._f = hmFS.open_asset(this.relativePath, flags);
      }
      return this._f;
    }
    remove() {
      if (this.scope === "assets")
        return this.resolve().remove();
      try {
        hmFS.remove(isMiBand7 ? this.absolutePath : this.relativePath);
        return true;
      } catch (e) {
        return false;
      }
    }
    removeTree() {
      const [files, e] = this.list();
      for (let i in files) {
        this.get(files[i]).removeTree();
      }
      this.remove();
    }
    fetch(limit = Infinity) {
      const [st, e] = this.stat();
      if (e != 0)
        return null;
      const length = Math.min(limit, st.size);
      const buffer = new ArrayBuffer(st.size);
      this.open(hmFS.O_RDONLY);
      this.read(buffer, 0, length);
      this.close();
      return buffer;
    }
    fetchText(limit = Infinity) {
      const buf = this.fetch(limit);
      const view = new Uint8Array(buf);
      return FsTools.decodeUtf8(view, limit)[0];
    }
    fetchJSON() {
      return JSON.parse(this.fetchText());
    }
    override(buffer) {
      this.remove();
      this.open(hmFS.O_WRONLY | hmFS.O_CREAT);
      this.write(buffer, 0, buffer.byteLength);
      this.close();
    }
    overrideWithText(text) {
      return this.override(FsTools.strToUtf8(text));
    }
    overrideWithJSON(data) {
      return this.overrideWithText(JSON.stringify(data));
    }
    copy(destEntry) {
      const buf = this.fetch();
      destEntry.override(buf);
    }
    copyTree(destEntry, move = false) {
      if (this.isFile()) {
        this.copy(destEntry);
      } else {
        destEntry.mkdir();
        for (const file of this.list()[0]) {
          this.get(file).copyTree(destEntry.get(file));
        }
      }
      if (move)
        this.removeTree();
    }
    isFile() {
      const [st, e] = this.stat();
      return e == 0 && (st.mode & 32768) != 0;
    }
    isFolder() {
      if (this.absolutePath == "/storage")
        return true;
      const [st, e] = this.stat();
      return e == 0 && (st.mode & 32768) == 0;
    }
    exists() {
      return this.stat()[1] == 0;
    }
    list() {
      return hmFS.readdir(isMiBand7 ? this.absolutePath : this.relativePath);
    }
    mkdir() {
      return hmFS.mkdir(isMiBand7 ? this.absolutePath : this.relativePath);
    }
    seek(val) {
      hmFS.seek(this._f, val, hmFS.SEEK_SET);
    }
    read(buffer, offset, length) {
      hmFS.read(this._f, buffer, offset, length);
    }
    write(buffer, offset, length) {
      hmFS.write(this._f, buffer, offset, length);
    }
    close() {
      hmFS.close(this._f);
    }
  };
  var FsTools = class {
    static getAppTags() {
      if (FsTools.appTags)
        return FsTools.appTags;
      try {
        const [id, type] = appContext._options.globalData.appTags;
        return [id, type];
      } catch (_) {
        hmUI.showToast({ text: String(_) });
        const packageInfo = hmApp.packageInfo();
        return [packageInfo.appId, packageInfo.type];
      }
    }
    static getAppLocation() {
      if (!FsTools.cachedAppLocation) {
        const [id, type] = FsTools.getAppTags();
        const idn = id.toString(16).padStart(8, "0").toUpperCase();
        FsTools.cachedAppLocation = [`js_${type}s`, idn];
      }
      return FsTools.cachedAppLocation;
    }
    static fullAssetPath(path) {
      const [base, idn] = FsTools.getAppLocation();
      return `/storage/${base}/${idn}/assets${path}`;
    }
    static fullDataPath(path) {
      const [base, idn] = FsTools.getAppLocation();
      return `/storage/${base}/data/${idn}${path}`;
    }
    // https://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    static strToUtf8(str) {
      var utf8 = [];
      for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 128)
          utf8.push(charcode);
        else if (charcode < 2048) {
          utf8.push(
            192 | charcode >> 6,
            128 | charcode & 63
          );
        } else if (charcode < 55296 || charcode >= 57344) {
          utf8.push(
            224 | charcode >> 12,
            128 | charcode >> 6 & 63,
            128 | charcode & 63
          );
        } else {
          i++;
          charcode = 65536 + ((charcode & 1023) << 10 | str.charCodeAt(i) & 1023);
          utf8.push(
            240 | charcode >> 18,
            128 | charcode >> 12 & 63,
            128 | charcode >> 6 & 63,
            128 | charcode & 63
          );
        }
      }
      return new Uint8Array(utf8).buffer;
    }
    // source: https://stackoverflow.com/questions/13356493/decode-utf-8-with-javascript
    static decodeUtf8(array, outLimit = Infinity, startPosition = 0) {
      let out = "";
      let length = array.length;
      let i = startPosition, c, char2, char3;
      while (i < length && out.length < outLimit) {
        c = array[i++];
        switch (c >> 4) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            out += String.fromCharCode(c);
            break;
          case 12:
          case 13:
            char2 = array[i++];
            out += String.fromCharCode(
              (c & 31) << 6 | char2 & 63
            );
            break;
          case 14:
            char2 = array[i++];
            char3 = array[i++];
            out += String.fromCharCode(
              (c & 15) << 12 | (char2 & 63) << 6 | (char3 & 63) << 0
            );
            break;
        }
      }
      return [out, i - startPosition];
    }
    static Utf8ArrayToStr(array) {
      return FsTools.decodeUtf8(array)[0];
    }
    static printBytes(val, base2 = false) {
      const options = base2 ? ["B", "KiB", "MiB", "GiB"] : ["B", "KB", "MB", "GB"];
      const base = base2 ? 1024 : 1e3;
      let curr = 0;
      while (val > 800 && curr < options.length) {
        val = val / base;
        curr++;
      }
      return Math.round(val * 100) / 100 + " " + options[curr];
    }
  };

  // lib/mmk/ConfigStorage.js
  var ConfigStorage = class {
    constructor(file = null, defaults = null) {
      this.data = defaults !== null ? defaults : {};
      if (file !== null) {
        this.file = file;
      } else {
        this.file = new Path("data", "config.json");
      }
    }
    get(key, fallback = null) {
      if (this.data[key] !== void 0)
        return this.data[key];
      return fallback;
    }
    set(key, value) {
      this.data[key] = value;
      this.save();
    }
    update(rows) {
      for (let key in rows)
        this.data[key] = rows[key];
      this.save();
    }
    save() {
      this.file.overrideWithJSON(this.data);
    }
    wipe() {
      this.data = {};
      this.file.remove();
    }
    load() {
      try {
        this.data = this.file.fetchJSON();
      } catch (e) {
      }
    }
  };

  // lib/mmk/i18n.js
  var preferredLang = [
    hmFS.SysProGetChars("mmk_tb_lang"),
    DeviceRuntimeCore.HmUtils.getLanguage(),
    "en-US"
  ];
  var strings = {};
  function setPreferedLanguage(val) {
    preferredLang[0] = val;
  }
  function loadLocale(code, data) {
    if (preferredLang.indexOf(code) < 0)
      return;
    for (let key in data) {
      if (!strings[key])
        strings[key] = {};
      strings[key][code] = data[key];
    }
  }
  function t(key) {
    if (!strings[key])
      return key;
    for (let ln of preferredLang) {
      if (!strings[key][ln])
        continue;
      return strings[key][ln];
    }
    return key;
  }

  // utils/translations/en-US.js
  var strings2 = {
    "Uninstall": "Uninstall",
    "Show in file manager": "Show in file manager",
    "Tap again to confirm": "Tap again to confirm",
    "Launch": "Launch",
    "Uninstalled": "Uninstalled",
    "Please reboot device to finish": "Please reboot device to finish",
    "Size": "Size",
    "Folder": "Folder",
    "Vendor": "Vendor",
    "Automatic": "Automatic",
    "Size (ext. config)": "Size (ext. config)",
    "Don't keep ext. files on uninstall": "Don't keep ext. files on uninstall",
    "Connecting...": "Connecting...",
    "Go to website": "Go to website",
    "and enter this code to access your files:": "and enter this code to access your files:",
    "Connected, don't dim screen and leave application until using remote manager.": "Connected, don't dim screen and leave application until using remote manager.",
    "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code": "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code",
    "Restore defaults": "Restore defaults",
    "Advanced": "Advanced",
    "Apps": "Apps",
    "Location": "Location",
    "Font size": "Font size",
    "Remote manager": "Remote manager",
    "View as image": "View as image",
    "View as text": "View as text",
    "View as binary": "View as binary",
    "Paste": "Paste",
    "Cut": "Cut",
    "Copy": "Copy",
    "Delete": "Delete",
    "Edit...": "Edit...",
    'To edit this file/folder, unlock "Danger features" in app settings': 'To edit this file/folder, unlock "Danger features" in app settings',
    "Settings": "Settings",
    "Apps manager": "Apps manager",
    "File manager": "File manager",
    "Disk usage": "Disk usage",
    "DND settings": "DND settings",
    "Flashlight app": "Flashlight app",
    "Camera app": "Camera app",
    "Settings app": "Settings app",
    "Brightness": "Brightness",
    "AOD": "AOD",
    "Powersave": "Powersave",
    "System settings": "System settings",
    "App list sort": "App list sort",
    "Power off": "Power off",
    "Reboot": "Reboot",
    "Background timer": "Background timer",
    "Wake on Wrist": "Wake on Wrist",
    "Click to confirm": "Click to confirm",
    "Customize": "Customize",
    "Language": "Language",
    "About": "About",
    "Preferences": "Preferences",
    "Settings:": "Settings:",
    "All tools:": "All tools:",
    "Open *.txt files with one click": "Open *.txt files with one click",
    "Hide main screen (open toolbox to settings list directly)": "Hide main screen (open toolbox to settings list directly)",
    "Keep last timer value": "Keep last timer value",
    "Show file size in explorer": "Show file size in explorer",
    "Use Base-2 filesize\n1KB = 1024 B": "Use Base-2 filesize\n1KB = 1024 B",
    "Unlock danger features": "Unlock danger features",
    "Reader font size": "Reader font size",
    "Total": "Total",
    "Free": "Free",
    "ZeppOS": "ZeppOS",
    "Watchfaces": "Watchfaces",
    "Unknown": "Unknown",
    "Begin": "Begin",
    "Cancel": "Cancel",
    "This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost.": "This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost.",
    "Agree, enable": "Agree, enable"
  };

  // utils/translations/de-DE.js
  var strings3 = {
    "Uninstall": "Deinstallieren",
    "Show in file manager": "Show in file manager",
    "Tap again to confirm": "Tap again to confirm",
    "Launch": "Starten",
    "Uninstalled": "Deinstalliert",
    "Please reboot device to finish": "Bitte das Ger\xE4t neustarten um abzuschlie\xDFen",
    "Size": "Gr\xF6\xDFe",
    "Folder": "Folder",
    "Vendor": "Hersteller",
    "Automatic": "Automatic",
    "Size (ext. config)": "Gr\xF6\xDFe (ext. config)",
    "Don't keep ext. files on uninstall": "ext Dateien bei Deinstallation NICHT bebehalten",
    "Connecting...": "Connecting...",
    "Go to website": "Go to website",
    "and enter this code to access your files:": "and enter this code to access your files:",
    "Connected, don't dim screen and leave application until using remote manager.": "Connected, don't dim screen and leave application until using remote manager.",
    "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code": "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code",
    "Restore defaults": "Restore defaults",
    "Advanced": "Erweitert",
    "Apps": "Apps",
    "Location": "Location",
    "Font size": "Font size",
    "Remote manager": "Remote manager",
    "View as image": "Zeige als Bild",
    "View as text": "Zeige als Text",
    "View as binary": "Zeige bin\xE4r",
    "Paste": "Einf\xFCgen",
    "Cut": "Ausschneiden",
    "Copy": "Kopieren",
    "Delete": "L\xF6schen",
    "Edit...": "Bearbeiten...",
    'To edit this file/folder, unlock "Danger features" in app settings': 'To edit this file/folder, unlock "Danger features" in app settings',
    "Settings": "Einstellungen",
    "Apps manager": "Apps Manager",
    "File manager": "Dateimanager",
    "Disk usage": "Speichernutzung",
    "DND settings": "BNS Einstellungen",
    "Flashlight app": "Taschenlampe App",
    "Camera app": "Kamera App",
    "Settings app": "Einstellungen App",
    "Brightness": "Helligkeit",
    "AOD": "AOD",
    "Powersave": "Energiesparen",
    "System settings": "Systemeinstellungen",
    "App list sort": "Apps sortieren",
    "Power off": "Ausschalten",
    "Reboot": "Neustart",
    "Background timer": "Hintergrund Timer",
    "Wake on Wrist": "Aufwachen am Handgelenk",
    "Click to confirm": "Klick zum Best\xE4tigen",
    "Customize": "Anpassen",
    "Language": "Sprache",
    "About": "\xDCber...",
    "Preferences": "Pr\xE4ferenzen",
    "Settings:": "Settings:",
    "All tools:": "All tools:",
    "Open *.txt files with one click": "Open *.txt files with one click",
    "Hide main screen (open toolbox to settings list directly)": "Hide main screen (open toolbox to settings list directly)",
    "Keep last timer value": "Letzten Timerwert bebehalten",
    "Show file size in explorer": "Dateigr\xF6\xDFe im Explorer anzeigen",
    "Use Base-2 filesize\n1KB = 1024 B": "Base-2 Dateigr\xF6\xDFe\n1KB = 1024 B",
    "Unlock danger features": "Unlock danger features",
    "Reader font size": "Reader font size",
    "Total": "Gesamt",
    "Free": "Frei",
    "ZeppOS": "ZeppOS",
    "Watchfaces": "Ziffernbl\xE4tter",
    "Unknown": "Unbekannt",
    "Begin": "Start",
    "Cancel": "Stop",
    "This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost.": "This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost.",
    "Agree, enable": "Agree, enable"
  };

  // utils/translations/es-ES.js
  var strings4 = {
    "Uninstall": "Desinstalar",
    "Show in file manager": "Show in file manager",
    "Tap again to confirm": "Tap again to confirm",
    "Launch": "Ejecutar",
    "Uninstalled": "Desinstalado",
    "Please reboot device to finish": "Por favor reinicie el dispositivo",
    "Size": "Tama\xF1o",
    "Folder": "Folder",
    "Vendor": "Desarrollador",
    "Automatic": "Automatic",
    "Size (ext. config)": "Tama\xF1o (ext. config)",
    "Don't keep ext. files on uninstall": "No conservar archivos ext. despu\xE9s de desinstalar",
    "Connecting...": "Connecting...",
    "Go to website": "Go to website",
    "and enter this code to access your files:": "and enter this code to access your files:",
    "Connected, don't dim screen and leave application until using remote manager.": "Connected, don't dim screen and leave application until using remote manager.",
    "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code": "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code",
    "Restore defaults": "Restore defaults",
    "Advanced": "Avanzado",
    "Apps": "Apps",
    "Location": "Location",
    "Font size": "Font size",
    "Remote manager": "Remote manager",
    "View as image": "Mostrar como imagen",
    "View as text": "Mostrar como texto",
    "View as binary": "Mostrar como binario",
    "Paste": "Pegar",
    "Cut": "Cortar",
    "Copy": "Copiar",
    "Delete": "Borrar",
    "Edit...": "Editar...",
    'To edit this file/folder, unlock "Danger features" in app settings': 'To edit this file/folder, unlock "Danger features" in app settings',
    "Settings": "Ajustes",
    "Apps manager": "Administrador de aplicacioness",
    "File manager": "Administrador de archivos",
    "Disk usage": "Uso de almacenamiento",
    "DND settings": "Ajustes DND",
    "Flashlight app": "Luz flash",
    "Camera app": "Camara",
    "Settings app": "Ajustes",
    "Brightness": "Brillo",
    "AOD": "AOD",
    "Powersave": "Ahorro de energ\xEDa",
    "System settings": "Ajustes del sistema",
    "App list sort": "Ordener lista de apps",
    "Power off": "Apagar",
    "Reboot": "Reiniciar",
    "Background timer": "Temporizador de fondo",
    "Wake on Wrist": "Wake on Wrist",
    "Click to confirm": "Click para confirmar",
    "Customize": "Editar",
    "Language": "Idioma",
    "About": "Acerca de",
    "Preferences": "Preferencias",
    "Settings:": "Settings:",
    "All tools:": "All tools:",
    "Open *.txt files with one click": "Open *.txt files with one click",
    "Hide main screen (open toolbox to settings list directly)": "Hide main screen (open toolbox to settings list directly)",
    "Keep last timer value": "Mantener valor del \xFAltimo temporizador",
    "Show file size in explorer": "Mostrar el tama\xF1o del archivo en el explorador",
    "Use Base-2 filesize\n1KB = 1024 B": "Usar tama\xF1o de archivo base-2\n1KB = 1024 B",
    "Unlock danger features": "Mostrar funcionalidades peligrosas",
    "Reader font size": "Reader font size",
    "Total": "Total",
    "Free": "Libre",
    "ZeppOS": "ZeppOS",
    "Watchfaces": "Watchfaces",
    "Unknown": "Desconocido",
    "Begin": "Iniciar",
    "Cancel": "Detener",
    "This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost.": "Esta opci\xF3n mostrar\xE1 algunas caracter\xEDsticas que pueden causar que su dispositivo no arranque. Continuando, usted acepta que en alg\xFAn momento se pueden perder todas las configuraciones de ese dispositivo.",
    "Agree, enable": "Aceptar, habilitar"
  };

  // utils/translations/pt-BR.js
  var strings5 = {
    "Uninstall": "Desinstalar",
    "Show in file manager": "Show in file manager",
    "Tap again to confirm": "Toque novamente para confirmar",
    "Launch": "Executar",
    "Uninstalled": "Desinstalado",
    "Please reboot device to finish": "Por favor, reinicie o dispositivo para concluir",
    "Size": "Tamanho do aplicativo",
    "Folder": "Folder",
    "Vendor": "Desenvolvedor",
    "Automatic": "Automatic",
    "Size (ext. config)": "Tamanho (ext. config)",
    "Don't keep ext. files on uninstall": "Remover arquivos .ext na desinstala\xE7\xE3o",
    "Connecting...": "Connecting...",
    "Go to website": "Go to website",
    "and enter this code to access your files:": "and enter this code to access your files:",
    "Connected, don't dim screen and leave application until using remote manager.": "Connected, don't dim screen and leave application until using remote manager.",
    "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code": "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code",
    "Restore defaults": "Restore defaults",
    "Advanced": "Avan\xE7ado",
    "Apps": "Aplicativos",
    "Location": "Location",
    "Font size": "Font size",
    "Remote manager": "Remote manager",
    "View as image": "Abrir como imagem",
    "View as text": "Abrir como texto",
    "View as binary": "Ver em hexadecimal",
    "Paste": "Colar",
    "Cut": "Recortar",
    "Copy": "Copiar",
    "Delete": "Deletar",
    "Edit...": "Editar...",
    'To edit this file/folder, unlock "Danger features" in app settings': 'Para editar este arquivo/pasta, desbloqueie "Recursos perigosos" nas configura\xE7\xF5es do aplicativo',
    "Settings": "Configura\xE7\xF5es",
    "Apps manager": "Gerenciador de aplicativos",
    "File manager": "Gerenciador de arquivos",
    "Disk usage": "Uso do armazenamento",
    "DND settings": "Modo N\xE3o Perturbe",
    "Flashlight app": "Lanterna",
    "Camera app": "C\xE2mera",
    "Settings app": "Configura\xE7\xF5es da Mi Band",
    "Brightness": "Brilho",
    "AOD": "AOD",
    "Powersave": "Economia de energia",
    "System settings": "Configura\xE7\xF5es do sistema",
    "App list sort": "Ordenar lista de aplicativos",
    "Power off": "Desligar",
    "Reboot": "Reiniciar",
    "Background timer": "Temporizador",
    "Wake on Wrist": "Levantar pulso p/ ver info.",
    "Click to confirm": "Clique para confirmar",
    "Customize": "Personalizar",
    "Language": "Idioma",
    "About": "Detalhes do app",
    "Preferences": "Prefer\xEAncias",
    "Settings:": "Configura\xE7\xF5es",
    "All tools:": "All tools:",
    "Open *.txt files with one click": "Open *.txt files with one click",
    "Hide main screen (open toolbox to settings list directly)": "Hide main screen (open toolbox to settings list directly)",
    "Keep last timer value": "Manter o valor do \xFAltimo temporizador",
    "Show file size in explorer": "Mostrar tamanho dos arquivos no explorer",
    "Use Base-2 filesize\n1KB = 1024 B": "Exibir tamanho dos arquivos em Base-2\n1KB = 1024 B",
    "Unlock danger features": "Desbloquear recursos perigosos",
    "Reader font size": "Tamanho da fonte do editor",
    "Total": "Total",
    "Free": "Livre",
    "ZeppOS": "ZeppOS",
    "Watchfaces": "Watchfaces",
    "Unknown": "Desconhecido",
    "Begin": "Iniciar",
    "Cancel": "Parar",
    "This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost.": "Esta op\xE7\xE3o mostrar\xE1 alguns recursos, isso pode fazer com que seu dispositivo falhe ao inicializar. Continuando, voc\xEA concorda que em algum momento todas as configura\xE7\xF5es desse dispositivo podem ser perdidas.",
    "Agree, enable": "Aceitar e continuar"
  };

  // utils/translations/ru-RU.js
  var strings6 = {
    "Uninstall": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
    "Show in file manager": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432 \u043F\u0440\u043E\u0432\u043E\u0434\u043D\u0438\u043A\u0435",
    "Tap again to confirm": "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437 \u0434\u043B\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
    "Launch": "\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C",
    "Uninstalled": "\u0423\u0434\u0430\u043B\u0435\u043D\u043E",
    "Please reboot device to finish": "\u041F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u0434\u043B\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F",
    "Size": "\u0420\u0430\u0437\u043C\u0435\u0440",
    "Folder": "\u041F\u0430\u043F\u043A\u0430",
    "Vendor": "\u0420\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A",
    "Automatic": "\u0410\u0432\u0442\u043E",
    "Size (ext. config)": "\u0420\u0430\u0437\u043C\u0435\u0440 (\u0432\u043D\u0435\u0448\u043D. \u0444\u0430\u0439\u043B\u044B)",
    "Don't keep ext. files on uninstall": "\u0422\u0430\u043A\u0436\u0435 \u0443\u0434\u0430\u043B\u044F\u0442\u044C \u0432\u043D\u0435\u0448\u043D\u0438\u0435 \u0444\u0430\u0439\u043B\u044B",
    "Connecting...": "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435...",
    "Go to website": "\u041F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u043D\u0430 \u0441\u0430\u0439\u0442",
    "and enter this code to access your files:": "\u0438 \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0434 \u0434\u043B\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u0444\u0430\u0439\u043B\u0430\u043C:",
    "Connected, don't dim screen and leave application until using remote manager.": "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E, \u043D\u0435 \u0432\u044B\u043A\u043B\u044E\u0447\u0430\u0439\u0442\u0435 \u044D\u043A\u0440\u0430\u043D \u0438 \u043D\u0435 \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u0439\u0442\u0435 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0443, \u043F\u043E\u043A\u0430 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442\u0435 \u0441 Remote Manager.",
    "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code": "\u041D\u0435 \u043C\u043E\u0436\u0435\u0442\u0435 \u043D\u0430\u0439\u0442\u0438 \u0443\u0434\u0430\u043B\u0451\u043D\u043D\u043E\u0435 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435? \u042D\u0442\u0430 \u0444\u0443\u043D\u043A\u0446\u0438\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0442\u043E\u043B\u044C\u043A\u043E \u0432 Zepp-\u0432\u0435\u0440\u0441\u0438\u0438, \u0443\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u043C\u043E\u0439 \u0438\u0437 QR-\u043A\u043E\u0434\u0430",
    "Restore defaults": "\u0412\u0435\u0440\u043D\u0443\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",
    "Advanced": "\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E",
    "Apps": "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F",
    "Location": "\u0420\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435",
    "Font size": "\u0420\u0430\u0437\u043C\u0435\u0440 \u0442\u0435\u043A\u0441\u0442\u0430",
    "Remote manager": "\u0412\u0435\u0431-\u043F\u0440\u043E\u0432\u043E\u0434\u043D\u0438\u043A",
    "View as image": "\u041F\u0440\u043E\u0441\u043C. \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",
    "View as text": "\u041F\u0440\u043E\u0441\u043C. \u0442\u0435\u043A\u0441\u0442",
    "View as binary": "\u041F\u0440\u043E\u0441\u043C. \u0431\u0438\u043D\u0430\u0440\u043D\u043E",
    "Paste": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044C",
    "Cut": "\u0412\u044B\u0440\u0435\u0437\u0430\u0442\u044C",
    "Copy": "\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
    "Delete": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
    "Edit...": "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C...",
    'To edit this file/folder, unlock "Danger features" in app settings': '\u0427\u0442\u043E\u0431\u044B \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u044D\u0442\u043E\u0442 \u043E\u0431\u044A\u0435\u043A\u0442, \u0440\u0430\u0437\u0431\u043B\u043E\u043A. "\u041E\u043F\u0430\u0441\u043D\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438" \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445',
    "Settings": "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C",
    "Apps manager": "\u0423\u043F\u0440. \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F\u043C\u0438",
    "File manager": "\u0424\u0430\u0439\u043B\u043E\u0432\u044B\u0439 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440",
    "Disk usage": "\u041F\u0430\u043C\u044F\u0442\u044C",
    "DND settings": "\u041D\u0435 \u0431\u0435\u0441\u043F\u043E\u043A\u043E\u0438\u0442\u044C",
    "Flashlight app": "\u0424\u043E\u043D\u0430\u0440\u0438\u043A",
    "Camera app": "\u041A\u0430\u043C\u0435\u0440\u0430",
    "Settings app": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
    "Brightness": "\u042F\u0440\u043A\u043E\u0441\u0442\u044C",
    "AOD": "AOD",
    "Powersave": "\u042D\u043D\u0435\u0440\u0433\u043E\u0441\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0438\u0435",
    "System settings": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u0438\u0441\u0442\u0435\u043C\u044B",
    "App list sort": "\u041D\u0430\u0441\u0442\u0440. \u043C\u0435\u043D\u044E \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0439",
    "Power off": "\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C",
    "Reboot": "\u041F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C",
    "Background timer": "\u0424\u043E\u043D\u043E\u0432\u044B\u0439 \u0442\u0430\u0439\u043C\u0435\u0440",
    "Wake on Wrist": "\u041F\u0440\u043E\u0431\u0443\u0436\u0434\u0435\u043D\u0438\u0435 \u043F\u0440\u0438 \u043F\u043E\u0432\u043E\u0440\u043E\u0442\u0435",
    "Click to confirm": "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u0434\u043B\u044F \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F",
    "Customize": "\u0413\u043B\u0430\u0432\u043D\u0430\u044F",
    "Language": "\u042F\u0437\u044B\u043A",
    "About": "\u041E Toolbox",
    "Preferences": "\u041F\u0440\u0435\u0434\u043F\u043E\u0447\u0442\u0435\u043D\u0438\u044F",
    "Settings:": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438:",
    "All tools:": "\u0412\u0441\u0435 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B:",
    "Open *.txt files with one click": "\u041E\u0442\u043A\u0440\u044B\u0432\u0430\u0442\u044C *.txt \u0444\u0430\u0439\u043B\u044B \u043E\u0434\u043D\u0438\u043C \u043A\u0430\u0441\u0430\u043D\u0438\u0435\u043C",
    "Hide main screen (open toolbox to settings list directly)": "\u0421\u043A\u0440\u044B\u0442\u044C \u0433\u043B\u0430\u0432\u043D\u044B\u0439 \u044D\u043A\u0440\u0430\u043D (\u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0442\u044C Toolbox \u0441\u0440\u0430\u0437\u0443 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445)",
    "Keep last timer value": "\u0417\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u0442\u044C \u043F\u043E\u0441\u043B. \u0442\u0430\u0439\u043C\u0435\u0440",
    "Show file size in explorer": "\u0420\u0430\u0437\u043C\u0435\u0440 \u0444\u0430\u0439\u043B\u043E\u0432 \u0432 \u043F\u0440\u043E\u0432\u043E\u0434\u043D\u0438\u043A\u0435",
    "Use Base-2 filesize\n1KB = 1024 B": "\u0421\u0447\u0438\u0442\u0430\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u0444\u0430\u0439\u043B\u043E\u0432 \u0432 \u043E\u0441\u043D. 2\n1KB = 1024 B",
    "Unlock danger features": "\u0420\u0430\u0437\u0431\u043B\u043E\u043A. \u043E\u043F\u0430\u0441\u043D\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438",
    "Reader font size": "\u0420\u0430\u0437\u043C. \u0442\u0435\u043A\u0441\u0442\u0430 \u043F\u0440\u0438 \u0447\u0442\u0435\u043D\u0438\u0438:",
    "Total": "\u0412\u0441\u0435\u0433\u043E",
    "Free": "\u0421\u0432\u043E\u0431\u043E\u0434\u043D\u043E",
    "ZeppOS": "ZeppOS",
    "Watchfaces": "\u0426\u0438\u0444\u0435\u0440\u0431\u043B\u0430\u0442\u044B",
    "Unknown": "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E",
    "Begin": "\u041D\u0430\u0447\u0430\u0442\u044C",
    "Cancel": "\u041E\u0442\u043C\u0435\u043D\u0430",
    "This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost.": "\u042D\u0442\u0430 \u043E\u043F\u0446\u0438\u044F \u0440\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u0443\u0435\u0442 \u0444\u0443\u043D\u043A\u0446\u0438\u0438, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043F\u043E\u0442\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E \u043C\u043E\u0433\u0443\u0442 \u043D\u0430\u0432\u0440\u0435\u0434\u0438\u0442\u044C \u0432\u0430\u0448\u0435\u043C\u0443 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0443 \u0438\u043B\u0438 \u0435\u0433\u043E \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u0438. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u043D\u0430 \u0441\u0432\u043E\u0439 \u0441\u0442\u0440\u0430\u0445 \u0438 \u0440\u0438\u0441\u043A. \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C?",
    "Agree, enable": "\u0414\u0430, \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u044C"
  };

  // utils/translations/zh-CN.js
  var strings7 = {
    "Uninstall": "\u5378\u8F7D",
    "Show in file manager": "\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A",
    "Tap again to confirm": "\u518D\u6B21\u70B9\u51FB\u4EE5\u786E\u8BA4",
    "Launch": "\u542F\u52A8",
    "Uninstalled": "\u5DF2\u5378\u8F7D",
    "Please reboot device to finish": "\u8BF7\u91CD\u542F\u8BBE\u5907\u4EE5\u5B8C\u6210",
    "Size": "\u5E94\u7528\u7A0B\u5E8F\u5927\u5C0F",
    "Folder": "Folder",
    "Vendor": "\u4F5C\u8005",
    "Automatic": "Automatic",
    "Size (ext. config)": "\u5927\u5C0F\uFF08\u5916\u90E8\u6587\u4EF6\uFF09",
    "Don't keep ext. files on uninstall": "\u5378\u8F7D\u65F6\u5220\u9664\u5916\u90E8\u6587\u4EF6",
    "Connecting...": "Connecting...",
    "Go to website": "Go to website",
    "and enter this code to access your files:": "and enter this code to access your files:",
    "Connected, don't dim screen and leave application until using remote manager.": "Connected, don't dim screen and leave application until using remote manager.",
    "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code": "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code",
    "Restore defaults": "Restore defaults",
    "Advanced": "\u9AD8\u7EA7",
    "Apps": "JS\u5E94\u7528",
    "Location": "Location",
    "Font size": "Font size",
    "Remote manager": "Remote manager",
    "View as image": "\u4EE5\u56FE\u7247\u5F62\u5F0F\u67E5\u770B",
    "View as text": "\u4EE5\u6587\u672C\u5F62\u5F0F\u67E5\u770B",
    "View as binary": "\u4EE5\u5341\u516D\u8FDB\u5236\u67E5\u770B",
    "Paste": "\u7C98\u8D34",
    "Cut": "\u526A\u5207",
    "Copy": "\u590D\u5236",
    "Delete": "\u5220\u9664",
    "Edit...": "\u7F16\u8F91...",
    'To edit this file/folder, unlock "Danger features" in app settings': '\u8981\u7F16\u8F91\u6B64\u6587\u4EF6/\u6587\u4EF6\u5939,\u8BF7\u5728\u5E94\u7528\u7A0B\u5E8F\u8BBE\u7F6E\u4E2D"\u89E3\u9501\u5371\u9669\u529F\u80FD"',
    "Settings": "\u8BBE\u7F6E",
    "Apps manager": "\u5E94\u7528\u7BA1\u7406\u5668",
    "File manager": "\u6587\u4EF6\u7BA1\u7406\u5668",
    "Disk usage": "\u78C1\u76D8\u4F7F\u7528\u60C5\u51B5",
    "DND settings": "\u52FF\u6270\u8BBE\u7F6E",
    "Flashlight app": "\u624B\u7535\u7B52",
    "Camera app": "\u9065\u63A7\u62CD\u7167",
    "Settings app": "\u624B\u73AF\u8BBE\u7F6E",
    "Brightness": "\u4EAE\u5EA6",
    "AOD": "AOD",
    "Powersave": "\u8282\u80FD\u6A21\u5F0F",
    "System settings": "\u7CFB\u7EDF",
    "App list sort": "\u5E94\u7528\u5217\u8868\u6392\u5E8F",
    "Power off": "\u5173\u673A",
    "Reboot": "\u91CD\u542F",
    "Background timer": "\u5012\u8BA1\u65F6",
    "Wake on Wrist": "\u62AC\u8155\u5524\u9192",
    "Click to confirm": "\u8F7B\u6309\u4EE5\u91CD\u542F",
    "Customize": "\u5B9A\u5236",
    "Language": "\u8BED\u8A00",
    "About": "\u5173\u4E8E",
    "Preferences": "\u504F\u597D",
    "Settings:": "\u8BBE\u7F6E:",
    "All tools:": "\u6240\u6709\u5DE5\u5177:",
    "Open *.txt files with one click": "\u5355\u51FB\u6253\u5F00 *.txt \u6587\u4EF6",
    "Hide main screen (open toolbox to settings list directly)": "\u9690\u85CF\u4E3B\u754C\u9762(\u76F4\u63A5\u8FDB\u5165Toolbox\u8BBE\u7F6E)",
    "Keep last timer value": "\u4FDD\u7559\u6700\u540E\u4E00\u4E2A\u8BA1\u65F6\u5668\u503C",
    "Show file size in explorer": "\u5728\u6587\u4EF6\u7BA1\u7406\u5668\u4E2D\u663E\u793A\u6587\u4EF6\u5927\u5C0F",
    "Use Base-2 filesize\n1KB = 1024 B": "\u4F7F\u7528 Base-2 \u6587\u4EF6\u5927\u5C0F\n1KB = 1024 B",
    "Unlock danger features": "\u89E3\u9501\u5371\u9669\u529F\u80FD",
    "Reader font size": "\u9605\u8BFB\u5668\u5B57\u4F53\u5927\u5C0F",
    "Total": "\u603B\u7A7A\u95F4",
    "Free": "\u4F59\u7A7A\u95F4",
    "ZeppOS": "\u7CFB\u7EDF\u56FA\u4EF6",
    "Watchfaces": "JS\u8868\u76D8",
    "Unknown": "\u672A\u77E5",
    "Begin": "\u5F00\u59CB",
    "Cancel": "\u53D6\u6D88",
    "This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost.": "\u6B64\u9009\u9879\u5C06\u663E\u793A\u4E00\u4E9B\u53EF\u80FD\u5BFC\u81F4\u60A8\u7684\u8BBE\u5907\u65E0\u6CD5\u542F\u52A8\u529F\u80FD.\u5982\u679C\u60A8\u63A5\u53D7\u5C06\u6765\u53EF\u80FD\u5BFC\u81F4\u8BE5\u8BBE\u5907\u7684\u8BBE\u7F6E\u4E22\u5931\u7684\u8BDD\u8BF7\u7EE7\u7EED.",
    "Agree, enable": "\u63A5\u53D7\u5E76\u7EE7\u7EED"
  };

  // utils/translations/zh-TW.js
  var strings8 = {
    "Uninstall": "\u5378\u8F09",
    "Show in file manager": "Show in file manager",
    "Tap again to confirm": "Tap again to confirm",
    "Launch": "\u767C\u5C04",
    "Uninstalled": "\u5DF2\u5378\u8F09",
    "Please reboot device to finish": "\u8ACB\u91CD\u555F\u8A2D\u5099\u4EE5\u5B8C\u6210",
    "Size": "\u61C9\u7528\u7A0B\u5E8F\u5927\u5C0F",
    "Folder": "Folder",
    "Vendor": "\u5C0F\u8CA9",
    "Automatic": "Automatic",
    "Size (ext. config)": "\u5927\u5C0F\uFF08\u5916\u90E8\u6587\u4EF6\uFF09",
    "Don't keep ext. files on uninstall": "\u5378\u8F09\u6642\u522A\u9664\u5916\u90E8\u6587\u4EF6",
    "Connecting...": "Connecting...",
    "Go to website": "Go to website",
    "and enter this code to access your files:": "and enter this code to access your files:",
    "Connected, don't dim screen and leave application until using remote manager.": "Connected, don't dim screen and leave application until using remote manager.",
    "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code": "Looking for Remote Manager? It's available only in Zepp version, that installs from QR-Code",
    "Restore defaults": "Restore defaults",
    "Advanced": "\u5148\u9032\u7684",
    "Apps": "JS\u61C9\u7528",
    "Location": "Location",
    "Font size": "Font size",
    "Remote manager": "Remote manager",
    "View as image": "\u4EE5\u5716\u7247\u5F62\u5F0F\u6AA2\u8996",
    "View as text": "\u4EE5\u6587\u5B57\u5F62\u5F0F\u6AA2\u8996",
    "View as binary": "\u4EE5\u4E8C\u9032\u5236\u5F62\u5F0F\u67E5\u770B",
    "Paste": "\u8CBC\u4E0A",
    "Cut": "\u526A\u4E0B",
    "Copy": "\u8907\u88FD",
    "Delete": "\u522A\u9664",
    "Edit...": "\u7DE8\u8F2F...",
    'To edit this file/folder, unlock "Danger features" in app settings': 'To edit this file/folder, unlock "Danger features" in app settings',
    "Settings": "\u8A2D\u5B9A",
    "Apps manager": "\u61C9\u7528\u7BA1\u7406\u5668",
    "File manager": "\u6A94\u6848\u7BA1\u7406\u5668",
    "Disk usage": "\u5132\u5B58\u7A7A\u9593",
    "DND settings": "\u52FF\u64FE",
    "Flashlight app": "\u624B\u96FB\u7B52",
    "Camera app": "\u9059\u63A7\u62CD\u7167",
    "Settings app": "\u624B\u74B0\u8A2D\u5B9A",
    "Brightness": "\u4EAE\u5EA6",
    "AOD": "AOD",
    "Powersave": "\u7701\u96FB\u6A21\u5F0F",
    "System settings": "\u7CFB\u7D71\u8A2D\u5B9A",
    "App list sort": "\u61C9\u7528\u5217\u8868\u8A2D\u5B9A",
    "Power off": "\u95DC\u6A5F",
    "Reboot": "\u91CD\u555F",
    "Background timer": "\u5F8C\u53F0\u8A08\u6642\u5668",
    "Wake on Wrist": "\u559A\u9192\u624B\u8155",
    "Click to confirm": "\u8F15\u6309\u4EE5\u91CD\u555F",
    "Customize": "\u5B9A\u88FD",
    "Language": "\u8A9E\u8A00",
    "About": "\u95DC\u65BC",
    "Preferences": "\u504F\u597D",
    "Settings:": "Settings:",
    "All tools:": "All tools:",
    "Open *.txt files with one click": "Open *.txt files with one click",
    "Hide main screen (open toolbox to settings list directly)": "Hide main screen (open toolbox to settings list directly)",
    "Keep last timer value": "\u4FDD\u7559\u6700\u5F8C\u4E00\u500B\u8A08\u6642\u5668\u503C",
    "Show file size in explorer": "\u5728\u8CC7\u6E90\u7BA1\u7406\u5668\u4E2D\u986F\u793A\u6587\u4EF6\u5927\u5C0F",
    "Use Base-2 filesize\n1KB = 1024 B": "\u4F7F\u7528 Base-2 \u6587\u4EF6\u5927\u5C0F\n1KB = 1024 B",
    "Unlock danger features": "Unlock danger features",
    "Reader font size": "Reader font size",
    "Total": "\u624B\u74B0\u5BB9\u91CF",
    "Free": "\u53EF\u7528\u7A7A\u9593",
    "ZeppOS": "\u7CFB\u7D71\u97CC\u9AD4",
    "Watchfaces": "JS\u9336\u76E4",
    "Unknown": "\u672A\u77E5",
    "Begin": "\u958B\u59CB",
    "Cancel": "\u53D6\u6D88",
    "This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost.": "This option will show some features, that may cause your device to fail to boot. Continuing, you agree that in some moment all settings of that device may become lost.",
    "Agree, enable": "Agree, enable"
  };

  // utils/translations.js
  function initTranslations(loadLocale2) {
    loadLocale2("en-US", strings2);
    loadLocale2("de-DE", strings3);
    loadLocale2("es-ES", strings4);
    loadLocale2("pt-BR", strings5);
    loadLocale2("ru-RU", strings6);
    loadLocale2("zh-CN", strings7);
    loadLocale2("zh-TW", strings8);
  }

  // utils/default_config.js
  var default_config = {
    tiles: [
      "apps",
      "files",
      "storage",
      "timer",
      "remman",
      "dnd",
      "camera"
    ],
    withBrightness: true,
    withBattery: false
  };

  // app_offline.js
  FsTools.appTags = [33904, "app"];
  var configFile = new Path("data", "config.json");
  var config = new ConfigStorage(configFile, default_config);
  __App__({
    globalData: {
      config,
      t,
      appTags: FsTools.appTags,
      offline: true
    },
    onCreate(options) {
      config.load();
      setPreferedLanguage(config.get("locale", "false"));
      initTranslations(loadLocale);
    },
    onDestroy(options) {
    }
  });
})();
