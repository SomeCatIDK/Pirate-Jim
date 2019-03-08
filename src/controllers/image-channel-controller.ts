import app from "../index";
import { queryValues, insertKeyValue } from "../database/settings";
import { format } from "sqlstring";
import GuildSetting from "../model/settings";

var settings: Map<string, GuildSetting[]>;

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
            await message.delete();
        }else if (!attachment.filename.endsWith(".png") && !attachment.filename.endsWith(".jpg") && !attachment.filename.endsWith(".gif")){
            await message.delete();
        }else{
            await message.react("👍");
            await message.react("👎");
            await message.react("\u2764");
        }
    }
});

function parseIds(value: string): string[]{
    return value.split("|");
}

function compileIds(array: string[]): string{
    return array.join("|");
}