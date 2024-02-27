const loadPhones = async (searchText, dataLimit) => {
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}`;
    const resp = await fetch(url);
    const data = await resp.json();
    displayPhones(data.data, dataLimit);
}

const displayPhones = (phones, dataLimit) => {
    const phonesContainer = document.getElementById('phone-container');
    phonesContainer.innerHTML = ``;

    // search not found
    const notFound = document.getElementById('not-found-msg');
    if (phones.length === 0) {
        notFound.classList.remove('d-none');
    } else {
        notFound.classList.add('d-none');
    }
    // display 10 phones only
    const showAll = document.getElementById('show-all');
    if (dataLimit && phones.length > 10) {
        phones = phones.slice(0, 10);

        showAll.classList.remove('d-none');
    } else {
        showAll.classList.add('d-none');
    }
    phones.forEach(phone => {
        const phoneDiv = document.createElement('div');
        phoneDiv.classList.add('col');
        phoneDiv.innerHTML = `
        <div class="card h-100">
            <img src="${phone.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${phone.phone_name}</h5>
                <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>

                <!-- Button trigger modal -->
                <button onclick="loadPhoneDetails('${phone.slug}')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#phoneDetailModal">Show Details</button>
            </div>
        </div>
        `;

        phonesContainer.appendChild(phoneDiv);
    });
    //stop spinner loader
    toggleSpinner(false);
}
const processSearch = (dataLimit) => {
    toggleSpinner(true);
    const searchField = document.getElementById('search-field');
    const searchText = searchField.value;

    loadPhones(searchText, dataLimit);
}
// handle search button click
document.getElementById('btn-search').addEventListener('click', function () {
    //start spinner loader
    processSearch(10);
})
// search input field enter key handler
document.getElementById('search-field').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        processSearch(10);
    }
});
const toggleSpinner = isLoading => {
    const loaderSection = document.getElementById('loader');
    if (isLoading) {
        loaderSection.classList.remove('d-none');
    } else {
        loaderSection.classList.add('d-none');
    }
}

// not the best way to load show all
document.getElementById('btn-show-all').addEventListener('click', function () {
    processSearch();
})

const loadPhoneDetails = async id => {
    const url = `https://openapi.programming-hero.com/api/phone/${id}`;
    const resp = await fetch(url);
    const data = await resp.json();
    displayPhoneDetails(data.data);

}

const displayPhoneDetails = phone => {
    console.log(phone);
    const modalTitle = document.getElementById('phoneDetailModalLabel');
    modalTitle.innerText = phone.name;
    const phoneDetails = document.getElementById('phone-details');
    // Clear existing content
    phoneDetails.innerHTML = '';

    // Display release date and memory
    const releaseDate = phone.releaseDate ? phone.releaseDate : '0000-00-00';
    const memory = phone.mainFeatures && phone.mainFeatures.memory ? phone.mainFeatures.memory : '00';

    // Display sensor data using Array.join() and template literals
    const sensors = phone.mainFeatures && phone.mainFeatures.sensors ? phone.mainFeatures.sensors.join(', ') : 'Not available';

    // Construct HTML content
    phoneDetails.innerHTML = `
        <p>Release Date: ${releaseDate}</p>
        <p>Memory: ${memory}</p>
        <p>Sensors: ${sensors}</p>
    `;

}
loadPhones('apple');