#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";
import todoService from "./todo-service.js";

const server = new McpServer({
  name: "todo-mcp",
  version: "0.1.0",
});

server.tool(
  "get-todos",
  "Get all todos in a given list.",
  {
    list: z.string().describe("The list name to load todos from."),
  },
  async ({ list }) => {
    try {
      const todos = await todoService.getTodosByList(list);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(todos),
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to load todos for list: ${list}. (${e.toString()})`,
          },
        ],
      };
    }
  },
);

server.tool("get-lists", "Get all todo lists.", {}, async () => {
  try {
    const lists = await todoService.getAllLists();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(lists),
        },
      ],
    };
  } catch (e) {
    return {
      content: [
        {
          type: "text",
          text: `Failed to load lists. (${e.toString()})`,
        },
      ],
    };
  }
});

server.tool(
  "add-todo",
  "Adds a new todo to a given list.",
  {
    description: z.string().describe("The description of the todo."),
    list: z.string().describe("The list name to add the todo to."),
  },
  async ({ description, list }) => {
    try {
      await todoService.addTodo(description, list);

      return {
        content: [
          {
            type: "text",
            text: "Successfully created todo.",
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to create todo. (${e.toString()})`,
          },
        ],
      };
    }
  },
);

server.tool(
  "update-todo",
  "Updates a given todo.",
  {
    id: z.number().describe("The ID of the todo."),
    description: z.string().describe("The description of the todo."),
    list: z.string().describe("The list name to add the todo to."),
    completed: z.boolean().describe("The status of the todo."),
  },
  async ({ id, description, list, completed }) => {
    try {
      await todoService.updateTodo(id, description, list, completed);

      return {
        content: [
          {
            type: "text",
            text: "Successfully updated todo.",
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to update the todo with id: ${id}. (${e.toString()})`,
          },
        ],
      };
    }
  },
);

server.tool(
  "delete-todo",
  "Deletes a todo by the given id.",
  {
    id: z.number().describe("The ID of the todo."),
  },
  async ({ id }) => {
    try {
      await todoService.deleteTodo(id);

      return {
        content: [
          {
            type: "text",
            text: "Successfully deleted todo.",
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to delete todo with id: ${id}. (${e.toString()})`,
          },
        ],
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(() => {
  process.exit(1);
});
