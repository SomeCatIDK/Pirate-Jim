import app from "../index";
import { queryValues } from "../database/settings";
import { format } from "sqlstring";
import GuildSetting from "../model/settings";

var settings: Map<string, GuildSetting[]>;

const whitelistTypes = [".png", ".jpg", ".gif", ".mp4"];
const seperator = "|";

export async function __init(){
    settings = await queryValues(format("SELECT * FROM ?? WHERE ?? = ?", ["settings", "key", "image-channel"]));
}

__init();

app.on("message", async message => {
    if (message.content === "!setimagechannel" && message.member.hasPermission("MANAGE_CHANNELS")){
        
    }

    const channels = settings.get(message.guild.id).find(x => x.key === "image-channel");

    if (channels !== undefined && parseIds(channels.value).find(x => x === message.channel.id)){
        let attachment = message.attachments.first();

        if (attachment === undefined){
            await message.delete().catch(console.error);
        }else if (!endsInWhitelist(attachment.filename)){
            await message.delete().catch(console.error);
        }else{
            await message.react("👍");
            await message.react("👎");
            await message.react("\u2764");
        }
    }
});

function parseIds(value: string): string[]{
    return value.split(seperator);
}

function compileIds(array: string[]): string{
    return array.join(seperator);
}

function endsInWhitelist(attachment: string): boolean{
    for (const type in whitelistTypes) {
        if (attachment.endsWith(whitelistTypes[type])){
            return true;
        }
    }

    return false;
}