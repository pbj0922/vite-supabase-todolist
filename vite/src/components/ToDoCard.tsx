import { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";
import { IToDo } from "..";
import supabase from "../lib/supabaseClient";

interface ToDoCardProps {
  todo: IToDo;
  toDos: IToDo[];
  setToDos: Dispatch<SetStateAction<IToDo[]>>;
}

const ToDoCard: FC<ToDoCardProps> = ({ todo, toDos, setToDos }) => {
  const [isDone, setIsDone] = useState<boolean>(todo.isdone);
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);
  const [updateContent, setUpdateContent] = useState<string>(todo.content);
  const [toDoContent, setToDoContent] = useState<string>(todo.content);

  const onClickIsDone = async () => {
    try {
      setIsDone(!isDone);

      const { data } = await supabase.functions.invoke("is-done-to-do", {
        body: {
          toDoId: todo.id,
        },
      });

      setIsDone(data.isdone);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitUpdateToDo = async (e: FormEvent) => {
    try {
      e.preventDefault();

      const { data } = await supabase.functions.invoke("update-to-do", {
        body: {
          toDoId: todo.id,
          content: updateContent,
        },
      });

      setToDoContent(data.content);
      setUpdateToggle(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickDeleteToDo = async () => {
    try {
      const { data } = await supabase.functions.invoke("delete-to-do", {
        body: {
          toDoId: todo.id,
          content: updateContent,
        },
      });

      if (data.status === 204) {
        const temp = toDos.filter((v) => v.id !== todo.id);

        setToDos(temp);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li>
      {updateToggle ? (
        <form onSubmit={onSubmitUpdateToDo}>
          <input
            type="text"
            value={updateContent}
            onChange={(e) => setUpdateContent(e.target.value)}
          />
          <input type="submit" value="수정" />
        </form>
      ) : (
        <button
          className={`cursor-pointer ${isDone && "line-through"}`}
          onClick={onClickIsDone}
        >
          {toDoContent}
        </button>
      )}
      <button onClick={() => setUpdateToggle(!updateToggle)}>
        {updateToggle ? "취소" : "수정"}
      </button>
      <button onClick={onClickDeleteToDo}>삭제</button>
    </li>
  );
};

export default ToDoCard;
