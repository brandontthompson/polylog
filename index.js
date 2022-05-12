"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var fileRotation = [];
var PolyLog = /** @class */ (function () {
    function PolyLog(service, dateFormat, writeFile, logRotateTime, maxLogSize) {
        PolyLog.dateFormat = dateFormat || "%Y-%D-%M %h:%m:%s";
        PolyLog.service = service || "PolyLog";
        PolyLog.fileExtension = ".log";
        PolyLog.writeFile = writeFile || false;
        PolyLog.FileRotateTime = logRotateTime || 86400;
        PolyLog.maxFileSize = maxLogSize || 50;
    }
    PolyLog.Log = function (message, loglevel, writeNewFile) {
        var log = isPolyLog(message) ? message : { service: PolyLog.service || "UNKNOWN", message: message };
        return PolyLog.Log3(log, loglevel ? loglevel : LogLevel.INFO, writeNewFile || false);
    };
    PolyLog.Warn = function (message) {
        PolyLog.Log(message, LogLevel.WARN);
    };
    PolyLog.Error = function (message) {
        PolyLog.Log(message, LogLevel.ERROR);
    };
    PolyLog.Info = function (message) {
        PolyLog.Log(message, LogLevel.INFO);
    };
    PolyLog.Log3 = function (polylog, logLevel, writeNewFile) {
        var caller = (logLevel == LogLevel.ERROR) ? ErrorTrace() : null;
        var message = "%t [%loglevel] %service - %trace %msg";
        message = message.replace("%t", PolyLog.FormatTime(this.dateFormat || "%Y-%M-%D_%h:%m:%s"))
            .replace("%loglevel", this.FormatString(logLevel, 6))
            .replace("%service", this.FormatString(polylog.service.toString(), polylog.service.length + 2))
            .replace("%trace", (caller) ? caller : "")
            .replace("%msg", polylog.message);
        // const message:string = PolyLog.FormatTime() + " " + " [ " + this.FormatString(logLevel, 6) + " ] " +this.FormatString(polylog.service.toString(), polylog.service.length + 2) + ((caller)? " - "+ caller + " " : "") + " | " + polylog.message
        PolyLog.Log0(message);
        if (writeNewFile)
            return PolyLog.WriteFile(message);
    };
    PolyLog.Log0 = function (msg) {
        console.log(msg);
    };
    PolyLog.FormatTime = function (format) {
        var date = new Date();
        return (format.replace("%Y", date.getFullYear().toString()).replace("%M", ("0" + (date.getMonth() + 1)).slice(-2).toString()).replace("%D", ("0" + date.getDate()).slice(-2).toString()).replace("%h", date.getHours().toString()).replace("%m", date.getMinutes().toString()).replace("%s", date.getSeconds().toString()).replace("%ms", date.getMilliseconds().toString()));
    };
    PolyLog.FormatString = function (str, len) {
        var formatted = "";
        var spacing = Math.ceil((len - str.length) / 2);
        for (var index = 0; index < len; index++) {
            var element = str[index];
            if (index < spacing || index >= spacing + str.length)
                formatted += " ";
            else
                formatted += str[index - spacing];
        }
        return formatted;
    };
    PolyLog.WriteFile = function (str, file) {
        var fileName = this.FormatTime("YYYY-DD-MM_HH:MM:SS") + "-LOGFILE" + this.fileExtension;
        if (fs_1.existsSync(fileName))
            fs_1.appendFile(fileName, str, error);
        else
            fs_1.writeFile(fileName, str, error);
        function error(error) {
            if (error)
                PolyLog.Error("Failed to write to file" + error);
        }
        return {
            id: fileName,
            type: this.fileExtension,
            size: str.length,
            time: Date.now()
        };
    };
    return PolyLog;
}());
exports.PolyLog = PolyLog;
var LogLevel;
(function (LogLevel) {
    LogLevel["NONE"] = "";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["INFO"] = "INFO";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
function isPolyLog(obj) {
    return obj === null || obj === void 0 ? void 0 : obj.service;
}
function ErrorTrace() {
    var _a;
    var caller = null;
    var line = "";
    var error = new Error();
    var trace = ((_a = (error.stack)) === null || _a === void 0 ? void 0 : _a.toString().split("\n")) || [];
    for (var index = 0; index < 7; index++) {
        if (caller && !(caller === null || caller === void 0 ? void 0 : caller.toString().includes("write")))
            break;
        var tra = trace[index].toString().trimStart().replace("at", "");
        line = ((tra.split("/").slice(-2)).toString()).slice(0, -1);
        caller = tra.split(" ", 2)[1];
        if (index > 7) {
            caller = null;
            break;
        }
    }
    if (caller)
        caller = caller + ": " + line;
    return caller;
}
