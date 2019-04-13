import { GuildMember, Message, TextChannel } from "discord.js";
import { setImageChannel } from "../controllers/channel/image-channels";
import ICommand from "../model/command/command";
import ECommandCategory from "../model/command/command-category";
import ECommandResult from "../model/command/command-result";

export default class CommandSetImageChannel implements ICommand {
    public name = "setimagechannel";
    public aliases: string[] = [];
    public syntax = "setimagechannel";
    public description = "Sets a channel as an image channel.";
    public category = ECommandCategory.CHANNEL;

    public async execute(author: GuildMember, channel: TextChannel, args: string[]): Promise<ECommandResult> {
        if (!author.hasPermission("MANAGE_CHANNELS")) {
            return ECommandResult.NOT_ENOUGH_PERMISSION;
        }

        const result = await setImageChannel(channel as TextChannel);

        if (result) {
            channel.send("This channel is now an image channel!");
        } else {
            channel.send("This channel is no longer an image channel!");
        }

        return ECommandResult.SUCCESS;
    }
}
