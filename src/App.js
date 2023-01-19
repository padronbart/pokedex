import { useEffect, useState } from "react";

function App() {
  function handleIndexNext(){
    if(indx === 949) return;
     const next = indx + 3;
     setIndx(next);
  }
  function handleIndexPrev(){
    if(indx === 0) return;
    const next = indx - 3;
    setIndx(next);
 }
  const [indx, setIndx] = useState(1);
  const [inputValue, setInputValue] = useState('');

  const [pokemon, setPokemon] = useState({
    pokemonIndex: indx,
    pokemonData: {},
    pokemonDescription: "",
    speciesData: {},
    evoSprites: [],
    evoNames: [],
    moves: [],
    loading: false
  });
  useEffect(() => {
    const request = `https://pokeapi.co/api/v2/pokemon/${indx}`;
        fetch(request)
            .then(response => response.json())
            .then(data => {
                setPokemon(pokemon => {
                  return{
                    ...pokemon,
                    pokemonData: data,
                    pokemonIndex: data.id
                  }
                });
                const speciesRequest = data.species.url;
                return fetch(speciesRequest);
            })
            .then(response => response.json())
            .then(data => {
                setPokemon(pokemon => {
                  return{
                    ...pokemon,
                    speciesData: data,
                    loading: false
                  }
                });
                const evo_chain = data.evolution_chain.url;
                fetch(evo_chain)
                    .then(response => response.json())
                    .then(data => {
                        const api = "https://pokeapi.co/api/v2/pokemon/";
                        const first = data.chain;
                        let second;
                        let third;
                        let evos = [];
                        if (first) {
                            const e1 = fetch(`${api}${first.species.name}/`);
                            evos.push(e1);
                            second = first.evolves_to[0];
                        }
                        if (second) {
                            const e2 = fetch(`${api}${second.species.name}/`);
                            third = second.evolves_to[0];

                            evos.push(e2);
                        }
                        if (third) {
                            const e3 = fetch(`${api}${third.species.name}/`);
                            evos.push(e3);
                        }
                        Promise.all(evos)
                            .then(responses => Promise.all(responses.map(value => value.json())))
                            .then(dataList => {
                                const sprites = dataList.map(v => v.sprites.front_default);
                                const names = dataList.map(n => n.name);
                                setPokemon(pokemon => {
                                  return{
                                    ...pokemon,
                                     evoSprites: sprites, evoNames: names 
                                  }
                                });
                            });
                    });
            });
  }, [indx])


  async function handleSubmit() {
    const response = await fetch('http://localhost:9001/myPokemons',{
      method: 'POST',
      body: JSON.stringify({id: inputValue}),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
  };
  async function handleDelete() {
    const user = {
      id : inputValue,
      pokemon: pokemon.evoNames[0]
    }
    const response = await fetch('http://localhost:9001/delete',{
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
  };
  function handleChange(event) {
    setInputValue(event.target.value);
  }
  async function handleQuery(){
    const user = {
      id : inputValue,
      pokemon: pokemon.evoNames[0]
    }
    fetch('http://localhost:9001', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Do something with the response data
        console.log(data);
      });
  }
  return (
    <>
    <div className="App">
      <header className="App-header">
      </header>
    </div>
    <div className="logo">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/269px-International_Pok%C3%A9mon_logo.svg.png"
        height="100%"
        alt="logo"
      />
    </div>

    <div id="pokedex">
      <div id="left-panel">
        <div className="left-top-container">
          <div className="lights-container">
            <div className="big-light-boarder">
              <div className="big-light blue">
                <div className="big-dot light-blue"></div>
              </div>
            </div>
            <div className="input-screen">
              <input  id="password" type="password" value={inputValue} onChange={handleChange} />
            </div>
            
          </div>
        </div>
        <div className="screen-container">
          <div className="screen">
            <div className="top-screen-lights">
              <div className="mini-light red"></div>
              <div className="mini-light red"></div>
            </div>
            <div id="main-screen">
              <img className="poke" src={pokemon.evoSprites[0]}/>
            </div>
            <div className="bottom-screen-lights">
              <div className="small-light red">
                <div className="dot light-red"></div>
              </div>
              <div className="burger">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="buttons-container">
          <div className="upper-buttons-container">
            <div className="big-button" onClick={handleIndexNext}> + </div>
            <div className="long-buttons-container">
              <div className="big-button" onClick={handleIndexPrev}> - </div>
            </div>
          </div>
          <div className="nav-buttons-container">
            <div className="dots-container">
              <div>.</div>
              <div>.</div>
            </div>
            <div className="green-screen">
              <span id="name-screen">{pokemon.evoNames[0]}</span>
            </div>
            <div className="right-nav-container">
              <div className="nav-button">
                <div className="nav-center-circle"></div>
                <div className="nav-button-vertical"></div>
                <div className="nav-button-horizontal">
                  <div className="border-top"></div>
                  <div className="border-bottom"></div>
                </div>
              </div>
              <div className="bottom-right-nav-container">
                <div className="small-light red">
                  <div className="dot light-red"></div>
                </div>
                <div className="dots-container">
                  <div className="black-dot">.</div>
                  <div className="black-dot">.</div>
                  <div className="black-dot">.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      </div>
      
      <button onClick={handleSubmit} className="">Your pokemons</button>
      <button onClick={handleQuery}>Save pokemon</button>
      <button onClick={handleDelete}>Free pokemon</button>
    </>
  );
}

export default App;
