'use strict'

const apiKey = 'wDAQKR3mS8nkrIuK6tML56waGouqp4tch5QPMoIp';

const baseUrl = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log('displaying...');
    $('#results-container').empty();
    $('#error').empty();
    const data = responseJson.data;
    for (let i = 0; i < data.length; i++) {
        $('#results-container').append(`
        <li class="park-name">${responseJson.data[i].fullName}</li>
        <p class="park-description">${responseJson.data[i].description}</p>
        <a href="${responseJson.data[i].url}"><button role="button type="button" class="park-button">More Info</button></a>
        `)
    }
    console.log(responseJson.data);
}

function getParks(resultQty, search) {
    console.log('getting parks');

    const params = {
        api_key: apiKey,
        stateCode: search,
        limit: resultQty - 1
    };
    console.log(params);

    const queryString = formatQueryParams(params);
    const url = baseUrl + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        
        .then(responseJson => displayResults(responseJson))
        .catch(err => { 
            console.log(err);
            $('#error').text(`Uh oh! Something went wrong: ${err.message}`);
        });
}

function handleSumbit() {
    $('#form').submit(event => {
        event.preventDefault();
        const search = $('#search').val().replace(/[,\s]/g,',').split(',');
        const resultQty = $('#result-quantity').val();
        getParks(resultQty, search);
    })
}

$(function onLoad() {
    handleSumbit();
})