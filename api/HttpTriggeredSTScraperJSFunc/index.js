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

let movieTable = document.getElementById('name')
/** 
let row = table.insertRow(0)
let col = row.insertCell(0)
col.innerHTML = "JPark"
col = row.insertCell(1)
col.innerHTML = "10:30"
*/

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

        allMovieString += "IFC Center:\n--------------\n"
        for (let i = 0; i < todayDets.length; i++) {
            let movieTitleAndTimes = $(todayDets[i]).find("a")
            let movieTitle = $(movieTitleAndTimes[0]).text()
            let movieTimes = $(todayDets[i]).find(".times").find("a").text()
            //console.log(movieTitle)
            //console.log(movieTimes)
            allMovieString += movieTitle.toLocaleUpperCase() + ":\n" + movieTimes + "\n"
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
        let movieInd = 0
        for(let i = 0; i < allTodayAnchors.length; i++) {
            if ($(allTodayAnchors[i]).hasClass("title")) {
                movieInd++
                if ($(allTodayAnchors[i]).text().trim() && typeof $(allTodayAnchors[i]).text().trim() !== 'undefined') {
                    movieTitlesArr[movieInd] = $(allTodayAnchors[i]).text().trim()
                }
            }
            else  {
                if ($(allTodayAnchors[i]).text().trim() && typeof $(allTodayAnchors[i]).text().trim() !== 'undefined') {
                    movieTimesArr[movieInd] += $(allTodayAnchors[i]).text().trim()
                }
            }
        }

        allMovieString += "\nMETROGRAPH:\n--------------\n"
        for(let i = 0; i < movieTitlesArr.length; i++) {
            //console.log(movieTitlesArr[i])
            //console.log(movieTimesArr[i])
            if (movieTitlesArr[i] && (typeof movieTitlesArr[i] !== 'undefined')) {
                allMovieString += movieTitlesArr[i].toLocaleUpperCase() + ":\n"
            }
            if (movieTimesArr[i] && (typeof movieTimesArr[i] !== 'undefined')) {
                allMovieString += movieTimesArr[i].substr(9).toLocaleUpperCase() + "\n"
            }
            //allMovieString += movieTitlesArr[i] + ": " + movieTimesArr[i] + "\n"
        }
    } catch (error) {
        console.error(error)
    }

    try {
        
        const response = await axios.get(
            "https://filmforum.org/now_playing"
        )
        
        allMovieString += "\nFILM FORUM:\n--------------\n"

        const $ = cheerio.load(response.data)
        const todayDiv = $('div #tabs-0')
        const todayMovies = $(todayDiv[0]).find('p')
        let movieTitlesArr = []
        let movieTimesArr = []
        let movieTimesArrInd = 0

        //This strategy avoids the nested for loop but since a single space following the 
        // time is not coded into the HTML, all the showtimes get pushed together and are
        // indistinguishable
        /** 
        for (let i = 0; i < todayMovies.length; i++) {
            movieTitlesArr[i] = $(todayMovies[i]).find('strong').find('a').text()
            movieTimesArr[i] = $(todayMovies[i]).find('span').text()
        }
        */
        for (let i = 0; i < todayMovies.length; i++) {
            movieTitlesArr[i] = $(todayMovies[i]).find('strong').find('a').text()
            let todaySTs = $(todayMovies[i]).find('span')
            for(let j = 0; j < todaySTs.length; j++) {
                movieTimesArr[movieTimesArrInd] += $(todaySTs[j]).text() + " "
            }
            movieTimesArrInd++
        }

        for (let i = 0; i < movieTitlesArr.length; i++) {
            allMovieString += movieTitlesArr[i] + ":\n"
            allMovieString += movieTimesArr[i].substr(9) + "\n"
        }

        /** 
        const namesArr = $(".name")
        allMovieString += "\nAngelika Film Center-Angelika New York:\n"
        for (let i = 0; i < namesArr.length; i++) {
            //allMovieString += namesArr[i].text()
        }
        const nowPlayingArr = $(".film.status-now_playing")
        const movieTitles = $(".name").find("a")
        const showtimes = $(".showtimes-wrapper")
        
        allMovieString += "\nAngelika Film Center-Angelika New York:\n"
        
        for (let i = 0; i < movieTitles.length; i++) {
            allMovieString += movieTitles[i].text();
        }
        for (let i=0; i < nowPlayingArr.length; i++) {
            allMovieString += nowPlayingArr[i].find(".name").find("a").text().trim()
            let showtimes = nowPlayingArr[i].find(".showtimes-wrapper").find("a")
            for (let j = 0; j < showtimes.length; j++) {
                allMovieString += showtimes[i].text().trim() + " " 
            }
            allMovieString += "\n"
        }
        */

        context.res.json({
            text: allMovieString
            //table: mtable
        });

    } catch (error) {
        console.error(error)
    }
}