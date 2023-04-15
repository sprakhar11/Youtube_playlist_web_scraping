const puppeteer = require("puppeteer")
let ctab;
(async function(){
    try{

        const browserOpen = puppeteer.launch({
            product: 'chrome',
            headless : true,
            defaultViewport : null,
            args : ['--start-maximized']
        })

        let browsweInstance = await browserOpen;

        const alltabarr = await browsweInstance.pages()
        ctab = alltabarr[0]
        link = 'https://www.youtube.com/playlist?list=PLW-S5oymMexXTgRyT3BWVt_y608nt85Uj'
        await ctab.goto(link);
        await ctab.waitForSelector('.style-scope.yt-dynamic-sizing-formatted-string.yt-sans-28');
        let name = await ctab.evaluate(function(select){ return document.querySelector(select).innerText} , '.style-scope.yt-dynamic-sizing-formatted-string.yt-sans-28');
        console.log(name);     

        let allData = await ctab.evaluate(getData, '.byline-item.style-scope.ytd-playlist-byline-renderer')
        console.log(allData);

        let total_videos = allData.noOfvideos.split(" ")[0];
        console.log(total_videos);

        let currentVideos = await getCVideoslength();
        console.log(currentVideos);
        
    } catch (err) {
        console.log(err);
    }
})()

function getData(selector){

    let allElems = document.querySelectorAll(selector)

    let noOfvideos = allElems[0].innerText
    let noofviews = allElems[1].innerText

    return {
        noOfvideos,
        noofviews
    }

}

async function getCVideoslength(){
    let length = await ctab.evaluate(getLength, '.style-scope.ytd-playlist-video-list-renderer');
    return length;
}

function getLength(durationSelect){
    let durationele = document.querySelectorAll(durationSelect);
    // console.log(" hiiii ", durationele);
    return durationele.length;
}