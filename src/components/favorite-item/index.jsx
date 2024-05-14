import { useContext } from "react";
import "./style.css"
import { ThemeContext } from "../../App";

const FavoriteItem = (props) => {

  const {id, image, title, removeFromFavorites } = props;

  const {theme} = useContext(ThemeContext)

  // console.log(props, 'recipy-item-props');

  return (
    <div key={id} className='favorite-item'>
      <div>
        <img src={image} alt="image of favorite recipe" />
      </div>
      <p style={theme ? {color : "#12343b"} : {}}>{title}</p>
      <button style={theme ? {backgroundColor : "#12343b"} : {}} type="button" onClick={removeFromFavorites}>Remove from Favorites</button>
    </div>
  );
};

export default FavoriteItem
