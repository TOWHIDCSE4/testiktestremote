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

export const getAllTimeLogs = async (req: Request, res: Response) => {}

export const getTimeLog = async (req: Request, res: Response) => {}

export const addTimeLog = async (req: Request, res: Response) => {}

export const updateTimeLog = async (req: Request, res: Response) => {}

export const deleteTimeLog = async (req: Request, res: Response) => {}
