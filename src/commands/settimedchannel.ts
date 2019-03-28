import { Message, TextChannel } from "discord.js";
import { setTimedChannel } from "../controllers/timed-channels";
import ICommand from "../model/command";

export default class CommandSetTimedChannel implements ICommand {
    public name = "settimedchannel";
    public help = "Sets the channel this is sent into as a timed channel, where the slowmode is extended to whatever time is requested.";

    public async execute(message: Message, args: string) {
        let time = parseInt(args, 10);

        if (isNaN(time)) {
            time = null;
        }

        const result = await setTimedChannel(message.channel as TextChannel, time);

        if (result === true) {
            message.channel.send(`This channel is now a timed channel with a wait of ${time} seconds!`);
        } else if (result === false) {
            message.channel.send("This channel is no longer a timed channel!");
        }
    }
}
