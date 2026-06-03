export interface Nomination {
  employee_name: string;
  nomination_reason: string;
}

export interface SurveyResponse {
  id: string;
  timestamp: string;
  voter_name: string;
  voter_phone_last4: string;
  answers: {
    nursing: Nomination;
    admin: Nomination;
  };
}

export interface SurveyQuestion {
  id: string;
  type: 'text';
  question: string;
  description?: string;
  placeholder?: string;
}
