import React, { useRef, useState } from "react";
import { GoGrabber } from "react-icons/go";
import { useSetRecoilState } from "recoil";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TodoType } from "@repo/types/Todo";
import { TiDeleteOutline } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";
import { IoMdCheckmark } from "react-icons/io";
import { toast } from "sonner";
import todoAtom from "../store/todo";
import { deleteTodo, editState, editTodo } from "../actions/todoActions";
interface TodoLayoutProps {
  todo: TodoType;
}
const TodoLayout: React.FC<TodoLayoutProps> = ({ todo }) => {
  const [edit, setEdit] = useState(false);
  const setTodos = useSetRecoilState<TodoType[]>(todoAtom);
  const editRef = useRef<HTMLInputElement | null>(null);
  let timeout = useRef<NodeJS.Timeout | undefined>();
  const deleteHandler = async () => {
    setTodos((oldTodos) =>
      oldTodos!.filter((oldTodo) => oldTodo.id !== todo.id),
    );
    const response: { success: boolean; data?: TodoType } = await deleteTodo(
      todo.id,
    );
    if (response.success) {
      toast.success("Todo deleted");
    } else {
      toast.error("Failed to delete todo");
    }
  };
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const markAsCompleted = () => {
    let state = !todo.completed;
    //Updating the local state
    setTodos((oldTodos) =>
      oldTodos?.map((oldTodo) => {
        if (oldTodo.id === todo.id) {
          state = !oldTodo.completed;
          return { ...oldTodo, completed: !oldTodo.completed };
        } else return oldTodo;
      }),
    );
    clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      //Updating the server state
      const response: { success: boolean; data?: TodoType } = await editState(
        todo.id,
        state,
      );
      if (response.success) {
        toast.success("Marked as completed");
      } else {
        toast.error("Failed to mark as completed");
      }
    }, 500);
  };
  const editTodoInput = () => {
    editRef.current!.disabled = false;
    editRef.current!.focus();
    setEdit(true);
  };
  const editTodoOutput = async () => {
    const newTask: string = editRef.current!.value;
    editRef.current!.disabled = true;
    setEdit(false);
    setTodos((oldTodos) =>
      oldTodos?.map((oldTodo) => {
        if (oldTodo.id === todo.id) {
          return { ...oldTodo, task: newTask };
        } else return oldTodo;
      }),
    );
    const response: { success: boolean; data?: TodoType } = await editTodo(
      todo.id,
      newTask,
    );
    if (response.success) {
      toast.success("Todo updated");
    } else {
      toast.error("Failed to update todo");
    }
  };
  const keyboardHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      editTodoOutput();
    }
    if (event.key == "Escape") {
      editRef.current!.disabled = true;
      setEdit(false);
    }
    if (event.key == "Delete") {
      deleteHandler();
    }
  };
  return (
    <div
      key={todo.id}
      className="flex touch-none items-center gap-2 rounded-full border-2 border-slate-800/50 bg-black/30 p-2 backdrop-blur-md hover:border-2 hover:border-slate-400"
      {...attributes}
      ref={setNodeRef}
      style={style}
    >
      <GoGrabber
        className="size-10 cursor-grab rounded-md text-white"
        {...listeners}
      />
      <label className="flex grow items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          className="size-5"
          onChange={markAsCompleted}
        />
        <input
          className={`w-full rounded-full bg-black/20 p-2 px-3 text-xl text-white focus:outline-none ${todo.completed ? "text-slate-500 line-through" : null}`}
          defaultValue={todo.task.trim()}
          disabled
          ref={editRef}
          onKeyDown={keyboardHandler}
        />
      </label>
      <div className="flex items-center gap-2">
        {edit ? (
          <IoMdCheckmark
            onClick={editTodoOutput}
            className="size-6 text-white hover:text-green-500"
          />
        ) : (
          <CiEdit
            onClick={editTodoInput}
            className="size-6 text-gray-300 hover:text-green-500"
          />
        )}
        <TiDeleteOutline
          className="size-6 cursor-pointer text-gray-300 hover:text-red-500"
          onClick={deleteHandler}
        />
      </div>
    </div>
  );
};

export default TodoLayout;
