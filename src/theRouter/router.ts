// router.ts
import { Component } from "../types/componentType";

export class MyRouter {
  public routes: Map<string, Component>;

  constructor(initialRoutes?: Map<string, Component>) {
    this.routes = initialRoutes || new Map<string, Component>();
    this.loadInitialRoute();
    this.bindLinkClicks();
    window.addEventListener("popstate", () =>
      this.renderRoute(location.pathname)
    );
  }

  navigate(path: string) {
    window.history.pushState({}, path, window.location.origin + path);
    this.renderRoute(path);
  }

  addRoute(path: string, component: Component<any>) {
    this.routes.set(path, component);
  }

  private parseParams(path: string) {
    const params: { [key: string]: string } = {};
    const routeParts = path.split("/");

    routeParts.forEach((part) => {
      if (part[0] === ":") {
        const [key, value] = part.split(":");
        params[key] = value;
      }
    });

    return params;
  }

  private bindLinkClicks() {
    document.body.addEventListener("click", (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) {
        console.error("Event target is not an HTMLElement");
        return;
      }

      if (e.target.matches("a[data-link]")) {
        e.preventDefault();
        const path = e.target.getAttribute("href") as string | null;

        if (!path) {
          console.error("Link does not have an href attribute");
          return;
        }

        this.navigate(path);
      }
    });
  }

  private renderRoute(path: string) {
    if (!this.routes.has(path)) {
      console.error(`Route not found, please add using .addRoute(): ${path}`);
    }

    // if (!this.routes.has("/404")) {
    //   console.error(
    //     "Route not found, please add a 404 route, this route is mandatory"
    //   );
    //   return;
    // }
    const notFoundComponent: Component = {
      render: () => "<h1>404 Not Found</h1>",
    };
    
    const component = this.routes.get(path) || notFoundComponent;
    const app = document.getElementById("app");

    if (!app) {
      console.error("App element not found");
      return;
    }

    if (!(component && component.render instanceof Function)) {
      console.error("Component is not a valid component");
      return;
    }

    app.innerHTML = component.render();
    this.highlightActiveLink(path);
  }

  private highlightActiveLink(path: string) {
    document.querySelectorAll("nav a").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === path);
    });
  }

  private loadInitialRoute() {
    this.renderRoute(location.pathname);
  }
}
