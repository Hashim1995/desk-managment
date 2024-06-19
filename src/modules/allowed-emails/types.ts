interface IAllowedEmails {
  emailAddress: string;
  allowedEmailId: number;
  firstName: string;
  lastName: string;
  nickName: string;
}

interface IAllowedEmailsFilter {
  email: string;
}

interface IAllowedEmailsCreate extends Pick<IAllowedEmails, 'emailAddress'> { }
interface IAllowedEmailsUpdate extends Pick<IAllowedEmails, 'emailAddress'> { id: number }


interface IAllowedEmailResponse {
  totalCount: number;
  items: IAllowedEmails[];
}

export type { IAllowedEmails, IAllowedEmailResponse, IAllowedEmailsCreate, IAllowedEmailsFilter, IAllowedEmailsUpdate };
