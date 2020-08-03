export interface Character {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  isPrivate: boolean;
  gender: string;
  race: string;
  class: string;
  alignment: string;
  background: string;
  faith: string;
  createdAt?: Date;
  updatedAt?: Date;
  author?: string;
}
