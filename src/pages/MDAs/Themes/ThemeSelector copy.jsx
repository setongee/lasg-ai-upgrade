import React from 'react'
import Theme1 from './Theme1/Theme1';

const ThemeSelector = ({theme, data}) => {

switch (data.theme) {
    case "Theme1":
    return <Theme1/>
}

}

export default ThemeSelector