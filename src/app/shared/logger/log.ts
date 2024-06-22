import { LogLevel } from "./LogLevel.enum";

export class Log {
    entryDate: Date = new Date();
    message: string = "";
    level: LogLevel = LogLevel.Debug;
    extraInfo: any[] = [];
    
    buildLogString(): string {
        let ret: string = new Date() + " - ";
        ret += " - Message: " + this.message;
        if (this.extraInfo.length) {
            ret += " - Info: " + this.formatParams(this.extraInfo);
        }
        
        return ret;
    }
    
    private formatParams(params: any[]): string {
        let ret: string = params.join(",");
        
        // Is there at least one object in the array?
        if (params.some(p => typeof p == "object")) {
            ret = "";
            
            // Build comma-delimited string
            for (let item of params) {
                ret += JSON.stringify(item) + ",";
            }
        }
        
        return ret;
    }
}