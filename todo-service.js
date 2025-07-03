import todoRepository from "./todo-repository.js";

function getTodosByList(list) {
  return todoRepository.getTodosByList(list.toLowerCase());
}

export function addTodo(description, list) {
  return todoRepository.addTodo(description, list.toLowerCase());
}

export function updateTodo(id, description, list, completed) {
  return todoRepository.updateTodo(
    id,
    description,
    list.toLowerCase(),
    completed ? 1 : 0,
  );
}

export async function getAllLists() {
  const lists = await todoRepository.getAllLists();

  return lists.sort((a, b) => a.localeCompare(b));
}

export function deleteTodo(id) {
  return todoRepository.deleteTodo(id);
}

export default {
  getTodosByList,
  getAllLists,
  addTodo,
  updateTodo,
  deleteTodo,
};
