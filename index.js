const puppeteer = require("puppeteer")
const pdf = require("pdfkit");
const fs = require("fs");


let ctab;
(async function(){
    try{

        const browserOpen = puppeteer.launch({
            headless : false,
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

        while(total_videos - currentVideos >= 20){
            await scrollTobottom();
            currentVideos = await getCVideoslength()
            console.log(currentVideos);
        }


        const videotitle = await ctab.$$eval('.yt-simple-endpoint.style-scope.ytd-playlist-video-renderer', elements => elements.map(element => element.textContent));

        console.log(videotitle);
        const duration = await ctab.$$eval('.style-scope.ytd-thumbnail-overlay-time-status-renderer', elements => elements.map(element => element.textContent));

        console.log(duration);

        let currentList = [];

        for(let i = 0; i <  duration.length; i++){
            let tmp1 = videotitle[i];
            let tmp2 = duration[i];
            currentList.push({tmp1, tmp2});
        }



        let pdfDoc = new pdf();

        pdfDoc.pipe(fs.createWriteStream('playlist.pdf'))
        pdfDoc.text(JSON.stringify(currentList))
        pdfDoc.end()

        ctab.close();






        
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

async function scrollTobottom(){

    await ctab.evaluate(goToBottom)

    function goToBottom(){
        window.scrollBy(0, window.innerHeight)
    }

}

async function getCVideoslength(){
    let length = await ctab.evaluate(getLength, '.style-scope.ytd-playlist-video-list-renderer');
    return length;
}

function getLength(durationSelect){
    let durationele = document.querySelectorAll(durationSelect);

    return durationele.length;
}

async function getStats(){
    let list = await ctab.evaluate(getNameandDuration, "#video-title", ".yt-simple-endpoint.style-scope.ytd-playlist-video-renderer");
    console.log("hi", list);
    return list;

}

function getNameandDuration (videoSelector, durationSelector){

    let videoele = document.querySelectorAll(videoSelector);
    let durationele = document.querySelectorAll(durationSelector);
    // console.log("bhaiii");
    // console.log(videoele);
    // console.log(durationele);

    let currentList = [];

    for(let i = 0; durationele.length; i++){
        let videoTitle = videoele[i].textContent;
        let duration = durationele[i].textContent;
        currentList.push({videoTitle, duration})
    }

    return currentList;
}