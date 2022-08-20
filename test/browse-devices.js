const miio = require("../miio");

const browser = miio.browse({
    cacheTime: 300, // 5 minutes. Default is 1800 seconds (30 minutes)
});

const devices = {};
browser.on("available", (reg) => {
    if (!reg.token) {
        console.log(reg.id, "hides its token");
        return;
    }

    console.log("aa");
    // Directly connect to the device anyways - so use miio.devices() if you just do this
    reg
        .connect()
        .then((device) => {
            devices[reg.id] = device;
            console.log("connected")
            device.destroy();
            // Do something useful with the device
        })
        .catch(handleErrorProperlyHere);
});

browser.on("unavailable", (reg) => {
    const device = devices[reg.id];
    if (!device) return;

    console.log("bb");
    device.destroy();
    delete devices[reg.id];
});