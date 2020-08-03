export interface Character {
  _id: string;
  name: string;
  description: string;
  isPrivate?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  author?: string;
  imageUrl?: string;
  race?: string;
  class?: string;
  gender?: string;
  alignment?: string;
  faith?: string;
  background?: string;
}
