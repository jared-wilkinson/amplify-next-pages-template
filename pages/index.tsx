import { Authenticator } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";



const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  const [done, setDone] = useState<Array<Schema["Done"]["type"]>>([]);
  
  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function listDone() {
    client.models.Done.observeQuery().subscribe({
      next: (data) => setDone([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  useEffect(() => {
    listDone();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  function deleteDone(id: string) {
    client.models.Done.delete({ id });
  }

  function completeTask(id: string) {
    client.models.Done.create({ content: todos.find((todo) => todo.id === id)?.content });
    client.models.Todo.delete({ id });
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
    <main>
      <h1>{user?.signInDetails?.loginId}''s todos</h1>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li 
          onClick={() => completeTask(todo.id)}
          key={todo.id}>{todo.content}
          </li>
        ))}
      </ul>
      <div>
      <h1>My done</h1>
       <ul>
         {done.map((done) => (
          <li
          onClick={() => deleteDone(done.id)}
          key={done.id}>{done.content}</li>
        ))}
        </ul>
      </div>
      <div>
        App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/">
          Review next steps of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  )}
  </Authenticator>
  )
}
