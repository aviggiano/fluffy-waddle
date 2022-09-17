import * as React from "react";
import { Admin, Resource, ListGuesser } from "react-admin";
import postgrestRestProvider from "@promitheus/ra-data-postgrest";

const dataProvider = postgrestRestProvider("/api/");

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="Blockchains" list={ListGuesser} />
    <Resource name="Contracts" list={ListGuesser} />
    <Resource name="Reports" list={ListGuesser} />
  </Admin>
);

export default App;
