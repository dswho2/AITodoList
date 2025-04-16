// src/App.tsx
// Main React app component for displaying, adding, and generating todos.

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_TODOS } from './graphql/queries'
import { ADD_TODO, COMPLETE_TODO, TRASH_TODO } from './graphql/mutations'
import { TodoItem } from './components/TodoItem'
import { API_URL } from './config'

interface Todo {
  id: string
  text: string
  isComplete: boolean
}

export default function App() {
  const [text, setText] = useState('')
  const [generatedTodo, setGeneratedTodo] = useState<string | null>(null)
  const [dotCount, setDotCount] = useState(0)
  const [isGenerating, setIsGenerating] = useState<boolean>(() => {
    return localStorage.getItem('isGenerating') === 'true'
  })

  const { data, loading, error } = useQuery<{ todos: Todo[] }>(GET_TODOS)
  const [addTodo] = useMutation(ADD_TODO, { refetchQueries: [GET_TODOS] })
  const [completeTodo] = useMutation(COMPLETE_TODO, { refetchQueries: [GET_TODOS] })
  const [trashTodo] = useMutation(TRASH_TODO, { refetchQueries: [GET_TODOS] })

  useEffect(() => {
    if (!isGenerating) return
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4)
    }, 400)
    return () => clearInterval(interval)
  }, [isGenerating])

  useEffect(() => {
    if (isGenerating) {
      localStorage.setItem('isGenerating', 'true')
    } else {
      localStorage.removeItem('isGenerating')
    }
  }, [isGenerating])

  const handleAdd = async () => {
    const trimmed = text.trim()
    if (!trimmed) return
    await addTodo({ variables: { text: trimmed } })
    setText('')
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedTodo('')

    try {
      const res = await fetch(`${API_URL}/generate-stream`)
      const reader = res.body?.getReader()
      const decoder = new TextDecoder('utf-8')
      let fullText = ''

      while (true) {
        const { value, done } = await reader!.read()
        if (done) break
        const chunk = decoder.decode(value)
        fullText += chunk
        setGeneratedTodo((prev) => (prev || '') + chunk)
      }
    } catch {
      // fail silently or show error message component
    } finally {
      setIsGenerating(false)
      setDotCount(0)
    }
  }

  const handleAccept = async () => {
    if (generatedTodo) {
      await addTodo({ variables: { text: generatedTodo } })
      setGeneratedTodo(null)
    }
  }

  const handleReject = () => setGeneratedTodo(null)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-3xl text-red-500 font-bold text-center">Todo List</h1>

        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Add a new todo..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd()
            }}
          />
          <button onClick={handleAdd} className="btn btn-primary">
            Add
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            className="bg-sky-500 text-white px-4 py-2 rounded shadow transition hover:bg-sky-600 hover:scale-105 mb-6 flex items-center gap-2"
            disabled={isGenerating}
          >
            {isGenerating && (
              <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{isGenerating ? `Generating${'.'.repeat(dotCount)}` : 'Generate Todo'}</span>
          </button>
        </div>

        {generatedTodo && (
          <div className="bg-slate-800 p-4 rounded shadow border border-slate-700">
            <p className="mb-3">
              Suggested Task: <strong>{generatedTodo}</strong>
            </p>
            <div className="d-flex gap-2">
              <button className="btn btn-success btn-sm" onClick={handleAccept}>
                Accept
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={handleReject}>
                Reject
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center text-slate-400">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-400">Error loading todos</p>
        ) : (
          <ul className="space-y-3 list-none p-0 m-0">
            {data?.todos.map((todo) => (
              <TodoItem
                key={todo.id}
                text={todo.text}
                isComplete={todo.isComplete}
                onToggle={() => completeTodo({ variables: { id: todo.id } })}
                onDelete={() => trashTodo({ variables: { id: todo.id } })}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
