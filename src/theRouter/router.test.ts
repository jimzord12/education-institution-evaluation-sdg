/// <reference lib="dom" />
import { expect, test, beforeEach, describe } from "bun:test";
import { MyRouter } from "./router";
import { Component } from "../types/componentType";

beforeEach(() => {
  // Set up the DOM before each test
  document.body.innerHTML = `
    <nav>
      <a href="/home" data-link>Home</a>
      <a href="/about" data-link>About</a>
      <a href="/contact" data-link>Contact</a>
    </nav>
    <div id="app"></div>
  `;
});

describe("MyRouter", () => {
  test("should match the route", () => {
    const router = new MyRouter();

    // Add the mandatory /404 route to prevent errors during initial render
    router.addRoute("/404", {
      render: () => "<h1>404 Not Found</h1>",
    });

    // Add the /home route
    router.addRoute("/home", {
      render: () => "<h1>Home</h1>",
    });

    const Post: Component<{ id: number }> = {
      render: (params) => {
        if (!params) {
          console.error("Post component requires an ID parameter");
          return "<h1>Problem with render(params)</h1>";
        }

        return `<h1>The Post's ID: ${params.id}</h1>`;
      },
    };

    // Add the /home route
    router.addRoute("/posts/:id", Post);

    const route = router.routes.get("/home");

    // Ensure that the route exists and has a render method
    expect(route).toBeDefined();
    expect(typeof route!.render).toBe("function");

    // Test the render output
    expect(route!.render()).toBe("<h1>Home</h1>");
    expect(Post.render({id: 5000})).toBe(`<h1>The Post's ID: 5000</h1>`);
  });
});
