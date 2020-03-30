const discord = require('discord.js');

const client = new discord.Client();

async function sendMessage(channelId, msg, msgId) {
    console.log(`[sendMessage] channelId: ${channelId} msg: ${msg}`);
    let channel = client.channels.get(channelId);
    if (!channel) {
        console.log(`[sendMessage] channel not found! ${channelId}`);
        console.log(JSON.stringify(client.channels));
        console.log(`Client Status: ${client.status}`);
    }

    await channel.send(msgId);
    console.log(`[sendMessage] succesfully sent message`);
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

const login = (token) => {
    return new Promise(resolve => client.login(token))
}

exports.handler = async (event, context) => {
    console.log(event);
    console.log(JSON.stringify(event));
    
    await client.login(process.env.DACKBOT_BOT_TOKEN);

    const body = JSON.parse(event.body);
    const author = body.actor.display_name;

    const channelId = '693596517604524104';
    const channel = client.channels.get(channelId);

    const title = `${author} pushed to the repository`;
    const date = body.push.changes[0].new.target.date;
    const url = body.push.changes[0].links.html.href;

    var message = "";
    body.push.changes.forEach(change => {
        const hash = change.new.target.hash.substring(0, 7);
        const commitMessage = change.new.target.message;

        message += `${hash}:\n ${commitMessage}\n\n`;
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
