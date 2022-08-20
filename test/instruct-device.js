const miio = require("../miio");

// Resolve a device, specifying the token (see below for how to get the token)
miio.device({ address: '192.168.1.46', token: '646338354a4d38586851564239356d68' })
    .then(async device => {
        // const deviceInfo = await device.getDeviceInfo();
        // console.log('Device info', deviceInfo);
        const cleaning = await device.getCleaning();
        console.log('Cleaning?', cleaning);  

        device.destroy();
    })
    .catch(err => {
        console.log(err)
    });

