import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * Reusable SwitchInput component for toggle switches.
 * @param {Object} props
 * @param {string} props.label - Switch label
 * @param {boolean} props.checked - Switch state
 * @param {(value: boolean) => void} props.onChange - Change handler
 */
export const SwitchInput = ({ label, checked, onChange }) => (
  <Form.Check
    type="switch"
    label={label}
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
    className="mb-3"
  />
);