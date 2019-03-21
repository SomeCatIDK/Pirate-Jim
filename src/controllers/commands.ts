import app from "../index";
import ICommand from "../model/command";

const commandDatabase = new Map<string, ICommand>();

const prefix = "!";

app.on("message", async (message) => {
    if (message.content.startsWith(prefix)) {
        const args = message.content.substr(1);

        if (args.length > 0) {
            const command = commandDatabase.get(args);

            if (command !== undefined) {
                await command.execute(message, null);
            } else {
                commandDatabase.forEach(async (entry, key) => {
                    if (args.startsWith(key + " ")) {
                        await entry.execute(message, args.substr(key.length + 1));
                    }
                });
            }
        }
    }
});

export async function registerCommand(command: ICommand) {
    commandDatabase.set(command.name, command);
}
