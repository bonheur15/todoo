"use client";

import React, { useRef, useTransition } from "react";
import { addTodoAction } from "@/app/actions";

type AddTodoFormProps = {
  activeListId: string;
  parentTodoId?: string;
};

export default function AddTodoForm({
  activeListId,
  parentTodoId,
}: AddTodoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    const newTodoContent = (
      (formData.get("newTodoContent") as string) || ""
    ).trim();
    if (!newTodoContent || !activeListId) return;

    if (parentTodoId) {
      formData.append("parentTodoId", parentTodoId);
    }

    startTransition(async () => {
      await addTodoAction(formData);
      formRef.current?.reset();
    });
  };

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

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="relative mb-6">
      <input type="hidden" name="activeListId" value={activeListId} />
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
  );
}
