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
        var _a;
        var caller = null;
        var error = new Error();
        var trace = ((_a = error.stack) === null || _a === void 0 ? void 0 : _a.toString().split("\n")) || [];
        for (var index = 0; index < 10; index++) {
            if (caller === null || caller.length < 1 || caller.includes("write"))
                break;
            caller = trace[index].toString().trimStart().replace("at", "").split(" ", 2)[1];
        }
        var message = "%t [%loglevel] %service %msg";
        message = message.replace("%t", PolyLog.FormatTime()).replace("%loglevel", this.FormatString(logLevel, 6)).replace("%service", this.FormatString(polylog.service.toString(), polylog.service.length + 2)).replace("%msg", polylog.message);
        // const message:string = PolyLog.FormatTime() + " " + " [ " + this.FormatString(logLevel, 6) + " ] " +this.FormatString(polylog.service.toString(), polylog.service.length + 2) + ((caller)? " - "+ caller + " " : "") + " | " + polylog.message
        PolyLog.Log0(message);
        if (writeNewFile)
            return PolyLog.WriteFile(message);
    };
    PolyLog.Log0 = function (msg) {
        console.log(msg);
    };
    PolyLog.FormatTime = function (format) {
        var _a, _b;
        var date = new Date();
        console.log(this.dateFormat);
        console.log(((_a = (format || this.dateFormat)) === null || _a === void 0 ? void 0 : _a.replace("%Y", date.getFullYear().toString()).replace("%M", date.getMonth().toString()).replace("%D", date.getDate().toString()).replace("%h", date.getHours().toString()).replace("%m", date.getMinutes().toString()).replace("%s", date.getSeconds().toString()).replace("%ms", date.getMilliseconds().toString())));
        if (this.dateFormat === "epoch")
            return Date.now().toString();
        return ((_b = (format || this.dateFormat)) === null || _b === void 0 ? void 0 : _b.replace("%Y", date.getFullYear().toString()).replace("%M", date.getMonth().toString()).replace("%D", date.getDate().toString()).replace("%h", date.getHours().toString()).replace("%m", date.getMinutes().toString()).replace("%s", date.getSeconds().toString()).replace("%ms", date.getMilliseconds().toString()));
        //format || PolyLog.dateFormat)
        return new Date().toISOString();
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
    PolyLog.WriteFile = function (str) {
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
