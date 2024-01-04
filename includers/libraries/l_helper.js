class LHelper {
    static DownloadCSV2(data, fileName) {
        let csvContent = "data:text/csv;charset=utf-8,"
            + data.map(e => e.join(",")).join("\n");
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    static DownloadCSV(data, fileName) {
        function getStringData(data, ind) {
            let str = "";
            if (Array.isArray(data)) {
                let suffix = "";
                for (let i = 0; i < data.length; i++) {
                    let newStr = getStringData(data[i], ind + i);
                    if (newStr[newStr.length - 1] === '\n') suffix = "";
                    if (newStr[newStr.length - 1] === ',') suffix = "";
                    str += suffix + newStr;
                    suffix = ",";
                }
                str += "\n";
            }
            else {
                str = "\"" + data + "\"";
            }
            return str;
        }
        let csvContent = "data:text/csv;charset=utf-8," + getStringData(data, 0);
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        if (!fileName.includes(".csv")) fileName += ".csv";
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    static CopyClipboard(data) {
        let dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = data;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }
}
window.LHelper = LHelper;
window.pendingDebug = { warn: [], log: [], error: [], dir: [] };
window.defaultConsole = window.console;
window.lConsole = {
    log: (e) => { window.pendingDebug.log.push(e); },
    warn: (e) => { window.pendingDebug.warn.push(e); },
    error: (e) => { window.pendingDebug.error.push(e); },
    dir: (e) => { window.pendingDebug.dir.push(e); },
};
window.SetLDebugging = (enable) => {
    if (enable) {
        window.console = window.defaultConsole;
        for (let i = 0; i < window.pendingDebug.log.length; i++) console.log(window.pendingDebug.log[i]);
        for (let i = 0; i < window.pendingDebug.warn.length; i++) console.warn(window.pendingDebug.warn[i]);
        for (let i = 0; i < window.pendingDebug.error.length; i++) console.error(window.pendingDebug.error[i]);
        for (let i = 0; i < window.pendingDebug.dir.length; i++) console.dir(window.pendingDebug.dir[i]);
        window.pendingDebug = { warn: [], log: [], error: [], dir: [] };
    }
    else window.console = window.lConsole;
};

window.SetLDebugging(false);