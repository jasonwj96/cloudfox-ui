
import { sanitize } from './utils';

export const processRequest = async (formElement: any, callback: CallableFunction) => {
  const modelId = sanitize(formElement.getAttribute('data-cloudfox-model'));
  const inputs = formElement.querySelectorAll('[data-cloudfox-input]');
  const payload: any = {};

  inputs.forEach((input: any) => {
    const name = sanitize(input.getAttribute('data-cloudfox-input'));
    payload[name] = input.value;
  });

  const requestData = { modelId, payload };

  const response = await fetch('http://localhost:3001/api/execute-model', {
    method: 'POST',
    body: JSON.stringify(requestData),
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await response.json();
  if (callback) callback(result);
};
