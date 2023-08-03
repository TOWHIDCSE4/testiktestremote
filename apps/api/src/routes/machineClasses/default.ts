import express from "express"
import { Request, Response } from "express"
import Users from "../../models/users"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  ACCOUNT_ALREADY_EXISTS,
} from "../../utils/constants"
import CryptoJS from "crypto-js"
import { keys } from "../../config/keys"
import isEmpty from "lodash/isEmpty"

export const getAllMachineClasses = async (req: Request, res: Response) => {}

export const getMachineClass = async (req: Request, res: Response) => {}

export const addMachineClass = async (req: Request, res: Response) => {}

export const updateMachineClass = async (req: Request, res: Response) => {}

export const deleteMachineClass = async (req: Request, res: Response) => {}
