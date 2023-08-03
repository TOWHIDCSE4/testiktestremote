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

export const getAllMachines = async (req: Request, res: Response) => {}

export const getMachine = async (req: Request, res: Response) => {}

export const addMachine = async (req: Request, res: Response) => {}

export const updateMachine = async (req: Request, res: Response) => {}

export const deleteMachine = async (req: Request, res: Response) => {}
