
fetch('https://zenquotes.io/api/random')
  .then(res => res.json())
  .then(data => {
    const quoteBox = document.getElementById("quote-box");
    if (data && data[0]) {
      quoteBox.textContent = `"${data[0].q}" — ${data[0].a}`;
    }
  })
  .catch(error => {
    console.error("Error loading quote:", error);
    document.getElementById("quote-box").textContent = "Could not load quote.";
  });

document.getElementById("go-stocks").addEventListener("click", () => {
  window.location.href = "stocks.html";
});

document.getElementById("go-dogs").addEventListener("click", () => {
  window.location.href = "dogs.html";
});

if (annyang) {
  const commands = {
    'hello': () => alert('Hello, world!'),
    'change the color to pink': () => {
      document.body.style.backgroundColor = 'pink';
    },
    'navigate to home': () => window.location.href = 'home.html',
    'navigate to dogs': () => window.location.href = 'dogs.html',
    'navigate to stocks': () => window.location.href = 'stocks.html'
  };

  annyang.addCommands(commands);

  document.getElementById('enable-audio').addEventListener('click', () => annyang.start());
  document.getElementById('disable-audio').addEventListener('click', () => annyang.abort());
}
