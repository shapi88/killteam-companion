import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * Reusable TeamSelector component.
 * @param {Object} props
 * @param {string[]} props.teams - List of team names
 * @param {string} props.value - Selected team
 * @param {(value: string) => void} props.onChange - Change handler
 * @param {string} props.label - Label for the selector
 */
export const TeamSelector = ({ teams, value, onChange, label }) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select a team</option>
      {teams.map(team => (
        <option key={team} value={team}>{team}</option>
      ))}
    </Form.Select>
  </Form.Group>
);