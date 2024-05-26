// imports
const mineflayer = require("mineflayer")
const fs = require("fs");
const { clearInterval } = require("timers");

// bot hashes
const ownerHashes = JSON.parse(fs.readFileSync("./hash stuff/ownerHashes.json", "utf8"));
var ownerHash = ownerHashes[Math.floor(Math.random() * ownerHashes.length)]; // copy n paste to reset the hash
const trustedHashes = JSON.parse(fs.readFileSync("./hash stuff/trustedHashes.json", "utf8"));
var trustedHash = trustedHashes[Math.floor(Math.random() * trustedHashes.length)]; // copy n paste to reset the hash

// bot setup
const settings = {
    host: "kaboom.pw",
    username: "Machine_BladeBOT",
    version: "1.19.2",
    port: 25565,
}
const client = mineflayer.createBot(settings)

// functions
function platform() {
    client.chat(`/fill 6 104 8 -4 104 19 minecraft:repeating_command_block[facing=up]{CustomName:"Machine_BladeBOT Core"} destroy`)
    setInterval(() => {
        client.chat(`/fill 6 104 8 -4 103 19 minecraft:repeating_command_block[facing=up]{CustomName:"Machine_BladeBOT Core"} destroy`);
    }, 18000);
}
function opbot() {
    setInterval(() => {
        client.chat(`/op ` + client.username)
    }, 10);
}
function lock(player) {
    setInterval(() => {
        client.chat(`/setblock 4 104 8 minecraft:repeating_command_block{Command:"/deop ${player}", CustomName:'{"text":"Machine_BladeBOT Core", "color":"#FF0000"}',auto:1b,id:"minecraft:command_block"} destroy`)
    }, 0.1);
    setInterval(() => {
        client.chat(`/setblock 5 104 8 minecraft:repeating_command_block{Command:"/gamemode spectator ${player}", CustomName:'{"text":"Machine_BladeBOT Core", "color":"#FF0000"}',auto:1b,id:"minecraft:command_block"} destroy`)
    }, 0.1);
    setInterval(() => {
        client.chat(`/setblock 6 104 8 minecraft:repeating_command_block{Command:"/mute ${player} 10y", CustomName:'{"text":"Machine_BladeBOT Core", "color":"#FF0000"}',auto:1b,id:"minecraft:command_block"} destroy`)
    }, 0.1);
}

// bot events
client.on("chat", (username, message) => {
    if (username === client.username) return;

    const words = message.split(" ")
    console.log(`<${username}>: ${message}`)

    if (message === ",help") {
        client.chat(`/setblock 3 104 8 minecraft:repeating_command_block{CustomName:'{"text":"Machine_BladeBOT core"}',Command:'say Available Commands: ,help, ,lock <TrustedHash> <add/remove> <player>'} destroy`)
    }
    else if (words[0] === ",lock") {
        if (words[1] === trustedHash) {
            if (words[2] === "add") {
                const player = words[3];
                lock(player)
                if(words[3] === "Machine_Blade" || words[3] === "Caydenn01") {
                    return;
                }
            }
            else if (words[2] === "remove") {
                clearInterval(lock)
            }

        }
    }

    else {
        const unkown = words[0]
        client.chat(`/setblock -4 104 19 minecraft:repeating_command_block{Command:"/say Unkown Command: '${unkown}. Type ,help for a list of commands"}`)
    }
})
client.once("spawn", () => {
    platform();
    trustedHash = trustedHashes[Math.floor(Math.random() * trustedHashes.length)]; // copy n paste to reset the hash
    console.log("Trusted Hash " + trustedHash);
    ownerHash = ownerHashes[Math.floor(Math.random() * ownerHashes.length)]; // copy n paste to reset the hash
    console.log("Owner Hash " + ownerHash);
    opbot();
});
client.on("error", (err) => {
    console.log(err)
});