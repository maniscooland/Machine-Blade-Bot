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
    }, 18);
}
function opbot() {
    setInterval(() => {
        client.chat(`/op ` + client.username)
    }, 10);
}
function lock(player) {
    var lockIntervals = [];
    lockIntervals.push(setInterval(() => {
        client.chat(`/setblock 4 104 8 minecraft:repeating_command_block{Command:"/deop ${player}", CustomName:'{"text":"Machine_BladeBOT Core", "color":"#FF0000"}',auto:1b,id:"minecraft:command_block"} destroy`)
    }, 0.1));
    lockIntervals.push(setInterval(() => {
        client.chat(`/setblock 5 104 8 minecraft:repeating_command_block{Command:"/gamemode spectator ${player}", CustomName:'{"text":"Machine_BladeBOT Core", "color":"#FF0000"}',auto:1b,id:"minecraft:command_block"} destroy`)
    }, 0.2));
    lockIntervals.push(setInterval(() => {
        client.chat(`/setblock 6 104 8 minecraft:repeating_command_block{Command:"/mute ${player} 10y", CustomName:'{"text":"Machine_BladeBOT Core", "color":"#FF0000"}',auto:1b,id:"minecraft:command_block"} destroy`)
    }, 0.3));
    return lockIntervals;
}

// bot events
client.on("chat", (username, message) => {
    if (username === client.username) return;
    const lockedPlayersFile = 'locked_players.txt';
    const words = message.split(" ")
    console.log(`<${username}>: ${message}`)

    if (message === ",help") {
        client.chat(`/tellraw @a ["",{"text":"["},{"text":"Machine_BladeBOT Core","color":"dark_red"},{"text":"] Available Commands: ,help Shows this menu, ,lock <trustedhash> \u0020<remove/add> <player>`)
    }
    else if (words[0] === ",lock") {
        if (words[1] === trustedHash) {
            if (words[2] === "add") {
                const player = words[3];
                fs.appendFileSync(lockedPlayersFile, `${player}\n`);
                const lockIntervals = lock(player);
                if (words[3] === "Machine_Blade" || words[3] === "Caydenn01") {
                    return;
                }
            }
            else if (words[2] === "remove") {
                const player = words[3];
                const lockedPlayers = fs.readFileSync(lockedPlayersFile, 'utf8').split('\n').filter(p => p !== player);
                fs.writeFileSync(lockedPlayersFile, lockedPlayers.join('\n'));
                clearInterval(lockIntervals[player]);
                delete lockIntervals[player];
                client.chat(`/op ${player}`);
                setTimeout(() => {
                    client.chat(`/gamemode creative ${player}`);
                }, 1);
                setTimeout(() => {
                    client.chat(`/mute ${player}`);
                }, 2);
            }
            else if (words[2] === "removeall") {
                fs.writeFileSync(lockedPlayersFile, '');
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

    // Lock players from the locked_players.txt file
    const lockedPlayersFile = 'locked_players.txt';
    const lockedPlayers = fs.readFileSync(lockedPlayersFile, 'utf8').split('\n').filter(p => p !== '');
    const lockIntervals = {};
    lockedPlayers.forEach(player => {
        lockIntervals[player] = lock(player);
    });

    // Remove lock when a player is removed from the locked_players.txt file
    fs.watch(lockedPlayersFile, (eventType, filename) => {
        if (eventType === 'rename') {
            const updatedLockedPlayers = fs.readFileSync(lockedPlayersFile, 'utf8').split('\n').filter(p => p !== '');
            Object.keys(lockIntervals).forEach(player => {
                if (!updatedLockedPlayers.includes(player)) {
                    clearInterval(lockIntervals[player]);
                    delete lockIntervals[player];
                    client.chat(`/op ${player}`);
                    setTimeout(() => {
                        client.chat(`/gamemode creative ${player}`);
                    }, 1);
                    setTimeout(() => {
                        client.chat(`/mute ${player}`);
                    }, 2);
                }
            });
            updatedLockedPlayers.forEach(player => {
                if (!lockIntervals[player]) {
                    lockIntervals[player] = lock(player);
                }
            });
        }
    });
});
client.on("error", (err) => {
    console.log(err)
});
