import React from "react";
import SearchCompany from "./SearchCompany";
import SearchEmployee from "./SearchEmployee";

export default function Search({ me }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: 'flex'
      }}
    >
      {me.role === "SYSTEM_ADMIN" && <SearchCompany />}
      {(me.role === "SYSTEM_ADMIN" || me.role === "ADMIN") && (
        <SearchEmployee me={me} />
      )}
    </div>
  );
}
