const miio = require("../miio");
const chalk = require("chalk");
const log = require("../miio/cli/log");

const GROUPS = [
    { name: "Power", tags: ["cap:power", "cap:switchable-power"] },
    { name: "Mode", tags: ["cap:mode", "cap:switchable-mode"] },
    {
        name: "Sensor",
        tags: [
            "type:sensor",
            "cap:temperature",
            "cap:relativeHumidity",
            "cap:pressure",
            "cap:pm2.5",
            "cap:illuminance",
            "cap:contact",
            "cap:motion",
        ],
    },
    { name: "Brightness", tags: ["cap:brightness", "cap:dimmable"] },
    { name: "Color", tags: ["cap:colorable"] },
    { name: "LED", tags: ["cap:miio:switchable-led", "cap:miio:led-brightness"] },
    { name: "Buzzer", tags: ["cap:miio:buzzer"] },
    { name: "Children", tags: ["cap:children"] },
    { name: "miIO", tags: ["type:miio"] },
];

// Resolve a device, specifying the token (see below for how to get the token)
miio.device({ address: '192.168.1.46', token: '646338354a4d38586851564239356d68' })
    .then(async device => {
        // console.log('Connected to', device);
        const deviceInfo = await device.getDeviceInfo();
        console.log('Device info', deviceInfo);
        const mgmt = device.management;
        // console.log("mgmt", mgmt);
        mgmt.info()
            .then((info) => {

                if (!mgmt.parent) {
                    log.plain(chalk.bold("Firmware version:"), info.fw_ver);
                    log.plain(chalk.bold("Hardware version:"), info.hw_ver);
                    if (info.mcu_fw_ver) {
                        log.plain(chalk.bold("MCU firmware version:"), info.mcu_fw_ver);
                    }
                    log.plain();

                    if (info.ap) {
                        log.plain(
                            chalk.bold("WiFi:"),
                            info.ap.ssid,
                            chalk.dim("(" + info.ap.bssid + ")"),
                            chalk.bold("RSSI:"),
                            info.ap.rssi
                        );
                    } else {
                        log.plain(chalk.bold("WiFi:"), "Not Connected");
                    }
                    if (info.wifi_fw_ver) {
                        log.plain(chalk.bold("WiFi firmware version:"), info.wifi_fw_ver);
                    }
                    log.plain();

                    if (info.ot) {
                        let type;
                        switch (info.ot) {
                            case "otu":
                                type = "UDP";
                                break;
                            case "ott":
                                type = "TCP";
                                break;
                            default:
                                type = "Unknown (" + info.ot + ")";
                        }
                        log.plain(chalk.bold("Remote access (Mi Home App):"), type);
                    } else {
                        log.plain(chalk.bold("Remote access (Mi Home App):"), "Maybe");
                    }
                    log.plain();
                }


                const props = device.properties;
                const keys = Object.keys(props);
                if (keys.length > 0) {
                    log.plain(chalk.bold("Properties:"));
                    for (const key of keys) {
                        log.plain("  -", key + ":", props[key]);
                    }
                    log.plain();
                }

                if (mgmt.parent) {
                    log.plain(chalk.bold("Parent:"));
                    log.group(() => {
                        log.device(mgmt.parent);
                    });
                }

                log.plain(chalk.bold("Actions:"));
                log.group(() => {
                    const actions = device.metadata.actions;
                    const handled = new Set();
                    for (const group of GROUPS) {
                        let seenTags = new Set();
                        let actionsToPrint = [];

                        /*
                         * Go through all actions and collect those that
                         * belong to this group.
                         */
                        for (const name of Object.keys(actions)) {
                            if (handled.has(name)) continue;
                            const action = actions[name];

                            for (const t of group.tags) {
                                if (action.tags.indexOf(t) >= 0) {
                                    seenTags.add(t);
                                    actionsToPrint.push(action);
                                    break;
                                }
                            }
                        }

                        if (actionsToPrint.length > 0) {
                            log.plain(
                                chalk.bold(group.name),
                                "-",
                                Array.from(seenTags).join(", ")
                            );

                            for (const action of actionsToPrint) {
                                printAction(action);
                                handled.add(action.name);
                            }

                            log.plain();
                        }
                    }

                    let isFirst = true;
                    for (const name of Object.keys(actions)) {
                        if (handled.has(name)) continue;

                        if (isFirst) {
                            log.plain(chalk.bold("Other actions"));
                            isFirst = false;
                        }

                        printAction(actions[name]);
                    }
                });

                device.destroy();
            })
    })
    .catch(err => {
        console.log(err)
    });


function printAction(action) {
    log.group(() => {
        let args = action.name;
        for (const arg of action.arguments) {
            args += " ";

            if (arg.optional) {
                args += "[";
            }

            args += arg.type;

            if (arg.optional) {
                args += "]";
            }
        }

        log.plain(args);
    });
}
