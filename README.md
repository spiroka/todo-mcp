# TODO MCP server

An MCP server implementation for managing to-dos, created for learning purposes.

## Usage

Install the package globally:

```sh
npm i -g todo-mcp
```

After installation, the server can be started with the following command:

```sh
npx todo-mcp --db-path=path/to/your/todos.db
```

### Adding to Cursor

Add the following to your `mcp.json`:

```json
{
  "mcpServers": {
    "todo": {
      "command": "npx",
      "args": ["todo-mcp", "--db-path=path/to/your/todos.db"]
    }
  }
}
```

## Configuration

- `--db-path`: The tool uses SQLite to store the to-dos.
By providing a value for `--db-path` you can set where the database file will be created.
Setting this option is optional, but highly recommended to avoid losing your todos when upgrading to a new version.

## Tools

The server provides the following tools:

- `get-todos`: get all to-dos in a given list.
- `get-lists`: get all available lists.
- `add-todo`: add a new to-do to a given list.
- `update-todo`: update the to-do with the given ID (eg. to mark as done, or update wording).
- `delete-todo`: delete the to-do with the given ID.
