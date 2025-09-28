import React from "react";
import styled from "styled-components";

const Summary = ({ memberSummary = {}, settlements = [] }) => {
  return (
    <SideCard>
      <h3>Member Summary</h3>
      <SummaryList>
        {Object.entries(memberSummary).map(([name, s]) => (
          <li key={name}>
            <div>
              <strong>{name}</strong>
              <div style={{ fontSize: 13, color: "#666" }}>
                Paid: ₹{s.paid} • Share: ₹{s.share}
              </div>
            </div>
            <div
              style={{
                fontWeight: 700,
                color: s.net >= 0 ? "#2e7d32" : "#d32f2f",
              }}
            >
              {s.net >= 0 ? `Get ₹${s.net}` : `Owe ₹${Math.abs(s.net)}`}
            </div>
          </li>
        ))}
      </SummaryList>

      <h4 style={{ marginTop: 16 }}>Suggested Settlements</h4>
      {settlements.length === 0 ? (
        <p style={{ color: "#666" }}>
          No settlements needed — balances are settled.
        </p>
      ) : (
        <SettlementList>
          {settlements.map((s, idx) => (
            <li key={idx}>
              <span style={{ fontWeight: 600 }}>{s.from}</span> →{" "}
              <span style={{ fontWeight: 600 }}>{s.to}</span>
              <div style={{ fontWeight: 700 }}>₹{s.amount}</div>
            </li>
          ))}
        </SettlementList>
      )}
    </SideCard>
  );
};

const SideCard = styled.div`
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
  h3 {
    margin-top: 0;
    color: #1a237e;
  }
`;

const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-radius: 8px;
    background: #fafbfd;
  }
`;

const SettlementList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-radius: 8px;
    background: #fff8f0;
    border: 1px solid #ffe5d0;
  }
`;

export default Summary;
