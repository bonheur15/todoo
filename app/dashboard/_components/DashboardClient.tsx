"use client";

import React, {
  useState,
  useTransition,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  addListAction,
  addTodoAction,
  toggleTodoAction,
  deleteTodoAction,
  addSubtaskAction,
  toggleSubtaskAction,
  updateTodoAction,
  deleteListAction,
} from "@/app/actions";
import type { TodoList } from "@/lib/types";
import { User } from "next-auth";

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);
const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#bdb7ae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 3.3a2.1 2.1 0 0 1 3 3l-9.2 9.2-3.5.5.5-3.5 9.2-9.2z"/><path d="M13.5 5.5l1 1"/></svg>
);

type DashboardClientProps = {
  initialLists: TodoList[];
  user: User;
};

export default function DashboardClient({
  initialLists,
  user,
}: DashboardClientProps) {
  const [lists, setLists] = useState<TodoList[]>(initialLists);
  const [activeListId, setActiveListId] = useState<string | null>(
    initialLists[0]?.id || null
  );
  const [isPending, startTransition] = useTransition();
  const addListFormRef = useRef<HTMLFormElement>(null);
  const addTodoFormRef = useRef<HTMLFormElement>(null);
  const [modal, setModal] = useState<{ id: string; content: string; type: 'todo' | 'subtask' } | null>(null);
  const [modalInput, setModalInput] = useState("");
  const [modalPending, setModalPending] = useState(false);
  const [undoToast, setUndoToast] = useState<null | { id: string; type: 'todo' | 'subtask'; prevCompleted: boolean; subtasks?: { id: string; completed: boolean }[] }>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [deleteListModal, setDeleteListModal] = useState<null | { id: string; name: string }>(null);

  const TEMPLATE_LISTS = [
    {
      name: "My Day",
      todos: ["Check emails", "Morning meeting", "Plan top 3 tasks", "Take a walk"]
    },
    {
      name: "Grocery Shopping",
      todos: ["Milk", "Eggs", "Bread", "Vegetables", "Fruit"]
    },
    {
      name: "Work Tasks",
      todos: ["Reply to client", "Finish report", "Code review"]
    }
  ];
  const [showTemplates, setShowTemplates] = useState(initialLists.length === 0);
  const [addListInputFocused, setAddListInputFocused] = useState(false);

  useEffect(() => {
    setLists(initialLists);
  }, [initialLists]);

  const activeList = useMemo(
    () => lists.find((l) => l.id === activeListId),
    [lists, activeListId]
  );
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleAddList = async (formData: FormData) => {
    startTransition(async () => {
      const result = await addListAction(formData);
      if (result?.data) {
        setActiveListId(result.data.id);
        addListFormRef.current?.reset();
      } else if (result?.error) {
        console.error(result.error);
      }
    });
  };

  const handleAddTodo = async (formData: FormData) => {
    const newTodoContent = (
      (formData.get("newTodoContent") as string) || ""
    ).trim();
    if (!newTodoContent || !activeListId) return;
    startTransition(async () => {
      await addTodoAction(formData);
      addTodoFormRef.current?.reset();
    });
  };

  const handleToggleTodo = (todoId: string, completed: boolean) => {
    startTransition(() => {
      setLists((prev) =>
        prev.map((list) =>
          list.id === activeListId
            ? {
                ...list,
                todos: list.todos.map((t) =>
                  t.id === todoId ? { ...t, completed } : t
                ),
              }
            : list
        )
      );
      toggleTodoAction(todoId, completed);

      // Show undo snackbar only when marking as completed
      if (completed) {
        const todo = activeList?.todos.find((t) => t.id === todoId);
        setUndoToast({
          id: todoId,
          type: "todo",
          prevCompleted: !!todo?.completed,
          subtasks: todo?.subtasks?.map(st => ({ id: st.id, completed: st.completed })) || [],
        });
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        undoTimeoutRef.current = setTimeout(() => setUndoToast(null), 7000);
      }
    });
  };

  const handleDeleteTodo = (todoId: string) => {
    startTransition(() => {
      // Optimistic UI update
      setLists((prev) =>
        prev.map((list) =>
          list.id === activeListId
            ? { ...list, todos: list.todos.filter((t) => t.id !== todoId) }
            : list
        )
      );
      deleteTodoAction(todoId);
    });
  };

  const handleAddSubtask = async (
    formData: FormData,
    parentTodoId: string
  ) => {
    const newSubtaskContent = (
      (formData.get("newSubtaskContent") as string) || ""
    ).trim();
    if (!newSubtaskContent || !activeListId) return;
    formData.set("parentTodoId", parentTodoId);
    formData.set("activeListId", activeListId);
    startTransition(async () => {
      await addSubtaskAction(formData);
    });
  };

  const handleToggleSubtask = (subtaskId: string, completed: boolean) => {
    startTransition(() => {
      toggleSubtaskAction(subtaskId, completed);
    });
  };

  const handleDeleteSubtask = (subtaskId: string, parentTodoId: string) => {
    startTransition(() => {
      setLists((prev) =>
        prev.map((list) =>
          list.id === activeListId
            ? {
                ...list,
                todos: list.todos.map((t) =>
                  t.id === parentTodoId
                    ? {
                        ...t,
                        subtasks: t.subtasks?.filter((st) => st.id !== subtaskId) || [],
                      }
                    : t
                ),
              }
            : list
        )
      );
      deleteTodoAction(subtaskId);
    });
  };

  // Add this handler for confirming list deletion
  const handleConfirmDeleteList = async () => {
    if (!deleteListModal) return;
    console.log('Client: Deleting list', deleteListModal.id);
    await deleteListAction(deleteListModal.id);
    setDeleteListModal(null);
    // Optionally, update local state optimistically
    setLists((prev) => prev.filter((l) => l.id !== deleteListModal.id));
    // If the active list was deleted, switch to another
    if (activeListId === deleteListModal.id) {
      setActiveListId(prev => {
        const remaining = lists.filter(l => l.id !== deleteListModal.id);
        return remaining[0]?.id || null;
      });
    }
  };

  return (
    <div className="flex h-screen bg-[#FDF8F0] text-[#4A4238]">
      {/* --- STYLES (unchanged) --- */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,700&display=swap");
        .font-lora {
          font-family: "Lora", serif;
        }
        .font-nunito-sans {
          font-family: "Nunito Sans", sans-serif;
        }
        /* Circular checkbox style for tasks and subtasks */
        input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          background-color: transparent;
          margin: 0;
          font: inherit;
          color: currentColor;
          width: 1.35em;
          height: 1.35em;
          border: 2px solid #c19a6b;
          border-radius: 50%;
          display: grid;
          place-content: center;
          cursor: pointer;
          transition: border-color 0.2s, background-color 0.2s;
        }
        input[type="checkbox"]:checked {
          background-color: #60b6ff; /* Sky blue */
          border-color: #60b6ff;
        }
        input[type="checkbox"]::before {
          content: "";
          width: 1em;
          height: 1em;
          border-radius: 50%;
          display: block;
          background: none;
          transform: scale(0);
          transition: 120ms transform ease-in-out;
        }
        input[type="checkbox"]:checked::before {
          /* Centered tick SVG, adjusted viewBox and size for centering */
          content: url('data:image/svg+xml;utf8,<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 8.5L7 11L11.5 6.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
          display: block;
          background: none;
          transform: scale(1);
        }
        /* Subtask vertical line aligned with todo label */
        .subtask-group {
          position: relative;
          padding-left: 2.5em;
        }
        .subtask-group::before {
          content: "";
          position: absolute;
          left: 1.7em;
          top: 0.2em;
          bottom: 0.2em;
          width: 1.5px;
          background: #ece7df;
          border-radius: 1px;
        }
        .subtask-label {
          font-size: 0.98rem;
          color: #6D6356;
          font-weight: 400;
        }
        .subtask-label.completed {
          color: #a09486;
          /* Removed line-through */
        }
        .completed-label {
          color: #bdb7ae;
          font-size: 0.97em;
          margin-left: 0.5em;
          font-weight: 400;
        }
        .add-subtask-row {
          display: flex;
          align-items: center;
          gap: 0.5em;
          margin-top: 0.25em;
          margin-left: 2.5em;
          color: #bdb7ae;
          font-size: 0.95em;
          font-weight: 400;
          justify-content: space-between;
        }
        .add-subtask-row input[type="text"] {
          color: #bdb7ae;
          font-size: 0.97em;
          flex: 1 1 auto;
        }
        .add-subtask-row svg {
          width: 1.2em;
          height: 1.2em;
        }
        .add-subtask-plus {
          display: flex;
          align-items: center;
          height: 2.5em;
          margin-left: 0.5em;
        }
      `}</style>

      <aside className="w-64 h-full bg-[#F6EFE6] p-6 flex flex-col shrink-0 border-r border-[#EADFD1]">
        <h1 className="font-lora text-2xl font-medium mb-8">CozyTask</h1>

        <h2 className="font-nunito-sans text-sm font-bold text-[#867a6e] uppercase tracking-wider mb-3">
          My Lists
        </h2>
        <ul className="flex-grow space-y-1 overflow-y-auto -mr-2 pr-2">
          <AnimatePresence>
            {lists.map((list) => (
              <motion.li
                key={list.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center group"
              >
                <button
                  onClick={() => setActiveListId(list.id)}
                  className={`flex-1 text-left font-nunito-sans text-base p-2 rounded-lg transition-colors duration-200 ${
                    activeListId === list.id
                      ? "bg-[#EADFD1] text-[#4A4238] font-bold"
                      : "hover:bg-[#EADFD1]/60 text-[#6D6356]"
                  }`}
                >
                  {list.name}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteListModal({ id: list.id, name: list.name });
                  }}
                  className="ml-2 p-1 rounded hover:bg-red-100 text-[#bdb7ae] group-hover:text-red-500"
                  title="Delete list"
                >
                  <TrashIcon />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <form ref={addListFormRef} action={handleAddList} className="mt-4">
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 p-3 bg-[#F6EFE6] border border-[#EADFD1] rounded-xl shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-nunito-sans text-[#867a6e] text-sm">Try a template:</span>
                <button onClick={() => setShowTemplates(false)} className="text-[#bdb7ae] text-xs px-2 py-1 hover:underline">Dismiss</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {TEMPLATE_LISTS.map((tpl) => (
                  <button
                    key={tpl.name}
                    className="px-3 py-1 rounded-lg bg-[#60b6ff] text-white font-nunito-sans text-sm hover:bg-[#4f8ff9] transition"
                    onClick={async (e) => {
                      e.preventDefault();
                      // Create the list
                      const formData = new FormData();
                      formData.set("newListName", tpl.name);
                      const result = await addListAction(formData);
                      if (result?.data) {
                        // Add example todos
                        for (const todoText of tpl.todos) {
                          const todoForm = new FormData();
                          todoForm.set("newTodoContent", todoText);
                          todoForm.set("activeListId", result.data.id);
                          await addTodoAction(todoForm);
                        }
                        setActiveListId(result.data.id);
                        setShowTemplates(false);
                      }
                    }}
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="newListName"
              required
              placeholder="New list name..."
              className="w-full bg-transparent border-b-2 border-[#DCD1C2] focus:border-[#C19A6B] p-1 font-nunito-sans placeholder:text-[#a09486] focus:outline-none transition-colors"
              onFocus={() => { if (lists.length === 0) setShowTemplates(true); setAddListInputFocused(true); }}
              onBlur={() => setAddListInputFocused(false)}
            />
            <button
              type="submit"
              disabled={isPending}
              className="p-1 rounded-md hover:bg-[#EADFD1] text-[#C19A6B] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-4 border-t border-[#DCD1C2]">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 text-left font-nunito-sans text-base p-2 rounded-lg text-[#6D6356] hover:bg-[#EADFD1]/60"
          >
            <LogoutIcon />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {activeList ? (
          <>
            <div className="mb-8">
              <p className="font-nunito-sans text-lg text-[#867a6e]">
                {greeting}, {user.name}.
              </p>
              <h2 className="font-lora text-4xl md:text-5xl font-medium text-[#4A4238] mt-1">
                {activeList.name}
              </h2>
            </div>

            <form
              ref={addTodoFormRef}
              action={handleAddTodo}
              className="relative mb-6"
            >
              <input
                type="hidden"
                name="activeListId"
                value={activeListId || ""}
              />
              <input
                type="text"
                name="newTodoContent"
                required
                placeholder="Add a new task..."
                className="w-full bg-[#F6EFE6] border-2 border-transparent focus:border-[#EADFD1] focus:bg-white rounded-xl p-4 pr-12 font-nunito-sans text-lg placeholder:text-[#a09486] focus:outline-none transition-all duration-300"
              />
              <button
                type="submit"
                disabled={isPending}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-[#EADFD1] text-[#C19A6B] disabled:opacity-50"
              >
                <PlusIcon />
              </button>
            </form>

            <ul className="space-y-3">
              <AnimatePresence>
                {activeList.todos.map((todo) => (
                  <motion.li
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex flex-col bg-white/50 p-4 rounded-xl shadow-sm group"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onChange={(e) => handleToggleTodo(todo.id, e.target.checked)}
                        className="peer"
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className="ml-4 font-nunito-sans text-lg text-[#4A4238] peer-checked:line-through peer-checked:text-[#a09486] transition-colors duration-300 cursor-pointer"
                      >
                        {todo.content}
                      </label>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="ml-auto p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon />
                      </button>
                      <button
                        onClick={() => { setModal({ id: todo.id, content: todo.content, type: 'todo' }); setModalInput(todo.content); }}
                        className="ml-2 p-1 rounded hover:bg-[#EADFD1] text-[#bdb7ae]"
                        title="Edit task"
                      >
                        <PencilIcon />
                      </button>
                    </div>
                    {/* Subtasks */}
                    {todo.subtasks && todo.subtasks.length > 0 && (
                      <ul className="subtask-group mt-2 space-y-2">
                        {todo.subtasks.map((subtask) => (
                          <li key={subtask.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`subtask-${subtask.id}`}
                              checked={subtask.completed}
                              onChange={(e) => handleToggleSubtask(subtask.id, e.target.checked)}
                              className="peer"
                            />
                            <label
                              htmlFor={`subtask-${subtask.id}`}
                              className={`ml-3 subtask-label${subtask.completed ? " completed" : ""}`}
                            >
                              {subtask.content}
                            </label>
                            {subtask.completed && (
                              <span className="completed-label">- completed</span>
                            )}
                            <button
                              onClick={() => handleDeleteSubtask(subtask.id, todo.id)}
                              className="ml-2 p-1 rounded hover:bg-red-100 text-[#bdb7ae] hover:text-red-500"
                              title="Delete subtask"
                            >
                              <TrashIcon />
                            </button>
                            <button
                              onClick={() => { setModal({ id: subtask.id, content: subtask.content, type: 'subtask' }); setModalInput(subtask.content); }}
                              className="ml-2 p-1 rounded hover:bg-[#EADFD1] text-[#bdb7ae]"
                              title="Edit subtask"
                            >
                              <PencilIcon />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* Add Subtask Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget as HTMLFormElement;
                        const formData = new FormData(form);
                        handleAddSubtask(formData, todo.id);
                        form.reset();
                      }}
                      className="add-subtask-row"
                    >
                      <span style={{ display: 'flex', alignItems: 'center', opacity: 0.7, marginRight: '0.5em' }}>
                        {/* Right-down enter arrow icon */}
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4V12C4 13.1046 4.89543 14 6 14H16" stroke="#bdb7ae" stroke-width="1.5" stroke-linecap="round"/><path d="M13 11L16 14L13 17" stroke="#bdb7ae" stroke-width="1.5" stroke-linecap="round"/></svg>
                      </span>
                      <input
                        type="text"
                        name="newSubtaskContent"
                        placeholder="Add a subtask..."
                        className="bg-transparent border-b border-[#E5E7EB] focus:border-[#C19A6B] p-1 font-nunito-sans placeholder:text-[#bdb7ae] focus:outline-none transition-colors"
                      />
                      <span className="add-subtask-plus" style={{ marginLeft: 'auto' }}>
                        <button
                          type="submit"
                          className="p-1 rounded-md hover:bg-[#EADFD1] text-[#C19A6B] shrink-0"
                        >
                          <PlusIcon />
                        </button>
                      </span>
                    </form>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {activeList.todos.length === 0 && !isPending && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 px-8 bg-white/30 rounded-2xl mt-6"
              >
                <p className="font-lora text-2xl text-[#6D6356]">All clear!</p>
                <p className="font-nunito-sans text-lg text-[#867a6e] mt-2">
                  Add a task above to get started.
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center">
            <p className="font-lora text-3xl text-[#6D6356]">
              Welcome to CozyTask
            </p>
            <p className="font-nunito-sans text-xl text-[#867a6e] mt-2">
              Create a new list to begin.
            </p>
          </div>
        )}
      </main>

      {modal && (
        <AnimatePresence>
          <motion.div
            key="modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center"
            onClick={() => setModal(null)}
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-xl p-6 min-w-[320px] max-w-[90vw] relative"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-lora text-xl mb-3">Edit {modal.type === 'todo' ? 'Task' : 'Subtask'}</h3>
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  setModalPending(true);
                  await updateTodoAction(modal.id, modalInput.trim());
                  setModal(null);
                  setModalPending(false);
                }}
              >
                <input
                  type="text"
                  value={modalInput}
                  onChange={e => setModalInput(e.target.value)}
                  className="w-full border-b-2 border-[#EADFD1] focus:border-[#C19A6B] p-2 font-nunito-sans text-lg placeholder:text-[#a09486] focus:outline-none transition-colors mb-4"
                  autoFocus
                  maxLength={280}
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setModal(null)} className="px-4 py-2 rounded-lg bg-[#F6EFE6] text-[#a09486] font-nunito-sans">Cancel</button>
                  <button type="submit" disabled={modalPending || !modalInput.trim()} className="px-4 py-2 rounded-lg bg-[#60b6ff] text-white font-nunito-sans disabled:opacity-50">Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {deleteListModal && (
        <AnimatePresence>
          <motion.div
            key="delete-list-modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
            onClick={() => setDeleteListModal(null)}
          >
            <motion.div
              key="delete-list-modal"
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-xl p-6 min-w-[320px] max-w-[90vw] relative"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-lora text-xl mb-3">Delete List</h3>
              <p className="mb-4 font-nunito-sans text-base text-[#867a6e]">
                Are you sure you want to delete the list <b>{deleteListModal.name}</b>?
                This will also delete all tasks and subtasks in the list.
              </p>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setDeleteListModal(null)} className="px-4 py-2 rounded-lg bg-[#F6EFE6] text-[#a09486] font-nunito-sans">Cancel</button>
                <button type="button" onClick={handleConfirmDeleteList} className="px-4 py-2 rounded-lg bg-red-500 text-white font-nunito-sans">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {undoToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl px-6 py-3 flex items-center gap-4 z-50">
          <span className="font-nunito-sans text-[#4A4238]">
            Task marked as completed.
          </span>
          <button
            className="ml-4 px-3 py-1 rounded bg-[#60b6ff] text-white font-nunito-sans"
            onClick={() => {
              // Undo logic: revert completed state for todo and subtasks
              setLists((prev) =>
                prev.map((list) =>
                  list.id === activeListId
                    ? {
                        ...list,
                        todos: list.todos.map((t) =>
                          t.id === undoToast.id
                            ? {
                                ...t,
                                completed: undoToast.prevCompleted,
                                subtasks: t.subtasks?.map(st => {
                                  const prev = undoToast.subtasks?.find(s => s.id === st.id);
                                  return prev ? { ...st, completed: prev.completed } : st;
                                }) || [],
                              }
                            : t
                        ),
                      }
                    : list
                )
              );
              toggleTodoAction(undoToast.id, undoToast.prevCompleted);
              // Also revert subtasks if needed
              undoToast.subtasks?.forEach(st =>
                toggleSubtaskAction(st.id, st.completed)
              );
              setUndoToast(null);
            }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
