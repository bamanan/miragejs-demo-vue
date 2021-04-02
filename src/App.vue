<template>
  <div id="app">
    <div v-if="serverError" data-testid="server-error">
      {{ serverError }}
    </div>

    <div v-else-if="todos.length === 0" data-testid="no-todos">
      No todos !
    </div>

    <div v-else>
      <ul id="todos">
        <li
          v-for="todo in todos"
          v-bind:key="todo.id"
          :data-testid="'todo-' + todo.id"
        >
          {{ todo.content }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      todos: [],
      serverError: null,
    };
  },
  mounted() {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          this.serverError = json.error;
        } else {
          this.todos = json.todos;
        }
      });
  },
};
</script>
