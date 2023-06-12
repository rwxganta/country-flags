const input  = document.getElementById('input');
const searchBtn = document.getElementById('search-btn');
const container = document.querySelector('.container');
const neighbors = document.querySelector('.neighbors');

searchBtn.addEventListener('click', queryCountry);


function queryCountry() {
    const name = input.value;
    if (!name) return;

    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${name}?fields=name,subregion,population,currencies,languages,flags,borders`);
    request.send();

    request.addEventListener('load', () => {
        if (request.status >= 400) {
            throw new Error(`"${name}" replied ${request.status}`);
            return;
        }
        const [obj] = JSON.parse(request.response);
        createCountry(obj);
    });
}


function createCountry({
    flags,
    name: {common},
    population,
    subregion,
    languages: {...langs},
    currencies,
    borders }) {
        const populationFormat = new Intl.NumberFormat('US', { notation: 'compact' }).format(population);
        const [{name: currency, symbol}] = Object.values(currencies);

        const countryEl = document.createElement('div');
        neighbors.innerHTML = '';
        countryEl.innerHTML = `
            <div class="country-flag">
                <img class='flag-image' src="${flags.svg}" alt="">
            </div>
            <div class="country-info">
                <h2>${common}</h2>
                <p><span>Region: </span>${subregion}</p>
                <p><span>Language: </span>${Object.values(langs)}</p>
                <p><span>Population: </span>${populationFormat}</p>
                <p><span>Currency: </span>${symbol} ${currency}</p>
            </div>
        `;

        countryEl.classList.add('country');
        container.insertAdjacentElement('afterbegin', countryEl);
        container.removeChild(container.firstElementChild);
        if (borders.length === 0) return;
        borders.forEach((country) => {
            const request2 = new XMLHttpRequest();
            request2.open('GET', `https://restcountries.com/v3.1/alpha?codes=${country}`);
            request2.send();

            request2.addEventListener('load', () => {
                const [obj] = JSON.parse(request2.response);
                const { name: {common}, flags: {svg} } = obj;
                createNeighbors(common, svg);
            });
        });
};

function createNeighbors(name, flag) {
    const neighborEl = document.createElement('div');
    neighborEl.classList.add('neighbor');
    neighborEl.innerHTML = `
            <div class="neighbor-flag">
                <img src="${flag}" alt="">
            </div>
            <h2 class='neighbor-name'>${name}</h2>
    `;
    neighbors.insertAdjacentElement('afterbegin', neighborEl);
}