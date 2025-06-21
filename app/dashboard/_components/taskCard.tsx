import { AnimatePresence, motion } from "framer-motion";
import { Todo } from "@/lib/types";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import AddTodoForm from "./AddTodoForm";

interface TaskCardProps {
  activeListId: string | null;
  todo: Todo;
  onToggleTodo: (id: string, completed: boolean) => void;
  onDeleteTodo: (id: string) => void;
  level?: number;
}
const TaskCard: React.FC<TaskCardProps> = ({
  activeListId,
  todo,
  onToggleTodo,
  onDeleteTodo,
  level = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const hasSubtodos = todo.subtodos && todo.subtodos.length > 0;

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
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`group rounded-lg border border-gray-300 ${
        isExpanded && "pb-2"
      }`}
      style={{ marginLeft: `${level * 20}px`, marginRight: `${level * 20}px` }}
    >
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggleTodo(todo.id, e.target.checked)}
          className="peer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />

        <span
          className={`flex-1 ${
            todo.completed ? "line-through text-gray-500" : "text-gray-900"
          }`}
        >
          {todo.content}
        </span>
        <button
          onClick={() => onDeleteTodo(todo.id)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-all"
          aria-label="Delete task"
        >
          <TrashIcon />
        </button>
        <button
          onClick={() => setIsAddTaskOpen(!isAddTaskOpen)}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all"
          aria-label="Delete task"
        >
          <PlusIcon />
        </button>
        {hasSubtodos && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
            aria-label={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
          >
            {isExpanded ? (
              <FaChevronUp className="h-4 w-4" />
            ) : (
              <FaChevronDown className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && hasSubtodos && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-2"
          >
            {todo.subtodos!.map((subtodo) => (
              <TaskCard
                activeListId={activeListId}
                key={subtodo.id}
                todo={subtodo}
                onToggleTodo={onToggleTodo}
                onDeleteTodo={onDeleteTodo}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {isAddTaskOpen && (
        <div className="mt-2">
          <AddTodoForm activeListId={activeListId!} parentTodoId={todo.id} />
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;
