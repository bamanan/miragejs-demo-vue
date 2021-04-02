import { mount } from "@vue/test-utils";
import { Response } from "miragejs";

import { makeServer } from "../../src/server";

import App from "../../src/App.vue";

let server;

beforeEach(() => {
  server = makeServer({ environment: "test" });
});

//Retrieve and show all todos from the server test
it("shows all the todos from our server", async () => {
  server.create("todo", { id: 1, content: "Learn MirageJS" });
  server.create("todo", { id: 2, content: "Integrate With Vue.js" });

  const wrapper = mount(App);

  //let's wait our vue component finished loading data
  //we know it when the data-testid attribute enters the DOM
  await waitFor(wrapper, '[data-testid="todo-1"]');
  await waitFor(wrapper, '[data-testid="todo-2"]');

  expect(wrapper.find('[data-testid="todo-1"]').text()).toBe("Learn MirageJS");
  expect(wrapper.find('[data-testid="todo-2"]').text()).toBe(
    "Integrate With Vue.js"
  );
});

//No todos test
it("shows a message when there's no todo", async () => {
  const wrapper = mount(App);
  await waitFor(wrapper, '[data-testid="no-todos"]');

  expect(wrapper.find('[data-testid="no-todos"]').text()).toBe("No todos !");
});

it("handles error responses from the server", async () => {
  //Override Mirage's route handler for /todos, just for this test

  server.get("/todos", () => {
    return new Response(500, {}, { error: "The database is taking a break." });
  });

  const wrapper = mount(App);
  await waitFor(wrapper, '[data-testid="server-error"]');

  expect(wrapper.find('[data-testid="server-error"]').text()).toBe(
    "The database is taking a break."
  );
});

const waitFor = function(wrapper, selector) {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      const todoEl = wrapper.findAll(selector);
      if (todoEl.length > 0) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });
};

afterAll(() => {
  server.shutdown();
});
