import type { Task } from "@/types/task";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({ task, onEdit, onDelete }: Props) {
  return (    
    <div className="flex  items-center justify-between bg-indigo-50 hover:bg-indigo-100 border-l-4 border-l-indigo-600 p-4 shadow-sm hover:shadow-md transition">  
      {/* Task info */}
      <div>
        <p className="font-medium text-gray-800">{task.title}</p>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="text-sm text-indigo-600 cursor-pointer"
        >
          <EditIcon />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task);
          }}
          className="text-sm text-red-600 cursor-pointer"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}
