
var cache = {};


var inputEl     = document.getElementById('pokemon-input');
var findBtn     = document.getElementById('find-btn');
var errorMsg    = document.getElementById('error-msg');
var pokemonImg  = document.getElementById('pokemon-img');
var placeholder = document.getElementById('placeholder');
var cryAudio    = document.getElementById('pokemon-cry');
var moveSelects = ['move1','move2','move3','move4'].map(function(id) {
  return document.getElementById(id);
});
var addBtn      = document.getElementById('add-btn');
var teamList    = document.getElementById('team-list');

var currentPokemon = null;

findBtn.addEventListener('click', fetchPokemon);
inputEl.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') fetchPokemon();
});

function fetchPokemon() {
  var raw = inputEl.value.trim();
  if (!raw) {
    errorMsg.textContent = 'Please enter a Pokémon name or ID.';
    return;
  }

  
  var query = isNaN(raw) ? raw.toLowerCase() : raw;

  errorMsg.textContent = 'Loading...';

  if (cache[query]) {
    currentPokemon = cache[query];
    displayPokemon(cache[query]);
    errorMsg.textContent = '';
    return;
  }

  var url = 'https://pokeapi.co/api/v2/pokemon/' + query;
  console.log('Fetching:', url);

  fetch(url)
    .then(function(res) {
      console.log('Response status:', res.status);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(data) {
      console.log('Got data for:', data.name);
      cache[query] = data;
      currentPokemon = data;
      displayPokemon(data);
      errorMsg.textContent = '';
    })
    .catch(function(err) {
      console.error('Fetch error:', err);
      errorMsg.textContent = 'Pokémon not found (' + err.message + '). Try a name like "pikachu" or a number 1–151.';
      currentPokemon = null;
    });
}

function displayPokemon(data) {
  var imgUrl = data.sprites && data.sprites.front_default;
  if (imgUrl) {
    pokemonImg.src = imgUrl;
    pokemonImg.alt = data.name;
    pokemonImg.style.display = 'block';
    placeholder.style.display = 'none';
  }

  
  var cryUrl = (data.cries && (data.cries.latest || data.cries.legacy)) || null;
  if (cryUrl) {
    cryAudio.src = cryUrl;
    cryAudio.load();
  }

 
  var moves = data.moves.map(function(m) { return m.move.name; });
  moveSelects.forEach(function(sel) {
    sel.innerHTML = '';
    moves.forEach(function(moveName) {
      var opt = document.createElement('option');
      opt.value = moveName;
      opt.textContent = moveName;
      sel.appendChild(opt);
    });
  });
}


addBtn.addEventListener('click', function() {
  if (!currentPokemon) {
    errorMsg.textContent = 'Find a Pokémon first!';
    return;
  }

  var selectedMoves = moveSelects.map(function(s) { return s.value; }).filter(Boolean);

  var entry = document.createElement('div');
  entry.className = 'team-entry';

  var img = document.createElement('img');
  img.src = (currentPokemon.sprites && currentPokemon.sprites.front_default) || '';
  img.alt = currentPokemon.name;

  var ul = document.createElement('ul');
  ul.className = 'team-moves';
  selectedMoves.forEach(function(m) {
    var li = document.createElement('li');
    li.textContent = m;
    ul.appendChild(li);
  });

  entry.appendChild(img);
  entry.appendChild(ul);
  teamList.appendChild(entry);
});
