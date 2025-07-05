import sqlite from "sqlite3";
import { fileURLToPath } from "url";
import { resolve, dirname, join } from "path";
import { homedir } from "os";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));

let dbPath;

function resolveHome(path) {
  if (path.startsWith("~/")) {
    return join(homedir(), path.slice(1));
  }

  return path;
}

if (args["db-path"]) {
  dbPath = resolveHome(args["db-path"]);
} else {
  dbPath = resolve(dirname(fileURLToPath(import.meta.url)), "todos.db");
}

console.log(dbPath);
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  db.exec(`
    create table if not exists todos (
      id integer primary key,
      description text,
      is_completed int not null default 0,
      list text not null
    )
  `);
});

export function getTodosByList(list) {
  return new Promise((resolve, reject) =>
    db.all("select * from todos where list = ?", list, (err, rows) =>
      err ? reject(err) : resolve(rows)
    )
  );
}

export function getAllLists() {
  return new Promise((resolve, reject) =>
    db.all("select list from todos group by list", (err, rows) =>
      err ? reject(err) : resolve(rows.map(({ list }) => list))
    )
  );
}

export function addTodo(description, list) {
  return new Promise((resolve, reject) =>
    db.run(
      "insert into todos(description, list) values(?, ?)",
      [description, list],
      (err) => (err ? reject(err) : resolve())
    )
  );
}

export function updateTodo(id, description, list, completed) {
  return new Promise((resolve, reject) =>
    db.run(
      "update todos set description = ?, list = ?, is_completed = ? where id = ?",
      [description, list, completed, id],
      (err) => (err ? reject(err) : resolve())
    )
  );
}

export function deleteTodo(id) {
  return new Promise((resolve, reject) =>
    db.run("delete from todos where id = ?", [id], (err) =>
      err ? reject(err) : resolve()
    )
  );
}

export default {
  getTodosByList,
  getAllLists,
  addTodo,
  updateTodo,
  deleteTodo,
};
