import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * Reusable StatInput component for number or checkbox inputs.
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type (number or checkbox)
 * @param {number|boolean} props.value - Input value
 * @param {(value: number|boolean) => void} props.onChange - Change handler
 * @param {number} [props.min] - Minimum value for number inputs
 * @param {number} [props.max] - Maximum value for number inputs
 */
export const StatInput = ({ label, type, value, onChange, min, max }) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type={type}
      value={type === 'number' ? value : undefined}
      checked={type === 'checkbox' ? value : undefined}
      onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) || 0 : e.target.checked)}
      min={min}
      max={max}
    />
  </Form.Group>
);