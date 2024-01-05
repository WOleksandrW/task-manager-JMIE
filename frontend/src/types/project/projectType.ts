export type ProjectType = {
  _id: string;
  title: string;
  description: string;
  key: string;
  author: string;
  badge: string;
};

export type SingleProjectType = ProjectType & { boardTitle: string };
