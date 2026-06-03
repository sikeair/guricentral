import { supabase } from './supabase';

export interface NominationRow {
  id: string;
  created_at: string;
  voter_name: string;
  voter_phone_last4: string;
  nurse_employee_name: string;
  nurse_nomination_reason: string;
  admin_employee_name: string;
  admin_nomination_reason: string;
}

// Convert flat DB row → SurveyResponse shape used in components
export function rowToResponse(row: NominationRow) {
  return {
    id: row.id,
    timestamp: row.created_at,
    voter_name: row.voter_name,
    voter_phone_last4: row.voter_phone_last4,
    answers: {
      nursing: {
        employee_name: row.nurse_employee_name,
        nomination_reason: row.nurse_nomination_reason,
      },
      admin: {
        employee_name: row.admin_employee_name,
        nomination_reason: row.admin_nomination_reason,
      },
    },
  };
}

export async function saveResponse(response: ReturnType<typeof rowToResponse>) {
  const { error } = await supabase.from('survey_responses').insert({
    id: response.id,
    voter_name: response.voter_name,
    voter_phone_last4: response.voter_phone_last4,
    nurse_employee_name: response.answers.nursing.employee_name,
    nurse_nomination_reason: response.answers.nursing.nomination_reason,
    admin_employee_name: response.answers.admin.employee_name,
    admin_nomination_reason: response.answers.admin.nomination_reason,
  });
  if (error) throw error;
}

export async function fetchResponses() {
  const { data, error } = await supabase
    .from('survey_responses')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as NominationRow[]).map(rowToResponse);
}

export async function clearResponses() {
  const { error } = await supabase
    .from('survey_responses')
    .delete()
    .neq('id', ''); // delete all rows
  if (error) throw error;
}
