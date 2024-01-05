export type NotedItemUserType = {
  _id: string;
  type: string;
};

export type DetailsNotedType = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  additional: {
    projectId?: string;
  };
};
