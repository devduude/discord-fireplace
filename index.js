const Discord = require('discord.js');
const ytdl = require('ytdl-core-discord');
const config = require('config');

const client = new Discord.Client();


client.once('ready', () => {
	console.log('Ready!');
});

client.login(config.get('token'));

let voiceChannel = null;
let voiceConnection = null;
let voiceChannelInterval = null;

client.on('message', async message => {
  const channelOwner = message.member.id == 181138121742745607;
  
  if (channelOwner && message.member.voice.channel && message.content === 'разжечь камин') {
    voiceChannel = message.member.voice.channel;
    
		await play(message);
  }
  
  if (voiceChannel && channelOwner && message.content === 'потушить камин') {
    await stop(message);
	}
});

async function play(message) {
  const fireplaceLinks = [
    'https://www.youtube.com/watch?v=3sL0omwElxw',
    'https://www.youtube.com/watch?v=j2bnj5hMkIw',
    'https://www.youtube.com/watch?v=de7yout9zmk',
    'https://www.youtube.com/watch?v=c0_ejQQcrwI',
    'https://www.youtube.com/watch?v=IvJQTWGP5Fg',
    'https://www.youtube.com/watch?v=JzbosA0vc5Y',
  ];

  const randomFireplase = fireplaceLinks[Math.floor(Math.random() * fireplaceLinks.length)];
  
  message.channel.send('*щёлк-щёлк*');

  voiceConnection = await voiceChannel.join();

  voiceConnection.play(await ytdl(randomFireplase), { type: 'opus' });

  voiceChannelInterval = client.setInterval(checkForMembers, 10 * 60 * 1000);
}

async function checkForMembers(params) {
  const channelMembers = await voiceChannel.members.size;
  
  if (channelMembers == 1) {
    await stop();

    client.clearInterval(voiceChannelInterval);
  }
}

async function stop(message) {
  await voiceConnection.disconnect();
  await voiceChannel.leave();

  voiceConnection = null;
  voiceChannel = null;

  message.channel.send('*звуки затухающего огня*');
}