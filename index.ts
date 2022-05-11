import { appendFile, existsSync, writeFile } from "fs";

const fileRotation:string[] = []; 


export class PolyLog {
    public static service:string
    public static dateFormat:string
    public static fileExtension:string;
    public static writeFile:boolean
    public static FileRotateTime:number 
    public static maxFileSize:number

    constructor(service?:string, dateFormat?:string, writeFile?:boolean, logRotateTime?:number, maxLogSize?:number){
        PolyLog.dateFormat = dateFormat || "%Y-%D-%M %h:%m:%s";
        PolyLog.service = service || "PolyLog";
        PolyLog.fileExtension = ".log";
        PolyLog.writeFile = writeFile || false;
        PolyLog.FileRotateTime = logRotateTime || 86400;
        PolyLog.maxFileSize = maxLogSize || 50;
    }

    public static Log(message:any, loglevel?:LogLevel|undefined, writeNewFile?:boolean){
        const log:Log = isPolyLog(message) ? message : {service: PolyLog.service || "UNKNOWN", message:message}; 
        return PolyLog.Log3(log, loglevel ? loglevel : LogLevel.INFO, writeNewFile||false);   
    }
    
    public static Warn(message:any){
        PolyLog.Log(message, LogLevel.WARN);
    }
    
    public static Error(message:any){
        PolyLog.Log(message, LogLevel.ERROR);
    }
    
    public static Info(message:any){
        PolyLog.Log(message, LogLevel.INFO);
    }
    
    private static Log3(polylog:Log, logLevel:LogLevel, writeNewFile:boolean):LogFile | undefined | null{
        let caller = null;
        const error = new Error();

        let trace = error.stack?.toString().split("\n") || [];

        for (let index = 0; index < 10; index++) {
            if(caller === null || caller.length < 1 || caller.includes("write")) break;
            caller = trace[index].toString().trimStart().replace("at", "").split(" ", 2)[1];
        }

        let message:string = "%t [%loglevel] %service %msg"
        message = message.replace("%t", PolyLog.FormatTime()).replace("%loglevel", this.FormatString(logLevel, 6)).replace("%service", this.FormatString(polylog.service.toString(), polylog.service.length + 2)).replace("%msg", polylog.message);
        // const message:string = PolyLog.FormatTime() + " " + " [ " + this.FormatString(logLevel, 6) + " ] " +this.FormatString(polylog.service.toString(), polylog.service.length + 2) + ((caller)? " - "+ caller + " " : "") + " | " + polylog.message
        PolyLog.Log0(message);
        if(writeNewFile) return PolyLog.WriteFile(message);
    }
    
    private static Log0(msg:string){
        console.log(msg);
    }
    
    private static FormatTime(format?:string):string{
        const date:Date = new Date();
        // console.log(format || this.dateFormat);?\
        
        // console.log(((format||this.dateFormat)?.replace("%Y", date.getFullYear().toString()).replace("%M", date.getMonth().toString()).replace("%D", date.getDate().toString()).replace("%h", date.getHours().toString()).replace("%m", date.getMinutes().toString()
        // ).replace("%s", date.getSeconds().toString()).replace("%ms", date.getMilliseconds().toString())));
        // if(this.dateFormat === "epoch") return Date.now().toString();
        // return ((format||this.dateFormat)?.replace("%Y", date.getFullYear().toString()).replace("%M", date.getMonth().toString()).replace("%D", date.getDate().toString()).replace("%h", date.getHours().toString()).replace("%m", date.getMinutes().toString()
        // ).replace("%s", date.getSeconds().toString()).replace("%ms", date.getMilliseconds().toString()));
        //format || PolyLog.dateFormat)
        return new Date().toISOString();
    }

    private static FormatString(str:string, len:number) {
        let formatted = "";
        const spacing = Math.ceil((len - str.length) / 2);

        for (let index = 0; index < len; index++) {
            const element = str[index];
            if(index < spacing || index >= spacing + str.length) formatted += " ";
            else formatted += str[index - spacing];
        }

        return formatted;

    }
    
    private static WriteFile(str:string):LogFile{
    
        const fileName = this.FormatTime("YYYY-DD-MM_HH:MM:SS")+"-LOGFILE"+this.fileExtension;
        if(existsSync(fileName))
            appendFile(fileName, str, error);
        else
            writeFile(fileName, str, error);

        function error(error:any){
            if(error) PolyLog.Error("Failed to write to file" + error)
        }
    
        return {
            id: fileName,
            type: this.fileExtension,
            size:str.length,
            time: Date.now()
        }
    }
}

export enum LogLevel {
    NONE    = "",
    WARN    = "WARN",
    ERROR   = "ERROR",
    INFO    = "INFO"
}

export interface Log {
    service:string,
    message:any
}

type LogFile = {
    id:string;
    type:string;
    size:number;
    time:number;
}

function isPolyLog(obj:any): obj is Log{
    return obj?.service
}
