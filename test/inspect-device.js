const miio = require("../miio");
const chalk = require("chalk");
const log = require("../miio/cli/log");

// Resolve a device, specifying the token (see below for how to get the token)
miio.device({ address: '192.168.1.46', token: '646338354a4d38586851564239356d68' })
    .then(async device => {
        const deviceInfo = await device.getDeviceInfo();
        console.log('Device info', deviceInfo);
        const mgmt = device.management;
        mgmt.info()
            .then((info) => {
                log.plain(chalk.bold("Actions:"));
                log.group(() => {
                    const actions = device.metadata.actions;
                    console.log(actions)
                });

                device.destroy();
            })
    })
    .catch(err => {
        console.log(err)
    });

