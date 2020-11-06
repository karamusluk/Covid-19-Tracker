import "./Table.css";

import React from "react";
import { prettyPrint } from "./utils";

function Table({ countries }) {
  return (
    <div className="table">
      {countries.map(({ country, cases }) => {
        return (
          <tr>
            <td>{country}</td>
            <td>
              <strong>{prettyPrint({ text: cases, format: "0,0" })}</strong>
            </td>
          </tr>
        );
      })}
    </div>
  );
}

export default Table;
