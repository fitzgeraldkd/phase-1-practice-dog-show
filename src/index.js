document.addEventListener('DOMContentLoaded', () => {
    sendRequest('/dogs', renderDogs);
    const form = document.getElementById('dog-form');
    form.addEventListener('submit', handleFormSubmit);
    form.setAttribute('dog-id', '');
});

function renderDogs(dogs) {
    const tableBody = document.getElementById('table-body');
    tableBody.replaceChildren();
    dogs.forEach(dog => {
        const dogRow = document.createElement('tr');
        const dogName = document.createElement('td');
        const dogBreed = document.createElement('td');
        const dogSex = document.createElement('td');
        const dogEdit = document.createElement('td');
        const dogEditBttn = document.createElement('button');

        dogName.className = 'dog-name';
        dogName.textContent = dog.name;
        dogBreed.className  ='dog-breed';
        dogBreed.textContent = dog.breed;
        dogSex.className = 'dog-sex';
        dogSex.textContent = dog.sex;
        dogEditBttn.textContent = 'Edit';
        dogEditBttn.addEventListener('click', (e) => handleEditBttnClick(e, dog.id));

        dogEdit.append(dogEditBttn);
        dogRow.append(dogName, dogBreed, dogSex, dogEdit);
        tableBody.append(dogRow);
    })
}

function handleEditBttnClick(e, dogId) {
    const form = document.getElementById('dog-form');
    form.setAttribute('dog-id', dogId);
    const dogRow = e.target.parentElement.parentElement;
    form.querySelector('input[name=name]').value = dogRow.querySelector('.dog-name').textContent;
    form.querySelector('input[name=breed]').value = dogRow.querySelector('.dog-breed').textContent;
    form.querySelector('input[name=sex]').value = dogRow.querySelector('.dog-sex').textContent;

}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (form.getAttribute('dog-id') !== '') {
        const callback = () => {
            sendRequest('/dogs', renderDogs);
        };
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                name: form.querySelector('input[name=name]').value,
                breed: form.querySelector('input[name=breed]').value,
                sex: form.querySelector('input[name=sex]').value
            })
        };
        sendRequest(`/dogs/${form.getAttribute('dog-id')}`, callback, options);
    }

    form.reset();
    form.setAttribute('dog-id', '');
}

function sendRequest(endpoint, callback, options={}) {
    fetch(`http://localhost:3000${endpoint}`, options)
        .then(resp => resp.json())
        .then(callback)
        .catch(error => {
            console.error(error);
            console.error(`Endpoint: ${endpoint}`);
            console.table(options);
        })
}