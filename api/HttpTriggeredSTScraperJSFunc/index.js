/** 
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        *//* status: 200, *//* Defaults to 200 *//*
        body: responseMessage
    };
}
*/

/** 
module.exports = async function (context, req) {
    context.res.json({
        text: "Hello from the API"
    });
};
*/


const axios = require("axios")
const cheerio = require("cheerio")

module.exports = async function (context, req) {
    let allMovieString = ""
    try {
        const response = await axios.get(
            "https://www.ifccenter.com/"
        )
        //context.log(response)

        const $ = cheerio.load(response.data)
        const shows = $(".showtimes") //only 1 of these classes
        let todayDivs = $(shows[0]).find("div") //123 divs in here
        let todayDets = $(todayDivs[0]).find(".details") //"details" for all the Movies for Today
        //let allMovieString = ""

        for (let i = 0; i < todayDets.length; i++) {
            let movieTitleAndTimes = $(todayDets[i]).find("a")
            let movieTitle = $(movieTitleAndTimes[0]).text()
            let movieTimes = $(todayDets[i]).find(".times").find("a").text()
            console.log(movieTitle)
            console.log(movieTimes)
            allMovieString += movieTitle + " " + movieTimes + " "
        }

        //context.res.json({
          //  text: allMovieString
        //});
    } catch (error) {
        console.error(error)
    }

    try {
        const response = await axios.get(
            "https://metrograph.com/calendar/"
        )
        //console.log(response)

        const $ = cheerio.load(response.data)
        const calListDays = $(".calendar-list-day")
        const allTodaysMovies = $(calListDays[0]).find(".items")
        const allTodayAnchors = $(allTodaysMovies[0]).find("a") //all the anchors for today's movies - Title == has "".title", Showtimes != has ".title"
        let movieTitlesArr = []
        let movieTimesArr = []
        //let titleGate = 0
        let movieInd = 0
        for(let i = 0; i < allTodayAnchors.length; i++) {
            if ($(allTodayAnchors[i]).hasClass("title")) {
                //titleGate = 1
                movieInd++
                movieTitlesArr[movieInd] = $(allTodayAnchors[i]).text()
            }
            else  {
                //titleGate = 0
                movieTimesArr[movieInd] += $(allTodayAnchors[i]).text() + " "
            }
        }

        for(let i = 0; i < movieTitlesArr.length; i++) {
            //console.log(movieTitlesArr[i])
            //console.log(movieTimesArr[i])
            allMovieString += movieTitlesArr[i] + ": " + movieTimesArr[i] + " "
        }

        context.res.json({
            text: allMovieString
        });

    } catch (error) {
        console.error(error)
    }
}