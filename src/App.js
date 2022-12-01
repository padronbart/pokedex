import { useEffect, useState } from "react";

function App() {
  function handleIndex(){
     const next = Math.min(indx + 3, 949);
     setIndx(next);
  }
  const [indx, setIndx] = useState(1);
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
  return (
    <>
    <div className="App">
      <header className="App-header">
        {
          pokemon.evoSprites.map(img => (
            <img src={img}/>
          ))
        }
          
      </header>
    </div>
    <button onClick={handleIndex}>+</button>
    <button>-</button>
    </>
  );
}

export default App;
