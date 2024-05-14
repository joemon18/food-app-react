import React, { useContext } from 'react'
import "./style.css"
import { ThemeContext } from '../../App'

const ThemeButton = () => {

const {theme, setTheme} = useContext(ThemeContext) 

console.log(theme, setTheme)

  return (
    <button style={theme ? {backgroundColor : "#12343b", border: 'none'} : {} } onClick={()=> setTheme(!theme)} className='themeButton'>Change Theme</button>
  )
}

export default ThemeButton
