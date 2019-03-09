import { Message, TextChannel } from "discord.js";
import { setImageChannel } from "../controllers/image-channel-controller";
import ICommand from "../model/command";

export default class CommandSetImageChannel implements ICommand {
    public name = "setimagechannel";
    public help = "Sets the channel this is sent into as an image channel if it's not one, or else removes it as one.";

    public async execute(message: Message, args: string) {
        const result = await setImageChannel(message.channel as TextChannel);

        if (result) {
            message.channel.send("This channel is now an image channel!");
        } else {
            message.channel.send("This channel is no longer an image channel!");
        }
    }
}
