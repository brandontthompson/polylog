"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var fileRotation = [];
var PolyLog = /** @class */ (function () {
    function PolyLog(dateFormat, writeFile, logRotateTime, maxLogSize) {
        PolyLog.dateFormat = dateFormat || "YYYY-DD-MM HH:MM:SS";
        PolyLog.fileExtension = ".log";
        PolyLog.writeFile = writeFile || false;
        PolyLog.FileRotateTime = logRotateTime || 86400;
        PolyLog.maxFileSize = maxLogSize || 50;
    }
    PolyLog.Init = function (dateFormat, writeFile, logRotateTime, maxLogSize) {
        PolyLog.dateFormat = dateFormat || "YYYY-DD-MM HH:MM:SS";
    };
    PolyLog.Log = function (message, loglevel, writeNewFile) {
        var log = isPolyLog(message) ? message : { service: "UNKNOWN", message: message };
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
        var message = PolyLog.FormatTime() + " " + " [ " + polylog.service + " ] " + logLevel + " | " + polylog.message;
        PolyLog.Log0(message);
        if (writeNewFile)
            return PolyLog.WriteFile(message);
    };
    PolyLog.Log0 = function (msg) {
        console.log(msg);
    };
    PolyLog.FormatTime = function (format) {
        if (this.dateFormat === "epoch")
            return Date.now();
        console.log(new Date(format || PolyLog.dateFormat));
        return new Date(format || PolyLog.dateFormat);
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
