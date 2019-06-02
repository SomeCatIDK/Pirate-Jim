import { GuildMember, TextChannel } from "discord.js";
import { setTimedChannel } from "../controllers/channel/timed-channels";
import ICommand from "../model/command/command";
import ECommandCategory from "../model/command/command-category";
import ECommandResult from "../model/command/command-result";

export default class CommandSetTimedChannel implements ICommand {
    public name = "settimedchannel";
    public aliases: string[] = [];
    public syntax = "settimedchannel <time>";
    public description = "Sets a channel as a timed channel.";
    public category = ECommandCategory.CHANNEL;

    public async execute(author: GuildMember, channel: TextChannel, args: string[]): Promise<ECommandResult> {
        if (!author.hasPermission("MANAGE_CHANNELS")) {
            return ECommandResult.NOT_ENOUGH_PERMISSION;
        }

        let time: number = null;

        if (args[0]) {
            time = parseInt(args[0], 10);
        }

        if (isNaN(time)) {
            time = null;
        }

        const result = await setTimedChannel(channel as TextChannel, time);

        if (result === true) {
            channel.send(`This channel is now a timed channel with a wait of ${time} seconds!`);
        } else if (result === false) {
            channel.send("This channel is no longer a timed channel!");
        } else {
            return ECommandResult.INVALID_SYNTAX;
        }

        return ECommandResult.SUCCESS;
    }
}
