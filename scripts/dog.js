fetch('https://dog.ceo/api/breeds/image/random/10')
  .then(res => res.json())
  .then(data => {
    const carousel = document.getElementById('dog-carousel');
    data.message.forEach(imgUrl => {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.classList.add('slider-img');
      carousel.appendChild(img);
    });
  })
  .catch(err => console.error("Failed to load dog images:", err));

fetch('https://dogapi.dog/api/v2/breeds')
  .then(res => res.json())
  .then(data => {
    const breeds = data.data;
    const container = document.getElementById('breed-buttons');

    breeds.forEach(breed => {
      const button = document.createElement('button');
      button.textContent = breed.attributes.name;
      button.classList.add('breed-button');
      button.addEventListener('click', () => showBreedInfo(breed));
      container.appendChild(button);
    });
  })
  .catch(err => console.error("Failed to load breed list:", err));

function showBreedInfo(breed) {
  const infoDiv = document.getElementById('breed-info');
  infoDiv.innerHTML = `
    <h3>${breed.attributes.name}</h3>
    <p>${breed.attributes.description || 'No description available.'}</p>
    <p><strong>Life Span:</strong> ${breed.attributes.life.min}–${breed.attributes.life.max} years</p>
  `;
}

if (annyang) {
  const commands = {
    'load dog breed *breed': function(breedName) {
      fetch('https://dogapi.dog/api/v2/breeds')
        .then(res => res.json())
        .then(data => {
          const match = data.data.find(b =>
            b.attributes.name.toLowerCase() === breedName.toLowerCase()
          );
          if (match) {
            showBreedInfo(match);
          } else {
            alert('Breed not found.');
          }
        });
    },
    'navigate to home': () => window.location.href = 'home.html',
    'navigate to stocks': () => window.location.href = 'stocks.html'
  };

  annyang.addCommands(commands);
  document.getElementById('enable-audio').addEventListener('click', () => annyang.start());
  document.getElementById('disable-audio').addEventListener('click', () => annyang.abort());
}
