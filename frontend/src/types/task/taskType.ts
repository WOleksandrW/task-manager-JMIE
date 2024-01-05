type TaskType = {
  _id: string;
  id: number;
  title: string;
  description: string;
  author: string;
  executor: string;
  priority: number;
  projectId: string;
  columnId: string;
};

export default TaskType;
