import {
    Auth,
    define,
    History,
    Switch
  } from "@calpoly/mustang";
  import { html } from "lit";
  import { HeaderElement } from "./components/portfolio-header";
  import { HomeViewElement } from "./views/home-view";
//   import { AboutViewElement } from "./views/about-view";
  import { ContactViewElement } from "./views/contact-view";
//   import { ProjectViewElement } from "./views/project-view";
  
  // Define your routes BEFORE the define() call
  const routes = [
    {
      path: "/app/project/:slug", // For individual case studies
      view: (params: Switch.Params) => html`
        <project-view project-slug=${params.slug}></project-view>
      `
    },
    {
      path: "/app/about",
      view: () => html`
        <about-view></about-view>
      `
    },
    {
      path: "/app/contact", 
      view: () => html`
        <contact-view></contact-view>
      `
    },
    {
      path: "/app",
      view: () => html`
        <home-view></home-view>
      `
    },
    {
      path: "/",
      redirect: "/app"
    }
  ];
  
  define({
    "mu-auth": Auth.Provider,
    "mu-history": History.Provider,
    "portfolio-header": HeaderElement,
    "home-view": HomeViewElement,
    // "about-view": AboutViewElement,
    "contact-view": ContactViewElement,
    // "project-view": ProjectViewElement,
    "mu-switch": class AppSwitch extends Switch.Element {
      constructor() {
        super(routes, "app:history", "app:auth");
      }
    }
  });