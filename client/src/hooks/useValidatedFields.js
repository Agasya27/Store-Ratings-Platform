import { useState } from 'react';

export function useValidatedFields(initialValues, validators) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    if (touched[name] && validators[name]) {
      const result = validators[name](value);
      setErrors((e) => ({ ...e, [name]: result.valid ? '' : result.error }));
    }
  }

  function blurField(name) {
    setTouched((t) => ({ ...t, [name]: true }));
    if (validators[name]) {
      const result = validators[name](values[name]);
      setErrors((e) => ({ ...e, [name]: result.valid ? '' : result.error }));
    }
  }

  function validateAll() {
    const newErrors = {};
    let valid = true;
    for (const [name, validator] of Object.entries(validators)) {
      const result = validator(values[name]);
      if (!result.valid) {
        newErrors[name] = result.error;
        valid = false;
      }
    }
    setErrors(newErrors);
    setTouched(Object.fromEntries(Object.keys(validators).map((k) => [k, true])));
    return valid;
  }

  function reset(nextValues = initialValues) {
    setValues(nextValues);
    setErrors({});
    setTouched({});
  }

  return { values, errors, setField, blurField, validateAll, reset, setValues };
}

export function useValidatedField(initialValue, validator, requiredMessage) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  function blur() {
    setTouched(true);
    if (!value && requiredMessage) {
      setError(requiredMessage);
      return;
    }
    const result = validator(value);
    setError(result.valid ? '' : result.error);
  }

  function change(next) {
    setValue(next);
    if (touched) {
      if (!next && requiredMessage) {
        setError(requiredMessage);
      } else {
        const result = validator(next);
        setError(result.valid ? '' : result.error);
      }
    }
  }

  function validate() {
    setTouched(true);
    if (!value && requiredMessage) {
      setError(requiredMessage);
      return false;
    }
    const result = validator(value);
    setError(result.valid ? '' : result.error);
    return result.valid;
  }

  return { value, error, touched, blur, change, validate, setValue };
}
