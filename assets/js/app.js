const input  = document.getElementById('input');
const searchBtn = document.getElementById('search-btn');
const container = document.querySelector('.container');

searchBtn.addEventListener('click', queryCountry);


function queryCountry() {
    const name = input.value;
    if (!name) return;

    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${name}?fields=name,subregion,population,currencies,languages,flags`);
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
    currencies }) {
        const populationFormat = new Intl.NumberFormat('US', { notation: 'compact' }).format(population);
        const [{name: currency, symbol}] = Object.values(currencies);

        const countryEl = document.createElement('div');
        container.innerHTML = '';
        countryEl.innerHTML = `
        <div class="country">
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
        </div>
        `;
        container.insertAdjacentElement('beforeend', countryEl);
    };
