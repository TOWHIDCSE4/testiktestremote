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

export const getAllTimers = async (req: Request, res: Response) => {}

export const getTimer = async (req: Request, res: Response) => {}

export const addTimer = async (req: Request, res: Response) => {}

export const updateTimer = async (req: Request, res: Response) => {}

export const deleteTimer = async (req: Request, res: Response) => {}
