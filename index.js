const { Client } = require("discord.js-selfbot-v13");
const moment = require('moment-timezone')
const axios = require('axios')
const https = require('node:https');
const keepAlive = require('./server.js')

const agent = new https.Agent({
  rejectUnauthorized: false
});
const client = new Client({
    checkUpdate: false
}); 

let lastData
async function Send2dc(messages) {
  const time = moment.tz('Asia/Jakarta').format('HH:mm')
  const text = `\`\`\`diff\n[${time}] ${messages}\`\`\``
  client.users.cache.get('773269141435056190').send(text)
}

async function Status() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  res = "Apa coba"
  type = "online"

  if (time >= 00 && time <= 4) {
    type = "idle"
    res = "Kok belum tidur? mikirin apa? sini cerita."
  }
  if (time >= 4 && time <= 18) {
    const response = await axios.get('https://animechan.vercel.app/api/random/', { httpsAgent: agent });
    if (response.data.quote.length > 128) {
      res = "Some people who came just out of curiosity."
    } else {
      res = response.data.quote
    }
  }
  if (time >= 18 && time <= 23) {
    type = "idle"
    res = "Nothing"
  }

  if (res == lastData) {
    Send2dc(`Refresh Status`)
    console.log("Refresh Status")
  } else {
    Send2dc(`Status Changed\n(${type})` + res)
    console.log("Status Changed")
    lastData = res
  }
  await client.settings.setCustomStatus({
    status: type,
    text: res,
    emoji: null,
    expires: null,
  });
}

async function AboutMe() {
  const text = [
    "My Server - https://discord.gg/p683JCG",
    "Follow me on instagram or tiktok - **@0xviel**",
    "Website - https://0xviel.my.id/",
    "Email - contact@0xviel.my.id",
    "Follow me on instagram or tiktok - **@0xviel**\n\nWebsite  : https://0xviel.my.id/\nEmail        : contact@0xviel.my.id"
  ];
  await client.user.setAboutMe(text[4])
  var index = 0;
  setInterval(() => {
    if (index > text.length - 1) {
      console.clear()
      index = 0;
    }
    Send2dc("AboutMe Changed\n" + text[index])
    console.log("AboutMe Changed")
    client.user.setAboutMe(text[index])
    index++;
  }, 60000 * 5);
}

client.on("ready", async() => {
  await Status()
  setInterval(async () => {
    Status()
  }, 60000 * 10)
  
  await AboutMe()
  console.log(client.user.tag)
})
client.on('error', (error) => console.log(error))
client.on('reconnection', () => console.log("reconnexion en cours..."))
client.on('disconnect', () => console.log("deconnexion en cours..."))

keepAlive()
client.login(process.env['discordToken'])