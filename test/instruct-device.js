const miio = require("../miio");

// Resolve a device, specifying the token (see below for how to get the token)
miio.device({ address: '192.168.1.46', token: '646338354a4d38586851564239356d68' })
    .then(async device => {
        // const deviceInfo = await device.getDeviceInfo();
        // console.log('Device info', deviceInfo);
        // const cleaning = await device.getCleaning();
        // console.log('Cleaning?', cleaning);

        // const r = await device.call("miioModel", [""]);
        // console.log(r)

        // Get the battery level
        // device.batteryLevel()
        //     .then(level => {
        //         console.log("result")
        //         console.log(level)
        //     })
        //     .catch(e => {
        //         console.log("error")
        //         console.log(e)
        //     });

        // Get the current cleaning state
        device.cleaning()
            .then(isCleaning => {
                console.log("result");
                console.log("isCleaning", isCleaning);
            }).catch(e => {
                console.log("error");
                console.log(e);
            });

        // device.clean()
        //     .then(clean => {
        //         console.log("result");
        //         console.log("clean", clean);
        //     }).catch(e => {
        //         console.log("error");
        //         console.log(e);
        //     });
        // Get the current cleaning state
        // device.cleaning()
        //     .then(isCleaning => {

        //     }
        //    .catch (e => {
        // })

        // const value = device.property("cleaning");
        // console.log('value?', value);
        // device.destroy();
    })
    .catch(err => {
        console.log(err);
        process.exit(-1);
    });

