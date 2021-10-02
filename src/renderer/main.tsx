/*
|----------------------------------------------------------------------------------------
|React and Router
|----------------------------------------------------------------------------------------
*/

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "./router";
import store from "./store/store";
import globalStyle from "./styles/globalStyle";

/*
|----------------------------------------------------------------------------------------
|React and Router
|----------------------------------------------------------------------------------------
*/

import GlobalStyle from "./styles/globalStyle";

/*
|----------------------------------------------------------------------------------------
|Render the app
|----------------------------------------------------------------------------------------
*/

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalStyle />
      <Router />
    </Provider>
  </React.StrictMode>,
  document.getElementById("app")
);
