"use client";

import { useEffect, useMemo, useState } from "react";

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

export interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


function getTimeMeta(dueDate: Date) {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();

  const abs = Math.abs(diff);

  const minutes = Math.floor(abs / (1000 * 60));
  const hours = Math.floor(abs / (1000 * 60 * 60));
  const days = Math.floor(abs / (1000 * 60 * 60 * 24));

  //  OVERDUE
  if (diff < 0) {
    if (minutes < 1) return { text: "Overdue just now", color: "text-red-600" };
    if (minutes < 60)
      return {
        text: `Overdue by ${minutes} minute${minutes !== 1 ? "s" : ""}`,
        color: "text-red-600",
      };
    if (hours < 24)
      return {
        text: `Overdue by ${hours} hour${hours !== 1 ? "s" : ""}`,
        color: "text-red-600",
      };
    return {
      text: `Overdue by ${days} day${days !== 1 ? "s" : ""}`,
      color: "text-red-600",
    };
  }

  //  UPCOMING
  if (minutes < 1) return { text: "Due now!", color: "text-orange-600" };
  if (minutes < 60)
    return {
      text: `Due in ${minutes} minute${minutes !== 1 ? "s" : ""}`,
      color: "text-orange-600",
    };
  if (hours < 24)
    return {
      text: `Due in ${hours} hour${hours !== 1 ? "s" : ""}`,
      color: "text-yellow-600",
    };
  if (days === 1)
    return { text: "Due tomorrow", color: "text-green-600" };

  return {
    text: `Due in ${days} day${days !== 1 ? "s" : ""}`,
    color: "text-green-600",
  };
}

export default function TodoCard({ todo, onToggle, onEdit, onDelete }: TodoCardProps) {
  const dueDate = useMemo(() => new Date(todo.dueDate), [todo.dueDate]);
  const [meta, setMeta] = useState(getTimeMeta(dueDate));

  useEffect(() => {
    const i = setInterval(() => setMeta(getTimeMeta(dueDate)), 60000);
    return () => clearInterval(i);
  }, [dueDate]);

  return (
    <article
      data-testid="test-todo-card"
      className="w-full bg-white rounded-2xl shadow-md p-4 flex flex-col gap-4"
    >
      <div className="flex justify-between">
        <div>
          <h3
            data-testid="test-todo-title"
            className={`font-semibold text-lg ${todo.completed ? "line-through text-gray-400" : "text-gray-900"}`}
          >
            {todo.title}
          </h3>
          <p data-testid="test-todo-description" className="text-sm text-gray-600">
            {todo.description}
          </p>
        </div>

        <span
          data-testid="test-todo-priority"
          className={`text-xs px-2 py-2 flex items-center justify-center rounded-full ${
            todo.priority === "High"
              ? "bg-red-100 text-red-700"
              : todo.priority === "Medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {todo.priority}
        </span>
      </div>

      <div>
        <time data-testid="test-todo-due-date" className="text-gray-500">
          Due {formatDate(dueDate)}
        </time>
        <time
          data-testid="test-todo-time-remaining"
          className={`block text-xs ${meta.color}`}
        >
          {meta.text}
        </time>
      </div>

      <div data-testid="test-todo-tags" className="flex flex-wrap gap-2">
        {todo.tags.map((tag: string) => (
          <span
            key={tag}
            data-testid={`test-todo-tag-${tag}`}
            className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            data-testid="test-todo-complete-toggle"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span className="text-gray-600">Complete</span>
        </label>

        <span data-testid="test-todo-status" className="text-xs text-gray-500">
          {todo.completed ? "Done" : todo.status}
        </span>
      </div>

      <div className="flex justify-end gap-2">
        <button
          data-testid="test-todo-edit-button"
          onClick={() => onEdit(todo)}
          className="border border-gray-600 text-gray-600 px-2 py-1 rounded"
        >
          Edit
        </button>
        <button
          data-testid="test-todo-delete-button"
          onClick={() => onDelete(todo.id)}
          className="border px-2 py-1 rounded text-red-600"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
