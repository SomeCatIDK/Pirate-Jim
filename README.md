# Pirate-Jim

Thanks for checking out Pirate Jim! 

Pirate Jim is a Discord bot designed to be used with the Unturned Official Discord guild, but supports multiple guilds and can be added to any guild. It will eventually have a complex infraction systemn with per-guild configuration settings, but just isn't at that point yet.

If you will use this bot, please remember it is very much in the alpha stage, and can become unstable in a few rare cases.

### Features:

**Image Channels:**

An image channel is a channel where only attachments with the file-types of `.png`, `.jpg`, `.gif`, and `.mp4` are allowed; the bot will also add a thumbs-up, thumbs-down, and heart emoji for the reactions.
Any message that isn't of this file-type or if a message has multiple attachments, it will be deleted. It is recommended to combine this with either Discord's slowmode or a timed channel to ensure that these image channels aren't spammed.

**Timed Channels:**

A timed channel is a channel with an extended slowmode. These channels are usefull for when you need to set a channel to have a slowmode greater than 240 seconds. Currently, any times less than the overflow of a 64-bit signed integer are applicable.

### Commands:

**!setimagechannel:** Sets a channel as an image channel or removes a channel as one.

**!settimedchannel \<time\>:** Sets a channel as a timed channel with the given time; if you are removing a channel as a timed channel, then no time will need to be provided.
  
### Support:

For any support or a request relating to the bot, please file an issue at https://github.com/SomeCatIDK/Pirate-Jim/issues.
