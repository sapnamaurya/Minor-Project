import React from "react";
import styled from "styled-components";

const Filter = ({
  query,
  setQuery,
  members,
  selectedMember,
  setSelectedMember,
  onExportCSV,
  onExportPDF,
}) => {
  return (
    <ControlsStyled>
      <input
        placeholder="Search (member, category, amount or date)..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedMember("");
        }}
      />
      <select
        value={selectedMember}
        onChange={(e) => {
          setSelectedMember(e.target.value);
          setQuery("");
        }}
      >
        <option value="">All Members</option>
        {members.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <button onClick={onExportCSV}>Export CSV</button>
      <button onClick={onExportPDF}>Export PDF</button>
    </ControlsStyled>
  );
};

const ControlsStyled = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;

  input {
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    min-width: 260px;
  }

  select {
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid #ddd;
  }

  button {
    padding: 0.5rem 0.8rem;
    border-radius: 8px;
    border: none;
    background: #1976d2;
    color: #fff;
    cursor: pointer;
  }
`;

export default Filter;
