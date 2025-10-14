import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * Reusable OperatorSelector component.
 * @param {Object} props
 * @param {string[]} props.operators - List of operator names
 * @param {string} props.value - Selected operator
 * @param {(value: string) => void} props.onChange - Change handler
 * @param {string} props.label - Label for the selector
 */
export const OperatorSelector = ({ operators, value, onChange, label }) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select an operator</option>
      {operators.map(op => (
        <option key={op} value={op}>{op}</option>
      ))}
    </Form.Select>
  </Form.Group>
);