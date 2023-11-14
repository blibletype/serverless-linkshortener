export interface LinkDto {
  id: string;
  originLink: string;
  userId: string;
  visits: number;
  expiresIn: string;
  createdAt: string;
}

export interface CreateLinkDto extends LinkDto {}
