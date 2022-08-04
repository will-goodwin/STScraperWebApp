const axios = require("axios")
const cheerio = require("cheerio")

module.exports = async function (context, req) {
    let allMovieString = ""
    try {
        const response = await axios.get(
            "https://www.ifccenter.com/"
        )

        const $ = cheerio.load(response.data)
        const shows = $(".showtimes") //only 1 of these classes
        let todayDivs = $(shows[0]).find("div") //123 divs in here
        let todayDets = $(todayDivs[0]).find(".details") //"details" for all the Movies for Today
        let movieTitlesArr = []
        let movieTimesArr = []

        allMovieString += "IFC Center:\n--------------\n"
        for (let i = 0; i < todayDets.length; i++) {
            let movieTitleAndTimes = $(todayDets[i]).find("a")
            movieTitlesArr[i] = $(movieTitleAndTimes[0]).text()
            movieTimesArr[i] = $(todayDets[i]).find(".times").find("a").text()
        }

        for (let i = 0; i < movieTitlesArr.length; i++) {
            allMovieString += movieTitlesArr[i].toLocaleUpperCase() + ":\n" + movieTimesArr[i] + "\n"
        }

    } catch (error) {
        console.error(error)
    }

    try {
        const response = await axios.get(
            "https://metrograph.com/calendar/"
        )

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
            if (movieTitlesArr[i] && (typeof movieTitlesArr[i] !== 'undefined')) {
                allMovieString += movieTitlesArr[i].toLocaleUpperCase() + ":\n"
            }
            if (movieTimesArr[i] && (typeof movieTimesArr[i] !== 'undefined')) {
                allMovieString += movieTimesArr[i].substr(9).toLocaleUpperCase() + "\n"
            }
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

        context.res.json({
            text: allMovieString
        });

    } catch (error) {
        console.error(error)
    }
}