"use client";

import { useState } from "react";

const Form = ({ fields, onSubmit }) => {
  const [formValues, setFormValues] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="form-control w-full max-w-sm">
      {fields.map((field) => (
        <>
          <label key={field.name} className="label">
            <span className="label-text">{field.label}</span>
          </label>
          <input
            type={field.type}
            name={field.name}
            value={formValues[field.name] || ""}
            onChange={handleInputChange}
            className="input input-border w-full max-w-sm"
          />
        </>
      ))}
      <button type="submit" className="btn btn-primary mt-4">
        Submit
      </button>
    </form>
  );
};

export default Form;
