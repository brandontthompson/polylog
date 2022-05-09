import { appendFile, existsSync, writeFile } from "fs";

const fileRotation:string[] = []; 

export class PolyLog {
    private static service:string
    private static dateFormat:string
    private static fileExtension:string;
    private static writeFile:boolean
    private static FileRotateTime:number 
    private static maxFileSize:number

    constructor(dateFormat?:string, writeFile?:boolean, logRotateTime?:number, maxLogSize?:number){
        PolyLog.dateFormat = dateFormat || "YYYY-DD-MM HH:MM:SS"
        PolyLog.fileExtension = ".log"
        PolyLog.writeFile = writeFile || false;
        PolyLog.FileRotateTime = logRotateTime || 86400;
        PolyLog.maxFileSize = maxLogSize || 50;
    }

    public static Init(dateFormat?:string, writeFile?:boolean, logRotateTime?:number, maxLogSize?:number){
        PolyLog.dateFormat = dateFormat || "YYYY-DD-MM HH:MM:SS"
    }
    
    public static Log(message:any, loglevel?:LogLevel|undefined, writeNewFile?:boolean){
        const log:PolyLog = isPolyLog(message) ? message : {service: "UNKNOWN", message:message}; 
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
    
    private static Log3(polylog:PolyLog, logLevel:LogLevel, writeNewFile:boolean):LogFile | undefined | null{
        const message:string = PolyLog.FormatTime() + " " + " [ " +polylog.service + " ] " + logLevel + " | " + polylog.message
        PolyLog.Log0(message);
        if(writeNewFile) return PolyLog.WriteFile(message);
    }
    
    private static Log0(msg:string){
        console.log(msg);
    }
    
    private static FormatTime(format?:string):number|string|Date{
        if(this.dateFormat === "epoch") return Date.now();
        console.log(new Date(format || PolyLog.dateFormat));
        
        return new Date(format || PolyLog.dateFormat);
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

export interface PolyLog {
    service:string,
    message:any
}

type LogFile = {
    id:string;
    type:string;
    size:number;
    time:number;
}

function isPolyLog(obj:any): obj is PolyLog{
    return obj?.service
}
