import React, { useRef } from 'react';
import { sanitize } from '../utils/utils';

interface CloudfoxFormProps {
  onSubmitCallback?: (response: any) => void;
}

const CloudfoxForm: React.FC<CloudfoxFormProps> = ({ onSubmitCallback }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const inputs = form.querySelectorAll<HTMLInputElement>('[data-cloudfox-input]');
    const payload: Record<string, string> = {};

    inputs.forEach((input) => {
      const name = sanitize(input.getAttribute('data-cloudfox-input') || '');
      payload[name] = input.value;
    });

    const modelId = sanitize(form.getAttribute('data-cloudfox-model') || '');
    const requestData = { modelId, payload };

    const response = await fetch('http://localhost:3001/api/execute-model', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    if (onSubmitCallback) {
      onSubmitCallback(result);
    }
  };

  return (
    <form ref={formRef} data-cloudfox-model="model1" onSubmit={handleSubmit}>
      <input data-cloudfox-input="passenger_count" />
      <input data-cloudfox-input="pickup_hour" />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default CloudfoxForm;
