import { ProjectType, SingleProjectType } from '../types/project/projectType';
import CommentType from '../types/comment/commentType';
import TaskType from '../types/task/taskType';
import { NotedItemUserType } from '../types/user/notedItemUserType';
import UserType from '../types/user/userType';
import CurrentUserType from '../types/user/currentUserType';
import ColumnProjectType from '../types/project/columnProjectType';

type MethodType = 'set' | 'get' | 'put' | 'delete' | 'disable';

type SubscribeConnectionType = () => void;
type SubscribeCloseType = () => void;
type SubscribeOpenType = (value: boolean, code?: string) => void;
export type SubscribeStringType = (method: MethodType, tasks: string[]) => void;
export type SubscribeTaskType = (method: MethodType, tasks: TaskType[] | string[]) => void;
export type SubscribeCommentType = (method: MethodType, comments: CommentType[] | string[]) => void;
export type SubscribeProjectType = (method: MethodType, projects: ProjectType[] | string[]) => void;
export type SubscribeTeamType = (method: MethodType, users: UserType[] | string[]) => void;
export type SubscribeNotedType = (
  method: MethodType,
  noted: NotedItemUserType[] | string[]
) => void;
export type SubscribeAlertType = (
  method: MethodType,
  alerts: { type: string; message: string }[]
) => void;
export type SubscribeUserType = (method: MethodType, user: CurrentUserType) => void;
export type SubscribeSingleProjectType = (
  method: MethodType,
  single: SingleProjectType | string
) => void;
export type SubscribeColumnType = (method: MethodType, columns: ColumnProjectType[]) => void;

type SubscribersType = {
  connection: SubscribeConnectionType[];
  open: SubscribeOpenType[];
  close: SubscribeCloseType[];
  column: SubscribeColumnType[];
  task: SubscribeTaskType[];
  comment: SubscribeCommentType[];
  project: SubscribeProjectType[];
  team: SubscribeTeamType[];
  assigned: SubscribeTaskType[];
  noted: SubscribeNotedType[];
  recent: SubscribeStringType[];
  alerts: SubscribeAlertType[];
  user: SubscribeUserType[];
  'single-project': SubscribeSingleProjectType[];
};

const subscribers: SubscribersType = {
  connection: [],
  open: [],
  close: [],
  column: [],
  task: [],
  comment: [],
  project: [],
  team: [],
  assigned: [],
  noted: [],
  recent: [],
  alerts: [],
  user: [],
  'single-project': []
};

type KeysType = keyof Omit<SubscribersType, 'connection' | 'open' | 'close'>;
const subscriberTypes: KeysType[] = [
  'assigned',
  'comment',
  'noted',
  'project',
  'recent',
  'task',
  'team',
  'alerts',
  'user',
  'single-project',
  'column'
];

let ws: WebSocket;

const openHandler = () => {
  subscribers.connection.forEach((s) => s());
};

const closeHandler = () => {
  subscribers.close.forEach((s) => s());
  setTimeout(createChannel, 3000);
};

const messageHandler = (e: MessageEvent) => {
  const newMessage = e.data;
  const obj = JSON.parse(newMessage);

  if (subscriberTypes.includes(obj.type)) {
    subscribers[obj.type as KeysType].forEach((s) => s(obj.method, obj.data));
  } else if (obj.type === 'open') {
    subscribers.open.forEach((s) => s(obj.value, obj.code));
  }
};

const resetHandlers = () => {
  ws?.removeEventListener('open', openHandler);
  ws?.removeEventListener('message', messageHandler);
  ws?.removeEventListener('close', closeHandler);
};

function createChannel() {
  resetHandlers();
  ws?.close();
  ws = new WebSocket('ws://localhost:5050');
  ws.addEventListener('open', openHandler);
  ws.addEventListener('close', closeHandler);
  ws.addEventListener('message', messageHandler);
}

export default {
  start() {
    createChannel();
  },
  subscribeConnection(callback: SubscribeConnectionType) {
    subscribers.connection.push(callback);
  },
  subscribeOpen(callback: SubscribeOpenType) {
    subscribers.open.push(callback);
  },
  subscribeUser(callback: SubscribeUserType) {
    subscribers.user.push(callback);
  },
  unsubscribeUser(callback: SubscribeUserType) {
    subscribers.user = subscribers.user.filter((s) => s !== callback);
  },
  subscribeAlerts(callback: SubscribeAlertType) {
    subscribers.alerts.push(callback);
  },
  unsubscribeAlerts(callback: SubscribeAlertType) {
    subscribers.alerts = subscribers.alerts.filter((s) => s !== callback);
  },
  subscribeAssigned(callback: SubscribeTaskType) {
    subscribers.assigned.push(callback);
  },
  unsubscribeAssigned(callback: SubscribeTaskType) {
    subscribers.assigned = subscribers.assigned.filter((s) => s !== callback);
  },
  subscribeNoted(callback: SubscribeNotedType) {
    subscribers.noted.push(callback);
  },
  unsubscribeNoted(callback: SubscribeNotedType) {
    subscribers.noted = subscribers.noted.filter((s) => s !== callback);
  },
  subscribeRecent(callback: SubscribeStringType) {
    subscribers.recent.push(callback);
  },
  unsubscribeRecent(callback: SubscribeStringType) {
    subscribers.recent = subscribers.recent.filter((s) => s !== callback);
  },
  subscribeProject(callback: SubscribeProjectType) {
    subscribers.project.push(callback);
  },
  unsubscribeProject(callback: SubscribeProjectType) {
    subscribers.project = subscribers.project.filter((s) => s !== callback);
  },
  subscribeSingleProject(callback: SubscribeSingleProjectType) {
    subscribers['single-project'].push(callback);
  },
  unsubscribeSingleProject(callback: SubscribeSingleProjectType) {
    subscribers['single-project'] = subscribers['single-project'].filter((s) => s !== callback);
  },
  subscribeColumn(callback: SubscribeColumnType) {
    subscribers.column.push(callback);
  },
  unsubscribeColumn(callback: SubscribeColumnType) {
    subscribers.column = subscribers.column.filter((s) => s !== callback);
  },
  subscribeTeam(callback: SubscribeTeamType) {
    subscribers.team.push(callback);
  },
  unsubscribeTeam(callback: SubscribeTeamType) {
    subscribers.team = subscribers.team.filter((s) => s !== callback);
  },
  subscribeTask(callback: SubscribeTaskType) {
    subscribers.task.push(callback);
  },
  unsubscribeTask(callback: SubscribeTaskType) {
    subscribers.task = subscribers.task.filter((s) => s !== callback);
  },
  subscribeComment(callback: SubscribeCommentType) {
    subscribers.comment.push(callback);
  },
  unsubscribeComment(callback: SubscribeCommentType) {
    subscribers.comment = subscribers.comment.filter((s) => s !== callback);
  },
  subscribeClose(callback: SubscribeCloseType) {
    subscribers.close.push(callback);
  },
  sendMessage(str: string) {
    ws.send(str);
  },
  stop() {
    subscribers.close.forEach((s) => s());
    Object.keys(subscribers).forEach((key) => {
      subscribers[key as keyof SubscribersType] = [];
    });
    resetHandlers();
    ws?.close();
  }
};
