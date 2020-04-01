const discord = require('discord.js');
const moment = require('moment-timezone');

const client = new discord.Client();


exports.handler = async (event, context) => {
    console.log(event);
    console.log(JSON.stringify(event));
    
    await client.login(process.env.DACKBOT_BOT_TOKEN);

    const body = JSON.parse(event.body);
    const author = body.actor.display_name;

    const branchName = body.push.changes[0].new.name;

    const channelId = process.env.DISCORD_CHANNEL_ID;
    const channel = client.channels.get(channelId);

    const title = `${author} pushed to the repository`;
    const date = body.push.changes[0].new.target.date;
    const url = body.push.changes[0].links.html.href;

    var message = "";
    body.push.changes[0].commits.forEach(change => {
        const hash = change.hash.substring(0, 7);
        const datetime = moment(change.date).tz("America/Los_Angeles").format("LLLL");
        const commitMessage = change.message;

        message += `${datetime}:\n ${commitMessage}\n\n`;
    });

    const richEmbed = new discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle(title)
        .setURL(url)
        .setFooter(`Commit pushed to ${branchName} by ${author} on ${date}`)
        .setDescription(message)

    await channel.send(richEmbed);

    const response = {
        'statusCode': 200,
        'body': JSON.stringify({
            message: 'success!'
        })
    }

    return response;
};
