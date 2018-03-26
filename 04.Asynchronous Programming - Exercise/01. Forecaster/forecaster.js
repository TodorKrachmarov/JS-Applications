function attachEvents() {
    const baseUrl = 'https://judgetests.firebaseio.com/';
    let con = 'Partly sunny';
    let forcastObj = {
        Sunny: '&#x2600',
        Overcast: '&#x2601',
        Rain: '&#x2614',
        Degrees: '&#176'
    };
    forcastObj[con] = '&#x26C5';
    let locationCode = '';

    $('#submit').click(getLocationCode);

    function getLocationCode() {
        let location = $('#location');
        if($(location).val() !== ''){
            let req = {
                url: baseUrl + 'locations.json',
                method: 'GET',
                success: getForecaste,
                error: handleError
            }

            $.ajax(req);

            function getForecaste(data) {
                //console.log(data);
                let itExists = false;
                for (let i = 0; i < data.length; i++) {
                    if(data[i].name === $(location).val()){
                        locationCode = data[i].code;
                        itExists = true;
                        break;
                    }
                }

                if(itExists){
                    let todayWether = $.ajax({
                       url: baseUrl + 'forecast/today/' + locationCode + '.json',
                        method: 'GET'
                    });
                    let upcomingWether = $.ajax({
                        url: baseUrl + 'forecast/upcoming/' + locationCode + '.json',
                        method: 'GET'
                    });

                    Promise.all([todayWether, upcomingWether])
                        .then(displayWether)
                        .catch(handleError);

                    function displayWether([today, upcoming]) {
                        /*console.log(today);
                        console.log('////////');
                        console.log(upcoming);*/

                        function dispalyToday(today) {
                            $('#forecast').css('display', 'block');
                            let displayDiv = $('#current');
                            let span1 = $('<span>');
                            $(span1).addClass('condition').addClass('symbol').html(forcastObj[today.forecast.condition]);
                            displayDiv.append(span1);
                            let span2 = $('<span>');
                            $(span2).addClass('condition');
                            let span3 = $('<span>');
                            $(span3).addClass('forecast-data').text(`${today.name}`);
                            $(span2).append(span3);
                            let span4 = $('<span>');
                            $(span4).addClass('forecast-data').html(`${today.forecast.low}/${today.forecast.high}${forcastObj['Degrees']}`);
                            $(span2).append(span4);
                            let span5 = $('<span>');
                            $(span5).addClass('forecast-data').text(`${today.forecast.condition}`);
                            $(span2).append(span5);
                            $(displayDiv).append(span2);
                        }

                        function displayUpcoming(upcoming) {
                            let displayDiv = $('#upcoming');
                            for (let i = 0; i < upcoming.forecast.length; i++) {
                                let span1 = $('<span>');
                                $(span1).addClass('upcoming');
                                let span2 = $('<span>');
                                $(span2).addClass('symbol').html(forcastObj[upcoming.forecast[i].condition]);
                                $(span1).append(span2);
                                let span3 = $('<span>');
                                $(span3).addClass('forecast-data').html(`${upcoming.forecast[i].low}/${upcoming.forecast[i].high}${forcastObj['Degrees']}`);
                                $(span1).append(span3);
                                let span4 = $('<span>');
                                $(span4).addClass('forecast-data').text(`${upcoming.forecast[i].condition}`);
                                $(span2).append(span4);
                                displayDiv.append(span1);
                            }
                        }

                        dispalyToday(today);
                        displayUpcoming(upcoming);
                    }
                } else {
                    handleError();
                }
            }

            function handleError(err) {
                $('#forecast').css('display', 'block').text('Error');
            }
        }
    }
}