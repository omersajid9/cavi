import React from "react";
import { Routes, Route } from "react-router";
import ROUTES from "Constants/routes";
import loadable from "@loadable/component";

// Load bundles asynchronously so that the initial render happens faster
const Copy = loadable(() =>
  import(/* webpackChunkName: "ContextMenuChunk" */ "Pages/copy/copy")
);
const Paste = loadable(() =>
  import(/* webpackChunkName: "ContextMenuChunk" */ "Pages/paste/paste")
);



class AppRoutes extends React.Component {
  render() {  
    return (
      <Routes>
        <Route path={ROUTES.PASTE} element={<Paste />}></Route>
        <Route path={ROUTES.COPY} element={<Copy />}></Route>
        <Route path={ROUTES.WELCOME} element={<Paste />}></Route>
      </Routes>
    );
  }
}

export default AppRoutes;

{/* <Route path={ROUTES.WELCOME} element={<UndoRedo />}></Route> */}