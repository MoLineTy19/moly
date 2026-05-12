import {MouseEventHandler} from "react";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

export interface ButtonDefaultType {
    text: string;
    icon?: IconDefinition;
    backgroundColor?: string;
    borderColor?: string;
    onClick?: MouseEventHandler;
}

export interface Tag {
    id: number;
    title: string;
    iconId: number;
    color: string;
    backgroundColor: string;
    borderColor: string;
    countUses: number;
    position: number;
}

export interface TagColorScheme {
    color: string;
    backgroundColor: string;
    borderColor: string;
}

export interface ColorCircleScheme {
    color: string;
    onClick: MouseEventHandler;
    isSelected: boolean;
}

export interface IconOptionScheme {
    icon: IconDefinition;
    onClick: MouseEventHandler;
    isSelected: boolean;
}