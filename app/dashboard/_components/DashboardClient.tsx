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

type DashboardClientProps = {
  initialLists: TodoList[];
  user: User & { isAnonymous?: boolean }; // Explicitly include isAnonymous in the type
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
        /* Custom checkbox style for a cozier feel */
        input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          background-color: transparent;
          margin: 0;
          font: inherit;
          color: currentColor;
          width: 1.25em;
          height: 1.25em;
          border: 0.15em solid #c19a6b;
          border-radius: 0.35em;
          transform: translateY(-0.075em);
          display: grid;
          place-content: center;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }
        input[type="checkbox"]::before {
          content: "";
          width: 0.65em;
          height: 0.65em;
          transform: scale(0);
          transition: 120ms transform ease-in-out;
          box-shadow: inset 1em 1em #c19a6b;
          transform-origin: bottom left;
          clip-path: polygon(
            14% 44%,
            0 65%,
            50% 100%,
            100% 16%,
            80% 0%,
            43% 62%
          );
        }
        input[type="checkbox"]:checked {
          background-color: #f6efe6;
        }
        input[type="checkbox"]:checked::before {
          transform: scale(1);
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
              >
                <button
                  onClick={() => setActiveListId(list.id)}
                  className={`w-full text-left font-nunito-sans text-base p-2 rounded-lg transition-colors duration-200 ${
                    activeListId === list.id
                      ? "bg-[#EADFD1] text-[#4A4238] font-bold"
                      : "hover:bg-[#EADFD1]/60 text-[#6D6356]"
                  }`}
                >
                  {list.name}
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <form ref={addListFormRef} action={handleAddList} className="mt-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="newListName"
              required
              placeholder="New list name..."
              className="w-full bg-transparent border-b-2 border-[#DCD1C2] focus:border-[#C19A6B] p-1 font-nunito-sans placeholder:text-[#a09486] focus:outline-none transition-colors"
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

        {user.isAnonymous && (
          <div className="mt-4 p-3 bg-[#EADFD1]/50 rounded-lg text-center">
            <p className="font-nunito-sans text-sm text-[#6D6356]">
              Enjoying your session?
            </p>
            <a
              href="/auth" // Point to the main auth page to sign up/in
              className="font-nunito-sans text-sm font-bold text-[#C19A6B] hover:underline"
            >
              Sign up or Log in
            </a>
            <p className="font-nunito-sans text-xs text-[#867a6e] mt-1">
              to save your work permanently.
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-[#DCD1C2]">
          <a
            href="/about"
            className="w-full flex items-center gap-3 text-left font-nunito-sans text-base p-2 rounded-lg text-[#6D6356] hover:bg-[#EADFD1]/60 mb-2"
          >
            {/* You might want to add an icon here if you have one for "About Us" */}
            <span>About Us</span>
          </a>
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
                {greeting}, {user.isAnonymous ? "Guest User" : user.name}.
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
                    className="flex items-center bg-white/50 p-4 rounded-xl shadow-sm group"
                  >
                    <input
                      type="checkbox"
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onChange={(e) =>
                        handleToggleTodo(todo.id, e.target.checked)
                      }
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
    </div>
  );
}
