import React from "react";
import "../styles/DataTable.css";

export default function DataTable({ columns, data, actions }) {
  // Generate a safe unique key for each row
  const generateRowKey = (row, index) => row._id || row.id || `row-${index}`;

  return (
    <div className="table-responsive data-table-container">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-light">
          <tr>
            {columns.map((c, idx) => (
              <th key={`${c.key}-${idx}`}>{c.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={generateRowKey(row, rowIndex)}>
              {columns.map((c, colIndex) => (
                <td key={`${generateRowKey(row, rowIndex)}-${c.key}-${colIndex}`}>
                  {c.render ? c.render(row[c.key], row) : row[c.key] ?? ''}
                </td>
              ))}
              {actions && (
                <td>
                  {actions.map((a, actionIndex) => (
                    <button
                      key={`${generateRowKey(row, rowIndex)}-action-${actionIndex}`}
                      className="btn btn-sm btn-outline-primary me-2 mb-1"
                      onClick={() => a.onClick(row)}
                    >
                      {a.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
