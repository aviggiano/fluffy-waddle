import * as React from "react";
import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

const dataProvider = jsonServerProvider(
  "https://jsonplaceholder.typicode.com/typicode/demo"
);

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="blockchains" list={ListGuesser} />
    <Resource name="contracts" list={ListGuesser} />
    <Resource name="reports" list={ListGuesser} />
  </Admin>
);

export default App;
