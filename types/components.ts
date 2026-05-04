import {MouseEventHandler} from "react";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

export interface ButtonDefaultType {
    text: string;
    icon?: IconDefinition;
    backgroundColor?: string;
    borderColor?: string;
    onClick?: MouseEventHandler;
}