///////////////////////////
// JS IMPORTS
//////////////////////////

// Reveal config and plugins
import './reveal-dependencies-config.js' // need config before importing plugins
import './reveal-dependencies.js'
import './reveal-config.js';

// Import FontAwesome: https://fontawesome.com/how-to-use/use-with-node-js
import fontawesome from './../../node_modules/@fortawesome/fontawesome'
import solid from './../../node_modules/@fortawesome/fontawesome-free-solid';
import regular from './../../node_modules/@fortawesome/fontawesome-free-regular';
import brands from './../../node_modules/@fortawesome/fontawesome-free-brands';
fontawesome.library.add(solid, regular, brands)

// allow search pseudo elements in CSS (e.g. :after )
fontawesome.config['searchPseudoElements'] = true

// // If Mathjax referenced locally
// import './../../node_modules/mathjax/MathJax.js'


/////////////////////////
// STYLE IMPORTS
////////////////////////

// Reveal js styles and theme
import './../styles/main.scss';
