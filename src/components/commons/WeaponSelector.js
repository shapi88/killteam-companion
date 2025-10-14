import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * Reusable WeaponSelector component.
 * @param {Object} props
 * @param {string[]} props.weapons - List of weapon names
 * @param {string} props.value - Selected weapon
 * @param {(value: string) => void} props.onChange - Change handler
 * @param {string} props.label - Label for the selector
 */
export const WeaponSelector = ({ weapons, value, onChange, label }) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select a weapon</option>
      {weapons.map(w => (
        <option key={w} value={w}>{w}</option>
      ))}
    </Form.Select>
  </Form.Group>
);