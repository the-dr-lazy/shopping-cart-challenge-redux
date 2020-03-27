import React from 'react';
import ReactDOM from 'react-dom';

import * as App from './app';

const rootElement = document.getElementById("root");

function main() {  
  ReactDOM.render(<App.component />, rootElement);
}

main()
