"use client";

import { useEffect, useState } from "react";
import TodoCard from "./components/TodoCard";

export type Priority = "Low" | "Medium" | "High";
export type Status = "Pending" | "In Progress" | "Done";

export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  tags: string[];
  completed: boolean;
}

const STORAGE_KEY = "todo-app-data";

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export default function Home() {
  
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = loadTodos();

    if (stored.length > 0) return stored;

    // fallback demo data
    return [
      {
        id: "1",
        title: "Finish Dashboard UI",
        description: "Build and polish dashboard",
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
        priority: "High",
        status: "Pending",
        tags: ["work", "urgent"],
        completed: false,
      },
      {
        id: "2",
        title: "Study CSC505",
        description: "Prepare for exam",
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
        priority: "Medium",
        status: "In Progress",
        tags: ["school"],
        completed: false,
      },
      {
        id: "3",
        title: "Fix UI bugs",
        description: "Resolve layout issues",
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        priority: "Low",
        status: "Pending",
        tags: ["dev"],
        completed: false,
      },
    ];
  });

  const [form, setForm] = useState<Todo | null>(null);
  const [filter, setFilter] = useState("all");

  //  Persist to localStorage (correct usage of effect)
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const handleCreate = () => {
    setForm({
      id: Date.now().toString(),
      title: "",
      description: "",
      dueDate: new Date().toISOString(),
      priority: "Medium",
      status: "Pending",
      tags: ["work"],
      completed: false,
    });
  };

  const handleSave = () => {
    if (!form) return;

    setTodos((prev) => {
      const exists = prev.find((t) => t.id === form.id);
      if (exists) return prev.map((t) => (t.id === form.id ? form : t));
      return [form, ...prev];
    });

    setForm(null);
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const filteredTodos = todos
    .filter((t) => {
      if (filter === "all") return true;
      return t.priority.toLowerCase() === filter;
    })
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime()
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">

        {/* FILTER */}
        <div className="flex gap-2 flex-wrap">
          {["all", "high", "medium", "low"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm text-gray-600 border-gray-600 ${
                filter === f ? "bg-black text-white" : "bg-white border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={handleCreate}
          className="bg-black text-white py-2 rounded-xl"
        >
          + Add Todo
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={setForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* MODAL */}
      {form && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md flex flex-col gap-3 text-black">

            <input
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              placeholder="Title"
              className="border p-2 rounded"
            />

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description"
              className="border p-2 rounded"
            />

            <select
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value as Priority,
                })
              }
              className="border p-2 rounded"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input
              type="datetime-local"
              onChange={(e) =>
                setForm({
                  ...form,
                  dueDate: new Date(e.target.value).toISOString(),
                })
              }
              className="border p-2 rounded"
            />

            <input
              placeholder="Tags (comma separated)"
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim()),
                })
              }
              className="border p-2 rounded"
            />

            <div className="flex gap-2 justify-end">
              <button onClick={() => setForm(null)}>Cancel</button>
              <button
                onClick={handleSave}
                className="bg-black text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}