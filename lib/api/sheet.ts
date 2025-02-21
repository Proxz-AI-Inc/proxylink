export const addApplicationToSheet = async (data: {
  companyName: string;
  companyWebsite: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  phoneNumber: string;
  dateApplied: string;
}) => {
  const response = await fetch('/api/sheets/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Something went wrong. Please try again later.');
  }

  return response.json();
};
