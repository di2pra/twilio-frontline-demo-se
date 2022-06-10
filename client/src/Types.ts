export interface IConfiguration {
  selectedPollyVoice: string;
  companyNameShort: string;
  companyNameLong: string;
  companyUrl: string;
  welcomeKnownContact: string;
  welcomeUnknownContact: string;
  agentBusyAnswer: string;
  agentNotFoundAnswer: string
}

export interface IClaim {
  id: number;
  user: string;
  started_at: Date;
  ended_at: Date;
}

export interface IConversation {
  sid: string;
  friendlyName: string;
  chatServiceSid: string;
  dateCreated: string;
  dateUpdated: string;
  state: string;
}

export interface ISettingData {
  lang: string;
  friendly_name: string;
  pollyVoice: string[];
  phoneNumberSMS: string;
  phoneNumberWA: string;
  phoneNumberVoice: string;
}

export interface ISetting {
  selectedSetting: ISettingData;
  settings: ISettingData[]
}

export interface ITemplate {
  display_name: string;
  templates: {
    content: string;
    whatsAppApproved: boolean;
  }[]
}

export enum IBootstrapVariant {
  PRIMARY = 'primary', 
  SECONDARY = 'secondary', 
  SUCCESS = 'success', 
  DANGER = 'danger', 
  WARNING = 'warning', 
  INFO = 'info', 
  DARK = 'dark', 
  LIGHT = 'light', 
  LINK = 'link'
}

export enum IConfirmationModalBtnValue {
  No = 0,
  Yes = 1,
}