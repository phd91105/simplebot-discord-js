const Discord = require("discord.js");
const client = new Discord.Client();
require("dotenv").config();
const keepAlive = require("./server");
const request = require("request");
const periodBoard = require("./modules/periodBoard");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function regExString(ob0) {
  return (
    (tietbd = parseInt(ob0.match(/\s(\d)+[,]/g)[1])),
    (tietkt = parseInt(ob0.match(/\s(\d)+[,]/g)[2])),
    (day = ob0.match(/((Thứ|Chủ)[^,]+)/gi)[0]),
    (subj = ob0.match(/(?<=,)[^,]+(?=,)/)[0]),
    (room = ob0.match(/[\w]+\-[\d]+\.[\d]+(?=,)/)[0]),
    settime(tietbd, tietkt)
  );
}
function delay(delayInms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}
function settime(tbd, tkt) {
  return (
    (timestart = `${periodBoard[tbd].start.hour}h${periodBoard[tbd].start.minute}`),
    (timeend = `${periodBoard[tbd + tkt - 1].end.hour}h${
      periodBoard[tbd + tkt - 1].end.minute
    }`)
  );
}

client.on("message", (msg) => {
  var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  if (msg.content.toLowerCase() === "hello") {
    msg.reply(`hello ${msg.author.tag}`);
  }
  else if (msg.content.toLowerCase().match(/tkb\s\d{1,}/gi)) {
    var mssv = msg.content.match(/[0-9]*$/);
    var options = {
      url: "http://daotao.hutech.edu.vn/default.aspx",
      qs: { page: "thoikhoabieu", sta: "0", id: `${mssv}` },
      headers: {
        Cookie: "ASP.NET_SessionId=hen5hx45sdymbxzufifr5f45",
      },
    };
    request(options, async function (err, response, body) {
      var arr = [];
      for (i = 0; i < 7; i++) {
        try {
          let ob0 = body
            .match(/<td\sonmouseover\=\"ddrivetip\(([\s\S]*?)<\/td>/g)
            [i].match(/<td\sonmouseover\=\"ddrivetip\(([\s\S]*?)\,'','420'/)[1]
            .replace(/\'/g, "")
            .replace(/\,/g, ", ");
          regExString(ob0);
          let msg = `\n\n**${day}** (${timestart}-${timeend}):**${subj}**, Phòng: **${room}**`;
          arr.push(msg);
        } catch {}
      }
      msg.reply(arr.toString().replace(/\,\n/g, "\n"));
    });
  } else if (msg.content.toLowerCase() === "covid") {
    var options = {
      method: "GET",
      url: `https://coronavirus-19-api.herokuapp.com/countries/vietnam`,
    };
    request(options, function (error, response) {
      var stringbody = JSON.parse(response.body);
      msg.reply(
        `\nQuốc gia: ${stringbody.country}\nTổng: ${stringbody.cases}\nHôm nay: ${stringbody.todayCases}\nHồi phục: ${stringbody.recovered}\nĐang điều trị: ${stringbody.active}\nTử vong: ${stringbody.deaths}`
      );
    });
  }
});

keepAlive();
client.login(process.env.TOKEN);
