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

    var body = JSON.parse(event.body);
    let author = body.actor.display_name;
    let hash = body.push.changes[0].new.target.hash;
    let message = body.push.changes[0].new.target.message;
    let branchName = body.push.changes[0].new.name;
    let date = body.push.changes[0].new.target.date;
    let url = body.push.changes[0].links.html.href;

    let richEmbed = new discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle(hash)
        .setURL(url)
        .setFooter(`Commit pushed to ${branchName} by ${author} on ${date}`)
        .setDescription(message)

    let channelId = '693596517604524104';
    let channel = client.channels.get(channelId);
    await channel.send(richEmbed);

    let response = {
        'statusCode': 200,
        'body': JSON.stringify({
            message: 'success!'
        })
    }

    return response;
};
