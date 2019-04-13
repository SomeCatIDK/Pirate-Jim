import fs from "fs";
import path from "path";

export function gatherAllFiles(dir: string, filelist: string[]): string[] {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];

    files.forEach((file) => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = gatherAllFiles(path.join(dir, file), filelist);
        } else {
            filelist.push(path.join(dir, file));
        }
    });

    return filelist;
}
