export function validateField(field: any, errorLabel: any) {

  let errorMessages = [];

  errorLabel.style.display = "none";

  if (field && field.validity) {

    if (field.validity.valueMissing) {
      errorMessages.push("This field cannot be empty.");
    }

    if (field.validity.tooShort) {
      errorMessages.push(`The field requires at least ${field.minLength} characters.`);
    }

    if (field.validity.tooLong) {
      errorMessages.push(`The field requires at most ${field.maxLength} characters.`);
    }

    if (field.validity.badInput) {
      errorMessages.push("Invalid data type.");
    }
  }

  if (errorMessages.length === 0) {
    return true;
  } else {
    errorLabel.innerText = errorMessages.join("\n");
    errorLabel.style.display = "block";
    return false;
  }
};

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
}