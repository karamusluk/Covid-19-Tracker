import "./InfoBox.css";

import { Card, CardContent, Typography } from "@material-ui/core";

import React from "react";
import { prettyPrint } from "./utils";

function InfoBox({ title, type, cases, active, total, ...props }) {
  const activeClass = `infoBox--${props.casesType}`;

  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && activeClass}`}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${type}-color`}>
          {prettyPrint({ text: cases, prefix: "+" })}
        </h2>
        <Typography className="infoBox__total" color="textSecondary">
          {prettyPrint({ text: total })} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
