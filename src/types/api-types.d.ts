export interface RequestAuthBody {
  email: string;
  password: string;
}

export interface ResponseAuthBody {
  status: boolean;
  data: {
    id: string;
    accessToken: string;
    refreshToken: string;
  }
}

export interface ResponseError {
  status: boolean;
  data: {
    message: string;
  }
}

export interface CreateLinkBody {
  originLink: string;
  expiresIn?: string;
}

export interface ResponseCreateLinkBody {
  status: boolean;
  data: {
    newLink: string;
    originLink: string;
  }
}

export interface ResponseDeactivateLinkBody {
  status: boolean;
  data: {
    message: string;
  }
}

export interface FormattedLinkItem {
  link: string;
  originLink: string;
  visits: number;
  expiresIn: string;
  createdAt: string;
}

export interface ResponseListLinks {
  status: boolean;
  data: FormattedLinkItem[]
}

