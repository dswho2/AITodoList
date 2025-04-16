// src/components/TodoItem.tsx

import React from 'react'

interface TodoItemProps {
  text: string
  isComplete: boolean
  onToggle: () => void
  onDelete: () => void
}

export const TodoItem: React.FC<TodoItemProps> = ({ text, isComplete, onToggle, onDelete }) => {
  return (
    <li className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3 shadow-md hover:bg-slate-700 transition break-words">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isComplete}
          onChange={onToggle}
          className="form-check-input me-2 cursor-pointer"
        />
        <span className={isComplete ? 'line-through text-slate-500' : 'text-slate-100'}>
          {text}
        </span>
      </div>
      <button
        onClick={onDelete}
        aria-label="Delete todo"
        className="text-red-500 hover:text-red-600 font-bold !text-2xl transition-transform transform hover:scale-150 bg-transparent border-0 p-0"
      >
        ×
      </button>
    </li>
  )
}
