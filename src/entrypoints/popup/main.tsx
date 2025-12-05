/* @refresh reload */
import { render } from "solid-js/web";
import App from "./app";
import "./popup.css";

render(() => <App />, document.getElementById("app")!);
