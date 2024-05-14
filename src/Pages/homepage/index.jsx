import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react'
import Search from '../../components/search';
import "./style.css";
import RecipeItem from '../../components/recipies';
import FavoriteItem from '../../components/favorite-item';
import { ThemeContext } from '../../App';



const dummydata = 'dummydata'

const reducer = (state, action) => {

  switch (action.type) {
    case 'filterFavorites':

      return {
        ...state,
        filteredValue: action.value
      };

    default:
      return state
  }
}

const initialState = {
  filteredValue: ''
}

const Homepage = () => {

  const [loadingState, setLoadingState] = useState(false)

  const [recipes, setRecipes] = useState([])

  const [favorites, setFavorites] = useState([])

  const [apiCalledSuccess, setApiCalledSuccess] = useState(false)

  const [filteredState, dispatch] = useReducer(reducer, initialState)

  const { theme } = useContext(ThemeContext)


  const getDataFromSearchComponent = (getData) => {

    setLoadingState(true)


    async function getRecipes() {
      const apiResponse = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=da3ef5e357904620ad3f812d027c4b12&query=${getData}`);
      const result = await apiResponse.json();
      const { results } = result;

      if (results && results.length > 0) {
        setLoadingState(false);
        setRecipes(results);
        setApiCalledSuccess(true)
      }
    }
    getRecipes()
  };


  const addToFavorites = useCallback((getCurrentRecipyItem) => {
    let copyFavorites = [...favorites];

    const index = copyFavorites.findIndex(
      (item) => item.id === getCurrentRecipyItem.id
    );
    if (index === -1) {
      copyFavorites.push(getCurrentRecipyItem)
      setFavorites(copyFavorites);
      localStorage.setItem('favorites', JSON.stringify(copyFavorites));
      window.scrollTo({top : '0', behavior : "smooth"})
    } else {
      alert('Item already in favorites')
    }
  }, [favorites])




  const removeFromFavorites = (getCurrentId) => {
    let copyFavorites = [...favorites]
    copyFavorites = copyFavorites.filter((item) => item.id !== getCurrentId)
    setFavorites(copyFavorites);
    localStorage.setItem('favorites', JSON.stringify(copyFavorites));
  };


  useEffect(() => {
    const extractFavoritesFromLocalStorageonPageLoad = JSON.parse(
      localStorage.getItem('favorites')
    );
    setFavorites(extractFavoritesFromLocalStorageonPageLoad);
  }, []);

  // console.log(favorites);

  const filteredFavoritesItems = favorites.filter(item =>
    item.title.toLowerCase().includes(filteredState.filteredValue)
  );

  const renderRecipies = useCallback(() => {

    if (recipes && recipes.length > 0) {
      return recipes.map((item) => (
        <RecipeItem
          addToFavorites={() => addToFavorites(item)}
          id={item.id}
          image={item.image}
          title={item.title}
        />
      ));
    }
  }, [recipes, addToFavorites]);

  return (
    <div className='homepage'>
      <Search
        getDataFromSearchComponent={getDataFromSearchComponent}
        dummydatacopy={dummydata}
        apiCalledSuccess={apiCalledSuccess}
        setApiCalledSuccess={setApiCalledSuccess}
      />

      <div className='favorites-wrapper'>
        <h1 className='favorites-title' style={theme ? { color: "#12343b" } : {}}>Favorites</h1>


        <div className='search-favorites'>
          <input
            onChange={(event) =>
              dispatch({ type: 'filterFavorites', value: event.target.value })
            }
            value={filteredState.filteredValue}
            name='searchfavorites'
            placeholder='Search for Favorites'
          />
        </div>

        <div className='favorites'>
          {
            !filteredFavoritesItems.length && <div style={{display : 'flex',justifyContent:'center',width : '100%'}} className='no-fav'>No Favorites Found</div>
          }
          {filteredFavoritesItems && filteredFavoritesItems.length > 0
            ? filteredFavoritesItems.map((item) => (
              <FavoriteItem
                removeFromFavorites={() => removeFromFavorites(item.id)}
                id={item.id}
                image={item.image}
                title={item.title}
              />

            ))
            : null}
        </div>

      </div>

      {/* show loading state */}

      {loadingState && (
        <div className='loading'>Loading recipes ! Please wait. </div>
      )}

    

      {/* show loading state */}

      <div className='items'>
        {
          renderRecipies()
        }
      </div>

      {
        !loadingState && !recipes.length && <div className='no-items'>No Recipies found</div>
      }
    </div>
  )
}

export default Homepage;
