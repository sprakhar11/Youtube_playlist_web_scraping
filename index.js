const puppeteer = require("puppeteer")
let ctab;
(async function(){
    try{

        const browserOpen = puppeteer.launch({
            product: 'chrome',
            headless : false,
            defaultViewport : null,
            args : ['--start-maximized']
        })

        let browsweInstance = await browserOpen;

        const alltabarr = await browsweInstance.pages()
        ctab = alltabarr[0]
        link = 'https://www.google.com'
        await ctab.goto(link);
        // await ctab.waitForSelector('#APjFqb');
        // await ctab.type("#APjFqb", "youtube");
        // await ctab.keyboard.press("Enter");
        // await ctab.waitForSelector('#rso > div:nth-child(1) > div > div > div > div > div > div > div.yuRUbf > a > div > div > div > cite');
        // await ctab.click('#rso > div:nth-child(1) > div > div > div > div > div > div > div.yuRUbf > a > div > div > div > cite');
        




    } catch (err) {
        console.log(err);
    }
})()